'use client'

import { Orders } from '@/app/admin/allorders/page'
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
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, FileText, Package, Loader2, AlertCircle, CheckCircle, Clock, XCircle, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const page = () => {

    const [userOrders, setuserOrders] = useState<Orders[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'cancelled'>('all')

    useEffect(() => {
        FetchUserOrders()
    }, [])


    const FetchUserOrders = async () => {
        try {
            setLoading(true)
            const email = localStorage.getItem("useremail")
            const MyOrders = await axios.post("http://localhost:8080/users/userallOrders", { email })
            setuserOrders(MyOrders.data.UserOrders)
        } catch (error) {
            console.error("Error fetching orders:", error)
        } finally {
            setLoading(false)
        }
    }

    // Filter orders based on search query and status
    const filteredOrders = userOrders?.filter(order => {
        const matchesSearch =
            order.order_id.toString().includes(searchQuery) ||
            order.invoice_no.toString().includes(searchQuery) ||
            order.product_id.toString().includes(searchQuery)

        const matchesStatus = filterStatus === 'all' || order.status.toLowerCase() === filterStatus.toLowerCase()

        return matchesSearch && matchesStatus
    }) || []

    // Calculate stats
    const totalOrders = userOrders?.length || 0
    const completedOrders = userOrders?.filter(o => o.status.toLowerCase() === 'completed').length || 0
    const pendingOrders = userOrders?.filter(o => o.status.toLowerCase() === 'pending').length || 0
    const cancelledOrders = userOrders?.filter(o => o.status.toLowerCase() === 'cancelled').length || 0

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
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg blur-sm opacity-75"></div>
                            <div className="relative p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg">
                                <ShoppingCart className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                            <p className="text-sm text-gray-600">Track and manage your orders</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card className="border-orange-200 bg-white hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-gray-600 mb-1">Total Orders</p>
                                    <p className="text-2xl font-bold text-orange-600">{totalOrders}</p>
                                </div>
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <ShoppingCart className="h-5 w-5 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-green-200 bg-white hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-gray-600 mb-1">Completed</p>
                                    <p className="text-2xl font-bold text-green-600">{completedOrders}</p>
                                </div>
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-orange-200 bg-white hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-gray-600 mb-1">Pending</p>
                                    <p className="text-2xl font-bold text-orange-600">{pendingOrders}</p>
                                </div>
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <Clock className="h-5 w-5 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-red-200 bg-white hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-gray-600 mb-1">Cancelled</p>
                                    <p className="text-2xl font-bold text-red-600">{cancelledOrders}</p>
                                </div>
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <XCircle className="h-5 w-5 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filter Section */}
                <Card className="border-gray-200 bg-white mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Search by order ID, invoice, or product ID..."
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
                    </CardContent>
                </Card>

                {/* Orders Table */}
                <Card className="border-gray-200 bg-white">
                    <CardContent className="pt-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="h-10 w-10 text-orange-500 animate-spin mb-3" />
                                <p className="text-gray-600 text-sm">Loading your orders...</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50">
                                            <TableHead className="font-semibold">
                                                <div className="flex items-center gap-2">
                                                    <ShoppingCart className="h-4 w-4 text-orange-600" />
                                                    Order ID
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-orange-600" />
                                                    Invoice No.
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold">
                                                <div className="flex items-center gap-2">
                                                    <Package className="h-4 w-4 text-orange-600" />
                                                    Product ID
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold">Status</TableHead>
                                            <TableHead className="font-semibold text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredOrders && filteredOrders.length > 0 ? (
                                            filteredOrders.map((order) => (
                                                <TableRow key={order.order_id} className="hover:bg-orange-50">
                                                    <TableCell className="font-medium">
                                                        <Badge variant="outline" className="text-orange-700 border-orange-300">
                                                            #{order.order_id}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="font-medium text-gray-900">
                                                        INV-{order.invoice_no}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary" className="text-xs">
                                                            #{order.product_id}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusBadge(order.status)}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Link href={`/users/orders/${order.order_id}`}>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-orange-600 border-orange-300 hover:bg-orange-50"
                                                            >
                                                                View Details
                                                            </Button>
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-12">
                                                    <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                                    <p className="text-gray-600 font-medium">No orders found</p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {searchQuery || filterStatus !== 'all'
                                                            ? 'Try adjusting your search or filter'
                                                            : 'Start shopping to see your orders here'}
                                                    </p>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        {/* Footer Info */}
                        {userOrders && userOrders.length > 0 && (
                            <div className="mt-4 text-center text-sm text-gray-600 border-t border-gray-200 pt-4">
                                <p>Showing {filteredOrders.length} of {userOrders.length} orders</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default page