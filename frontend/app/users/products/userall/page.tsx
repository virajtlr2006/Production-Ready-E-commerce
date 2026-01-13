'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Products } from '../new/page'
import { useRouter } from 'next/navigation'
import { Edit2, Trash2, Package, Loader2, AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const page = () => {

    // State to hold user productserror
    const [userproducts, setUserproducts] = useState<Products[] | null>(null)
    const [errormsg, setErrormsg] = useState(null)
    const [deleteDialog, setDeleteDialog] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        FetchUserProducts()
    }, [])

    // Next.js router
    const router = useRouter()

    // Function to fetch products of the logged-in user
    const FetchUserProducts = async () => {
        try {
            setLoading(true)
            // Get user email from local storage
            const email = localStorage.getItem("useremail")

            // Redirect to login if email is not found
            if (!email) {
                router.push("/users/login")
                // Break the function execution
                return false
            }
            // Make POST request to fetch user products
            const response = await axios.post("http://localhost:8080/users/userproducts", { email })
            // Set the fetched products to state
            setUserproducts(response.data.userproducts)
        } catch (error: any) {
            // Log if any errors occurs
            setErrormsg(error.response.data.message)
        } finally {
            setLoading(false)
        }
    }

    // Delete User Product
    const DeleteProduct = async (id: number) => {
        try {
            const response = await axios.delete(`http://localhost:8080/products/deleteproduct/${id}`)
            FetchUserProducts()
            setDeleteDialog(null)
        } catch (error:any) {
            setErrormsg(error.response.data.message)
        }
    }

    // Edit User Product
    const EditProduct = async (id:number) => {
        await router.push(`/users/products/edit/${id}`)
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {errormsg && (
                    <div className="mb-6 p-3 bg-red-100 border border-red-400 rounded text-red-700 text-sm">
                        {errormsg}
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col justify-center items-center py-20">
                        <Loader2 className="h-10 w-10 text-orange-500 animate-spin mb-3" />
                        <p className="text-gray-600 text-sm">Loading your products...</p>
                    </div>
                ) : userproducts && userproducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {userproducts.map((u) => (
                            <div key={u.id} className="bg-white border border-gray-200 rounded hover:shadow-md transition-shadow">
                                <a href={`/users/products/${u.id}`} className="block">
                                    <div className="relative aspect-square bg-white p-4 flex items-center justify-center">
                                        <img 
                                            src={u.image_url} 
                                            alt={u.p_name}
                                            className="w-full h-full object-contain"
                                        />
                                        <div className="absolute top-2 right-2">
                                            {u.isApproved ? (
                                                <Badge variant="success" className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 bg-green-600">
                                                    <CheckCircle2 className="h-2.5 w-2.5" />
                                                    Approved
                                                </Badge>
                                            ) : (
                                                <Badge variant="warning" className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 bg-yellow-500">
                                                    <Clock className="h-2.5 w-2.5" />
                                                    Pending
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </a>
                                <div className="p-3 border-t border-gray-200">
                                    <a href={`/users/products/${u.id}`}>
                                        <h2 className="text-sm text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem] hover:text-orange-600">
                                            {u.p_name}
                                        </h2>
                                        <div className="flex items-baseline gap-1 mb-2">
                                            <span className="text-xs text-gray-600">$</span>
                                            <span className="text-2xl font-medium text-gray-900">{u.price}</span>
                                        </div>
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-gray-100">
                                                {u.category}
                                            </Badge>
                                            <span className="text-xs text-gray-600">Stock: {u.stock}</span>
                                        </div>
                                    </a>
                                    <div className="flex gap-1.5 pt-2 border-t border-gray-100">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 h-7 text-xs px-2 bg-white hover:bg-gray-50"
                                            onClick={() => EditProduct(u.id)}
                                        >
                                            <Edit2 className="h-3 w-3" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 h-7 text-xs px-2 bg-white hover:bg-red-50 text-red-600 border-red-300 hover:border-red-400"
                                            onClick={() => setDeleteDialog(u.id)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 text-base font-medium">No products yet</p>
                        <p className="text-gray-500 text-sm mt-1">Start by adding your first product</p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog !== null} onOpenChange={(open) => !open && setDeleteDialog(null)}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-medium">Delete Product</DialogTitle>
                        <DialogDescription className="text-sm text-gray-600">
                            Are you sure you want to delete this product? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialog(null)} className="bg-white">
                            Cancel
                        </Button>
                        <Button 
                            variant="outline" 
                            className="bg-red-600 text-white hover:bg-red-700 border-red-600"
                            onClick={() => deleteDialog && DeleteProduct(deleteDialog)}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default page