'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, FileText, User, Package, Loader2, AlertCircle, Search, CheckCircle, Clock, XCircle } from 'lucide-react'

export interface Orders {
    order_id: number;
    invoice_no: number;
    user_id: string;
    product_id: number;
    image_url : string;
    status: string;
}

const page = () => {

    const [allOrders, setallOrders] = useState<Orders[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'cancelled'>('all')

    useEffect(() => {
        FetchOrders()
    }, [])


    const FetchOrders = async () => {
        try {
            setLoading(true)
            const allOrders = await axios.get("http://localhost:8080/admin/orderlist")
            setallOrders(allOrders.data.AllOrders)
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false)
        }
    }

    // Filter orders based on search query and status
    const filteredOrders = allOrders?.filter(order => {
        const matchesSearch = 
            order.order_id.toString().includes(searchQuery) ||
            order.invoice_no.toString().includes(searchQuery) ||
            order.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.product_id.toString().includes(searchQuery)
        
        const matchesStatus = filterStatus === 'all' || order.status.toLowerCase() === filterStatus.toLowerCase()
        
        return matchesSearch && matchesStatus
    }) || []

    // Calculate stats
    const totalOrders = allOrders?.length || 0
    const completedOrders = allOrders?.filter(o => o.status.toLowerCase() === 'completed').length || 0
    const pendingOrders = allOrders?.filter(o => o.status.toLowerCase() === 'pending').length || 0
    const cancelledOrders = allOrders?.filter(o => o.status.toLowerCase() === 'cancelled').length || 0

    // Function to get status badge
    const getStatusBadge = (status: string) => {
        const statusLower = status.toLowerCase()
        if (statusLower === 'completed') {
            return (
                <Badge className="bg-green-100 text-green-700 border-green-300">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                </Badge>
            )
        } else if (statusLower === 'pending') {
            return (
                <Badge className="bg-orange-100 text-orange-700 border-orange-300">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                </Badge>
            )
        } else if (statusLower === 'cancelled') {
            return (
                <Badge className="bg-red-100 text-red-700 border-red-300">
                    <XCircle className="h-3 w-3 mr-1" />
                    Cancelled
                </Badge>
            )
        } else {
            return <Badge variant="secondary">{status}</Badge>
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-blue-600 rounded-lg blur-sm opacity-75"></div>
                                <div className="relative p-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg shadow-lg">
                                    <ShoppingCart className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
                                <p className="text-sm text-gray-600">View and manage all customer orders</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-indigo-600 mb-1">Total Orders</p>
                                    <p className="text-2xl font-bold text-indigo-900">{totalOrders}</p>
                                </div>
                                <div className="p-2 bg-indigo-200 rounded-lg">
                                    <ShoppingCart className="h-5 w-5 text-indigo-700" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-green-600 mb-1">Completed</p>
                                    <p className="text-2xl font-bold text-green-900">{completedOrders}</p>
                                </div>
                                <div className="p-2 bg-green-200 rounded-lg">
                                    <CheckCircle className="h-5 w-5 text-green-700" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-orange-600 mb-1">Pending</p>
                                    <p className="text-2xl font-bold text-orange-900">{pendingOrders}</p>
                                </div>
                                <div className="p-2 bg-orange-200 rounded-lg">
                                    <Clock className="h-5 w-5 text-orange-700" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-red-600 mb-1">Cancelled</p>
                                    <p className="text-2xl font-bold text-red-900">{cancelledOrders}</p>
                                </div>
                                <div className="p-2 bg-red-200 rounded-lg">
                                    <XCircle className="h-5 w-5 text-red-700" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Search by order ID, invoice, user ID, or product ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 pr-10 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            />
                            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={filterStatus === 'all' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilterStatus('all')}
                                className={filterStatus === 'all' ? 'bg-indigo-500 hover:bg-indigo-600' : ''}
                            >
                                All
                            </Button>
                            <Button
                                variant={filterStatus === 'completed' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilterStatus('completed')}
                                className={filterStatus === 'completed' ? 'bg-green-600 hover:bg-green-700' : ''}
                            >
                                Completed
                            </Button>
                            <Button
                                variant={filterStatus === 'pending' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilterStatus('pending')}
                                className={filterStatus === 'pending' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                            >
                                Pending
                            </Button>
                            <Button
                                variant={filterStatus === 'cancelled' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilterStatus('cancelled')}
                                className={filterStatus === 'cancelled' ? 'bg-red-600 hover:bg-red-700' : ''}
                            >
                                Cancelled
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
                            <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-3" />
                            <p className="text-gray-600 text-sm">Loading orders...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50">
                                        <TableHead className="font-semibold">
                                            <div className="flex items-center gap-2">
                                                <ShoppingCart className="h-4 w-4 text-indigo-600" />
                                                Order ID
                                            </div>
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-indigo-600" />
                                                Invoice No.
                                            </div>
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-indigo-600" />
                                                User ID
                                            </div>
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4 text-indigo-600" />
                                                Product ID
                                            </div>
                                        </TableHead>
                                        <TableHead className="font-semibold">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders && filteredOrders.length > 0 ? (
                                        filteredOrders.map((o) => (
                                            <TableRow key={o.order_id} className="hover:bg-indigo-50">
                                                <TableCell className="font-medium">
                                                    <Badge variant="outline" className="text-indigo-700 border-indigo-300">
                                                        #{o.order_id}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-medium text-gray-900">
                                                    INV-{o.invoice_no}
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-600">
                                                    {o.user_id}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="text-xs">
                                                        #{o.product_id}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(o.status)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-12">
                                                <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                                <p className="text-gray-600 font-medium">No orders found</p>
                                                <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filter</p>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                {allOrders && allOrders.length > 0 && (
                    <div className="mt-4 text-center text-sm text-gray-600">
                        <p>Showing {filteredOrders.length} of {allOrders.length} orders</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default page