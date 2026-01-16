'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Products } from '../new/page'
import { useRouter } from 'next/navigation'
import { Edit2, Trash2, Package, Loader2, AlertCircle, CheckCircle2, Clock, Plus, Eye, DollarSign, BarChart3 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { API_ENDPOINTS } from '@/lib/api'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const page = () => {
    // State to hold user products
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
                return false
            }
            // Make POST request to fetch user products
            const response = await axios.post(API_ENDPOINTS.USER_PRODUCTS, { email })
            // Set the fetched products to state
            setUserproducts(response.data.userproducts)

            
        } catch (error: any) {
            // Log if any errors occurs
            setErrormsg(error.response?.data?.message || 'Failed to load products')
        } finally {
            setLoading(false)
        }
    }

    // Delete User Product
    const DeleteProduct = async (id: number) => {
        try {
            await axios.delete(API_ENDPOINTS.DELETE_PRODUCT(id))
            FetchUserProducts()
            setDeleteDialog(null)
        } catch (error: any) {
            setErrormsg(error.response?.data?.message || 'Failed to delete product')
        }
    }

    // Edit User Product
    const EditProduct = async (id: number) => {
        await router.push(`/users/products/edit/${id}`)
    }

    // Calculate stats
    const stats = userproducts ? {
        total: userproducts.length,
        approved: userproducts.filter(p => p.isApproved).length,
        pending: userproducts.filter(p => !p.isApproved).length,
        totalValue: userproducts.reduce((sum, p) => sum + parseFloat(String(p.price)), 0)
    } : { total: 0, approved: 0, pending: 0, totalValue: 0 }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <Package className="h-6 w-6 text-orange-600" />
                                </div>
                                My Products
                            </h1>
                            <p className="text-gray-600 text-sm mt-2">Manage and track your product listings</p>
                        </div>
                        <button
                            onClick={() => router.push('/users/products/new')}
                            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                        >
                            <Plus size={20} />
                            Add Product
                        </button>
                    </div>

                    {/* Stats Cards */}
                    {!loading && userproducts && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-600 text-xs font-semibold uppercase tracking-wide">Total Products</p>
                                        <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
                                    </div>
                                    <Package className="h-8 w-8 text-blue-500 opacity-50" />
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-600 text-xs font-semibold uppercase tracking-wide">Approved</p>
                                        <p className="text-2xl font-bold text-green-900 mt-1">{stats.approved}</p>
                                    </div>
                                    <CheckCircle2 className="h-8 w-8 text-green-500 opacity-50" />
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-yellow-600 text-xs font-semibold uppercase tracking-wide">Pending</p>
                                        <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.pending}</p>
                                    </div>
                                    <Clock className="h-8 w-8 text-yellow-500 opacity-50" />
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-600 text-xs font-semibold uppercase tracking-wide">Total Value</p>
                                        <p className="text-2xl font-bold text-purple-900 mt-1">${stats.totalValue.toFixed(0)}</p>
                                    </div>
                                    <DollarSign className="h-8 w-8 text-purple-500 opacity-50" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {errormsg && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-red-800 font-semibold text-sm">Error</p>
                            <p className="text-red-700 text-sm">{errormsg}</p>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col justify-center items-center py-20 bg-white rounded-lg border border-gray-200">
                        <Loader2 className="h-12 w-12 text-orange-500 animate-spin mb-4" />
                        <p className="text-gray-600 text-base font-medium">Loading your products...</p>
                        <p className="text-gray-500 text-sm mt-1">Please wait a moment</p>
                    </div>
                ) : userproducts && userproducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {userproducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-lg shadow-sm hover:shadow-lg border border-gray-200 transition-all duration-300 overflow-hidden group"
                            >
                                {/* Product Image */}
                                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                                    <a href={`/users/products/${product.id}`}>
                                        <img
                                            src={product.image_url}
                                            alt={product.p_name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </a>

                                    {/* Status Badge */}
                                    <div className="absolute top-3 right-3">
                                        {product.isApproved ? (
                                            <Badge className="flex items-center gap-1 text-xs px-2 py-1 bg-green-500 text-white shadow-md">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Approved
                                            </Badge>
                                        ) : (
                                            <Badge className="flex items-center gap-1 text-xs px-2 py-1 bg-yellow-500 text-white shadow-md">
                                                <Clock className="h-3 w-3" />
                                                Pending
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Quick View Button */}
                                    <a
                                        href={`/users/products/${product.id}`}
                                        className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-colors duration-300"
                                    >
                                        <button className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-opacity duration-300 shadow-lg">
                                            <Eye size={16} />
                                            View
                                        </button>
                                    </a>
                                </div>

                                {/* Product Info */}
                                <div className="p-4">
                                    {/* Category */}
                                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800 mb-2 inline-block">
                                        {product.category}
                                    </Badge>

                                    {/* Product Name */}
                                    <a href={`/users/products/${product.id}`}>
                                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-orange-600 transition-colors mb-3 min-h-[2.5rem]">
                                            {product.p_name}
                                        </h3>
                                    </a>

                                    {/* Price and Stock Row */}
                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Price</p>
                                            <p className="text-xl font-bold text-gray-900">${product.price}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-600 mb-1">Stock</p>
                                            <p className={`text-lg font-bold ${product.stock > 5 ? 'text-green-600' : 'text-red-600'}`}>
                                                {product.stock}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Description Preview */}
                                    <p className="text-xs text-gray-600 line-clamp-2 mb-4">
                                        {product.description}
                                    </p>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 pt-2">
                                        <button
                                            onClick={() => EditProduct(product.id)}
                                            className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold py-2 px-3 rounded-lg transition-colors duration-200 text-sm border border-blue-200"
                                        >
                                            <Edit2 size={16} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteDialog(product.id)}
                                            className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 px-3 rounded-lg transition-colors duration-200 text-sm border border-red-200"
                                        >
                                            <Trash2 size={16} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border border-gray-200 text-center py-16">
                        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-900 text-lg font-bold mb-2">No products yet</p>
                        <p className="text-gray-600 text-sm mb-6">Start selling by adding your first product to our marketplace</p>
                        <button
                            onClick={() => router.push('/users/products/new')}
                            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
                        >
                            <Plus size={18} />
                            Add Your First Product
                        </button>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog !== null} onOpenChange={(open) => !open && setDeleteDialog(null)}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900">Delete Product</DialogTitle>
                        <DialogDescription className="text-gray-600">
                            Are you sure you want to delete this product? This action cannot be undone and will permanently remove it from your inventory.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialog(null)}
                            className="bg-white border-gray-300 text-gray-900 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-red-600 text-white hover:bg-red-700"
                            onClick={() => deleteDialog && DeleteProduct(deleteDialog)}
                        >
                            <Trash2 size={16} className="mr-2" />
                            Delete Product
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default page