'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Package, Truck, MapPin, Clock, ArrowRight, Home, ShoppingBag } from 'lucide-react'

interface OrderData {
    invoice_no: string
    product_name: string
    product_image: string
    quantity: number
    amount: number
    payment_method: string
    buyer_email: string
    order_date: string
}

const SuccessPage = () => {
    const router = useRouter()
    const [orderData, setOrderData] = useState<OrderData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Retrieve order data from localStorage
        const lastOrder = localStorage.getItem('lastOrder')
        if (lastOrder) {
            try {
                setOrderData(JSON.parse(lastOrder))
            } catch (error) {
                console.error('Error parsing order data:', error)
            }
        }
        setLoading(false)
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Loading...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Success Animation & Header */}
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-200 rounded-full animate-pulse"></div>
                            <CheckCircle size={80} className="text-green-600 relative animate-bounce" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Order Confirmed!</h1>
                    <p className="text-gray-600 text-lg">Thank you for your purchase. Your order has been placed successfully.</p>
                </div>

                {/* Order Number Card */}
                <Card className="border-green-200 bg-white shadow-lg mb-6">
                    <CardContent className="pt-8">
                        <div className="text-center space-y-3">
                            <p className="text-gray-600 font-medium">Order Number</p>
                            <p className="text-3xl font-bold text-green-600 font-mono tracking-wider">#{orderData?.invoice_no}</p>
                            <p className="text-sm text-gray-500">
                                Placed on {orderData?.order_date ? new Date(orderData.order_date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }) : 'Just now'}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Order Details */}
                <Card className="border-green-200 bg-white shadow-lg mb-6">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b border-green-200">
                        <CardTitle className="text-green-900 flex items-center gap-2">
                            <ShoppingBag size={20} />
                            Order Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {orderData && (
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-24 h-24 bg-green-50 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={orderData.product_image}
                                            alt={orderData.product_name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{orderData.product_name}</h3>
                                        <div className="flex gap-6 text-sm">
                                            <div>
                                                <p className="text-gray-600">Quantity</p>
                                                <p className="font-bold text-gray-900">{orderData.quantity}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Unit Price</p>
                                                <p className="font-bold text-gray-900">${(orderData.amount / orderData.quantity).toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Payment Method</p>
                                                <p className="font-bold text-gray-900">{orderData.payment_method}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-t border-green-100 pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                                        <span className="text-3xl font-bold text-green-600">${orderData.amount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Delivery Info */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <Card className="border-blue-200 bg-white">
                        <CardContent className="pt-6 text-center space-y-3">
                            <div className="bg-blue-100 w-14 h-14 rounded-full mx-auto flex items-center justify-center">
                                <Package size={24} className="text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Packing</h3>
                            <p className="text-sm text-gray-600">Your order is being packed</p>
                        </CardContent>
                    </Card>

                    <Card className="border-yellow-200 bg-white">
                        <CardContent className="pt-6 text-center space-y-3">
                            <div className="bg-yellow-100 w-14 h-14 rounded-full mx-auto flex items-center justify-center">
                                <Truck size={24} className="text-yellow-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Shipping</h3>
                            <p className="text-sm text-gray-600">Ships in 1-2 business days</p>
                        </CardContent>
                    </Card>

                    <Card className="border-green-200 bg-white">
                        <CardContent className="pt-6 text-center space-y-3">
                            <div className="bg-green-100 w-14 h-14 rounded-full mx-auto flex items-center justify-center">
                                <MapPin size={24} className="text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Delivery</h3>
                            <p className="text-sm text-gray-600">Arrives in 3-5 days</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Timeline */}
                <Card className="border-green-200 bg-white shadow-lg mb-6">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b border-green-200">
                        <CardTitle className="text-green-900 flex items-center gap-2">
                            <Clock size={20} />
                            Expected Timeline
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {[
                                { status: 'Order Placed', time: 'Today', icon: CheckCircle, color: 'green' },
                                { status: 'Confirmed', time: '1-2 hours', icon: CheckCircle, color: 'green' },
                                { status: 'Shipped', time: '1-2 days', icon: Package, color: 'blue' },
                                { status: 'Out for Delivery', time: '3-4 days', icon: Truck, color: 'yellow' },
                                { status: 'Delivered', time: '3-5 days', icon: MapPin, color: 'green' }
                            ].map((step, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                        step.color === 'green' ? 'bg-green-100' :
                                        step.color === 'blue' ? 'bg-blue-100' :
                                        'bg-gray-100'
                                    }`}>
                                        <step.icon size={20} className={
                                            step.color === 'green' ? 'text-green-600' :
                                            step.color === 'blue' ? 'text-blue-600' :
                                            'text-gray-400'
                                        } />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900">{step.status}</p>
                                        <p className="text-sm text-gray-600">{step.time}</p>
                                    </div>
                                    {index < 4 && (
                                        <ArrowRight size={20} className="text-gray-300" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Confirmation Details */}
                <Card className="border-gray-200 bg-white mb-6">
                    <CardHeader>
                        <CardTitle>Confirmation Email</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-gray-700">
                            A confirmation email has been sent to <span className="font-semibold text-orange-600">{orderData?.buyer_email}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                            You can track your order using the order number and email address. Keep your order number handy for future reference.
                        </p>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="grid md:grid-cols-2 gap-4">
                    <Button
                        onClick={() => router.push('/users/products/userall')}
                        className="bg-orange-600 hover:bg-orange-700 text-white h-12 text-base"
                    >
                        <ShoppingBag size={18} className="mr-2" />
                        View My Orders
                    </Button>
                    <Button
                        onClick={() => router.push('/users/products/all')}
                        variant="outline"
                        className="border-orange-300 text-orange-600 hover:bg-orange-50 h-12 text-base"
                    >
                        <Home size={18} className="mr-2" />
                        Continue Shopping
                    </Button>
                </div>

                {/* Help Text */}
                <div className="mt-8 text-center">
                    <p className="text-gray-600 text-sm mb-2">Need help with your order?</p>
                    <Button
                        variant="link"
                        className="text-orange-600 hover:text-orange-700"
                    >
                        Contact Customer Support
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default SuccessPage
