'use client'

import { Orders } from '@/app/admin/allorders/page'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Package, 
  ArrowLeft, 
  Loader2, 
  CheckCircle, 
  Clock, 
  XCircle, 
  ShoppingCart, 
  User, 
  Mail, 
  Calendar, 
  DollarSign,
  Tag,
  FileText,
  MapPin,
  Truck
} from 'lucide-react'
import Link from 'next/link'

export interface OrderDetails {
  p_name: string;
  image: string;
  category: string;
  description: string;
  status: string;
  price: number;
  order_id: number;
  user_id: string;
}

const page = () => {
  const { id } = useParams()
  const router = useRouter()

  const [orderdetail, setorderdetail] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    FetchOrderDetails(Number(id))
  }, [])

  const FetchOrderDetails = async (order_id: number) => {
    try {
      setLoading(true)
      const detail = await axios.post(`http://localhost:8080/users/orders/${id}`)
      console.log(detail.data)
      setorderdetail(detail.data)
    } catch (error) {
      console.error("Error fetching order details:", error)
    } finally {
      setLoading(false)
    }
  }

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase()
    if (statusLower === 'completed') {
      return (
        <Badge className="bg-green-100 text-green-700 border-green-300 text-base px-4 py-2">
          <CheckCircle className="h-4 w-4 mr-2" />
          Completed
        </Badge>
      )
    } else if (statusLower === 'pending') {
      return (
        <Badge className="bg-orange-100 text-orange-700 border-orange-300 text-base px-4 py-2">
          <Clock className="h-4 w-4 mr-2" />
          Pending
        </Badge>
      )
    } else if (statusLower === 'cancelled') {
      return (
        <Badge className="bg-red-100 text-red-700 border-red-300 text-base px-4 py-2">
          <XCircle className="h-4 w-4 mr-2" />
          Cancelled
        </Badge>
      )
    } else {
      return <Badge variant="secondary" className="text-base px-4 py-2">{status}</Badge>
    }
  }

  // Function to get status color for progress bar
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase()
    if (statusLower === 'completed') return 'bg-green-500'
    if (statusLower === 'pending') return 'bg-orange-500'
    if (statusLower === 'cancelled') return 'bg-red-500'
    return 'bg-gray-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <Link href="/users/orders/myorders">
            <Button variant="outline" className="mb-4 hover:bg-orange-50 border-orange-300">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg blur-sm opacity-75"></div>
              <div className="relative p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
              <p className="text-sm text-gray-600">View complete order information</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-orange-500 animate-spin mb-3" />
            <p className="text-gray-600 text-sm">Loading order details...</p>
          </div>
        ) : orderdetail ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Product Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Info Card */}
              <Card className="border-gray-200 bg-white shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-orange-600" />
                      <h2 className="text-xl font-bold text-gray-900">Order #{orderdetail.order_id}</h2>
                    </div>
                    {getStatusBadge(orderdetail.status)}
                  </div>

                  {/* Product Information */}
                  <div className="space-y-4">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-40 h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={orderdetail.image}
                            alt={orderdetail.p_name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {orderdetail.p_name}
                        </h3>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-gray-600" />
                            <span className="text-sm text-gray-600">Category:</span>
                            <Badge variant="outline" className="text-orange-700 border-orange-300">
                              {orderdetail.category}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-600" />
                            <span className="text-sm text-gray-600">Price:</span>
                            <span className="text-2xl font-bold text-orange-600">
                              ${orderdetail.price.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Description:</p>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {orderdetail.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Status Timeline */}
              <Card className="border-gray-200 bg-white shadow-lg">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Truck className="h-5 w-5 text-orange-600" />
                    Order Status Timeline
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Order Placed */}
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        orderdetail.status ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Order Placed</p>
                        <p className="text-sm text-gray-600">Your order has been received</p>
                      </div>
                    </div>

                    {/* Processing */}
                    <div className="flex items-start gap-4 ml-5">
                      <div className="w-0.5 h-8 bg-gray-300"></div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        orderdetail.status.toLowerCase() === 'pending' || orderdetail.status.toLowerCase() === 'completed' 
                          ? 'bg-orange-500' 
                          : 'bg-gray-300'
                      }`}>
                        <Clock className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Processing</p>
                        <p className="text-sm text-gray-600">Order is being prepared</p>
                      </div>
                    </div>

                    {/* Shipped/Completed */}
                    <div className="flex items-start gap-4 ml-5">
                      <div className="w-0.5 h-8 bg-gray-300"></div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        orderdetail.status.toLowerCase() === 'completed' 
                          ? 'bg-green-500' 
                          : orderdetail.status.toLowerCase() === 'cancelled'
                          ? 'bg-red-500'
                          : 'bg-gray-300'
                      }`}>
                        {orderdetail.status.toLowerCase() === 'cancelled' ? (
                          <XCircle className="h-5 w-5 text-white" />
                        ) : (
                          <Package className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {orderdetail.status.toLowerCase() === 'cancelled' ? 'Cancelled' : 'Delivered'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {orderdetail.status.toLowerCase() === 'cancelled' 
                            ? 'Order has been cancelled' 
                            : orderdetail.status.toLowerCase() === 'completed'
                            ? 'Order has been delivered'
                            : 'Waiting for delivery'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1 space-y-6">
              {/* Order Summary Card */}
              <Card className="border-gray-200 bg-white shadow-lg">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-orange-600" />
                    Order Summary
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Subtotal</span>
                      <span className="font-semibold text-gray-900">
                        ${orderdetail.price.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Shipping</span>
                      <span className="font-semibold text-green-600">Free</span>
                    </div>
                    
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Tax</span>
                      <span className="font-semibold text-gray-900">
                        ${(orderdetail.price * 0.1).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between py-3 bg-orange-50 -mx-6 px-6 rounded-lg">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="font-bold text-xl text-orange-600">
                        ${(orderdetail.price * 1.1).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Information Card */}
              <Card className="border-gray-200 bg-white shadow-lg">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-orange-600" />
                    Customer Details
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-600 font-medium">User ID</p>
                        <p className="text-sm font-semibold text-gray-900">{orderdetail.user_id}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card className="border-gray-200 bg-white shadow-lg">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                      onClick={() => router.push('/users/orders/myorders')}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      View All Orders
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
                      onClick={() => router.push('/users/products/all')}
                    >
                      Continue Shopping
                    </Button>

                    {orderdetail.status.toLowerCase() === 'completed' && (
                      <Button 
                        variant="outline"
                        className="w-full border-green-300 text-green-700 hover:bg-green-50"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Order Again
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Help Card */}
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <span className="text-lg">💡</span>
                    Need Help?
                  </h4>
                  <p className="text-sm text-blue-800 mb-3">
                    Have questions about your order? Contact our support team.
                  </p>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card className="border-gray-200 bg-white shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h3>
                <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
                <Link href="/users/orders/myorders">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Orders
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default page