'use client'

import { Products } from '@/app/users/products/new/page'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Check, X, Package, ShieldCheck, Search, Loader2, Eye } from 'lucide-react'
import { API_ENDPOINTS } from '@/lib/api'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const page = () => {

    // State to hold all products
    const [allProducts, setAllProducts] = useState<Products[] | null>(null)
    const [filteredProducts, setFilteredProducts] = useState<Products[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending'>('all')

    useEffect(() => {
        FetchAllProducts()
    }, [])

    useEffect(() => {
        if (!allProducts) return
        
        let filtered = [...allProducts]
        
        // Filter by search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(p => 
                p.p_name.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query) ||
                p.email.toLowerCase().includes(query)
            )
        }
        
        // Filter by status
        if (filterStatus === 'approved') {
            filtered = filtered.filter(p => p.isApproved)
        } else if (filterStatus === 'pending') {
            filtered = filtered.filter(p => !p.isApproved)
        }
        
        setFilteredProducts(filtered)
    }, [allProducts, searchQuery, filterStatus])


    const FetchAllProducts = async () => {
        try {
            setLoading(true)
            const response = await axios.get(API_ENDPOINTS.ALL_PRODUCTS)
            setAllProducts(response.data.Allproducts)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    // Function to approve a product
    const ApproveProduct = async (id:number) => {
        await axios.post(API_ENDPOINTS.APPROVE_PRODUCT(id))
        FetchAllProducts()

        // const email = localStorage.getItem("useremail")
        // // console.log(email)
        // const notification = await axios.post(API_ENDPOINTS.Get_notification , {email})
        // console.log(notification.data)
    }

    // Function to reject a product
    const RejectProduct = async (id:number) => {
        await axios.post(API_ENDPOINTS.REJECT_PRODUCT(id))
        FetchAllProducts()
    }

    const pendingCount = allProducts?.filter(p => !p.isApproved).length || 0
    const approvedCount = allProducts?.filter(p => p.isApproved).length || 0

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg blur-sm opacity-75"></div>
                                <div className="relative p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg">
                                    <Package className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
                                <p className="text-sm text-gray-600">Review and manage all products</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-blue-600 mb-1">Total Products</p>
                                    <p className="text-2xl font-bold text-blue-900">{allProducts?.length || 0}</p>
                                </div>
                                <div className="p-2 bg-blue-200 rounded-lg">
                                    <Package className="h-5 w-5 text-blue-700" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-green-600 mb-1">Approved</p>
                                    <p className="text-2xl font-bold text-green-900">{approvedCount}</p>
                                </div>
                                <div className="p-2 bg-green-200 rounded-lg">
                                    <Check className="h-5 w-5 text-green-700" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-orange-600 mb-1">Pending Review</p>
                                    <p className="text-2xl font-bold text-orange-900">{pendingCount}</p>
                                </div>
                                <div className="p-2 bg-orange-200 rounded-lg">
                                    <ShieldCheck className="h-5 w-5 text-orange-700" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Search by product name, category, or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 pr-10 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                            />
                            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={filterStatus === 'all' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilterStatus('all')}
                                className={filterStatus === 'all' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                            >
                                All
                            </Button>
                            <Button
                                variant={filterStatus === 'approved' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilterStatus('approved')}
                                className={filterStatus === 'approved' ? 'bg-green-600 hover:bg-green-700' : ''}
                            >
                                Approved
                            </Button>
                            <Button
                                variant={filterStatus === 'pending' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilterStatus('pending')}
                                className={filterStatus === 'pending' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                            >
                                Pending
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="h-10 w-10 text-orange-500 animate-spin mb-3" />
                            <p className="text-gray-600 text-sm">Loading products...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50">
                                        <TableHead className="font-semibold">ID</TableHead>
                                        <TableHead className="font-semibold">Email</TableHead>
                                        <TableHead className="font-semibold">Category</TableHead>
                                        <TableHead className="font-semibold">Product</TableHead>
                                        <TableHead className="font-semibold">Price</TableHead>
                                        <TableHead className="font-semibold">Stock</TableHead>
                                        <TableHead className="font-semibold">Image</TableHead>
                                        <TableHead className="font-semibold">Status</TableHead>
                                        <TableHead className="font-semibold text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProducts && filteredProducts.length > 0 ? (
                                        filteredProducts.map((p) => (
                                            <TableRow key={p.id} className="hover:bg-gray-50">
                                                <TableCell className="font-medium">#{p.id}</TableCell>
                                                <TableCell className="text-sm text-gray-600">{p.email}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {p.category}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-medium">{p.p_name}</TableCell>
                                                <TableCell className="font-semibold text-gray-900">${p.price}</TableCell>
                                                <TableCell>{p.stock}</TableCell>
                                                <TableCell>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="outline" size="sm" className="gap-1">
                                                                <Eye className="h-3 w-3" />
                                                                View
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>{p.p_name}</DialogTitle>
                                                                <DialogDescription>
                                                                    <img src={p.image_url} alt={p.p_name} className="w-full rounded-lg mt-2"/>
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                        </DialogContent>
                                                    </Dialog>
                                                </TableCell>
                                                <TableCell>
                                                    {p.isApproved ? (
                                                        <Badge variant="success" className="bg-green-100 text-green-700 border-green-300">
                                                            <Check className="h-3 w-3 mr-1" />
                                                            Approved
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="warning" className="bg-orange-100 text-orange-700 border-orange-300">
                                                            <ShieldCheck className="h-3 w-3 mr-1" />
                                                            Pending
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-center gap-2">
                                                        {!p.isApproved && (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => ApproveProduct(p.id)}
                                                                className="bg-green-600 hover:bg-green-700 text-white"
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => RejectProduct(p.id)}
                                                            className="text-red-600 border-red-300 hover:bg-red-50"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={9} className="text-center py-12">
                                                <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                                <p className="text-gray-600 font-medium">No products found</p>
                                                <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filter</p>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default page