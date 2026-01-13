'use client'

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Products } from '../../products/new/page';
import axios from 'axios';
import { useForm } from "react-hook-form"
import { API_ENDPOINTS } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, Smartphone, Truck, Lock, CheckCircle, AlertCircle, Loader2, ArrowLeft, Shield } from 'lucide-react'


export interface Payment {
    invoice_no: number;
    buyer_email: string;
    product_id: number;
    image_url: string;
    p_name: string;
    amount: number;
    quantity: number;
    type: string;
    card_no: number;
    UPI_ID: number;
}

const page = () => {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Payment>()

    const [product, setproduct] = useState<Payment | null>(null)
    const [totalPrice, setTotalPrice] = useState(0)
    const [loading, setLoading] = useState(true)
    const [paymentLoading, setPaymentLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const { id } = useParams()

    useEffect(() => {
        FetchProduct()
    }, [])

    const quantity = watch("quantity");

    useEffect(() => {
        if (product && quantity) {
            const price = typeof product.amount === 'string' ? parseFloat(product.amount) : product.amount
            setTotalPrice(Number(quantity) * price)
        }
    }, [quantity, product])
    
    const FetchProduct = async () => {
        try {
            const response = await axios.post(API_ENDPOINTS.PRODUCT_DETAILS(String(id)))
            const productData = response.data.ProductDetails[0]
            
            // Handle both 'price' and 'amount' field names
            const priceValue = productData.price || productData.amount
            const price = typeof priceValue === 'string' 
                ? parseFloat(priceValue) 
                : priceValue
            
            // Set product with amount field for consistency
            setproduct({
                ...productData,
                amount: price
            })
            setTotalPrice(price || 0)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching product:', error)
            setErrorMessage('Failed to load product details')
            setLoading(false)
        }
    }

    const Pay = async (data: Payment) => {
        try {
            setPaymentLoading(true)
            setErrorMessage('')
            setSuccessMessage('')
            const email = localStorage.getItem("useremail")
            
            if (!email) {
                setErrorMessage('Please login to proceed with payment')
                router.push('/users/login')
                return
            }

            const response = await axios.post(API_ENDPOINTS.NEW_PAYMENT, {
                "buyer_email": email,
                "product_id": String(id),
                "amount": totalPrice,
                "quantity": data.quantity,
                "type": data.type,
                "card_no": data.card_no || 0,
                "UPI_ID": data.UPI_ID || ""
            })
            
            // Store order details for confirmation page
            const orderData = {
                invoice_no: response.data.invoice_no || Math.random().toString().substring(2, 12),
                product_name: product?.p_name,
                product_image: product?.image_url,
                quantity: data.quantity,
                amount: totalPrice,
                payment_method: data.type,
                buyer_email: email,
                order_date: new Date().toISOString()
            }
            localStorage.setItem('lastOrder', JSON.stringify(orderData))
            
            // Redirect to order confirmation page
            router.push('/users/pay/success')
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'Payment failed. Please try again.')
        } finally {
            setPaymentLoading(false)
        }
    }

    const paymentMethod = watch("type");

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={48} className="text-orange-600 animate-spin" />
                    <p className="text-gray-600 font-medium">Loading product details...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Button 
                        variant="ghost" 
                        onClick={() => router.back()}
                        className="text-gray-700 hover:text-orange-600 mb-4"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Back
                    </Button>
                    <h1 className="text-4xl font-bold text-gray-900">Order & Payment</h1>
                    <p className="text-gray-600 mt-2">Complete your purchase securely</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Order Summary */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Product Summary Card */}
                        {product && (
                            <Card className="border-orange-200 bg-white hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="text-orange-900">Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="relative w-32 h-32 bg-orange-50 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={product.image_url}
                                                alt={product.p_name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{product.p_name}</h3>
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Unit Price:</span> ${product.amount ? (typeof product.amount === 'string' ? parseFloat(product.amount) : product.amount).toFixed(2) : '0.00'}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Quantity:</span> <span className="text-orange-600 font-semibold">{quantity || 1}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="border-t border-orange-100 pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                                            <span className="text-3xl font-bold text-orange-600">${totalPrice.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Quantity Selection */}
                        <Card className="border-orange-200 bg-white">
                            <CardHeader>
                                <CardTitle>Quantity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <input
                                        type="number"
                                        defaultValue={1}
                                        min="1"
                                        max="10"
                                        {...register("quantity", {
                                            required: "Quantity is required",
                                            min: { value: 1, message: "Minimum quantity is 1" },
                                            max: { value: 10, message: "Maximum quantity is 10" }
                                        })}
                                        className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                    {errors.quantity && (
                                        <p className="text-red-600 text-sm flex items-center gap-2">
                                            <AlertCircle size={16} />
                                            {errors.quantity.message}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Method Selection */}
                        <Card className="border-orange-200 bg-white">
                            <CardHeader>
                                <CardTitle>Payment Method</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <select
                                    {...register("type", { required: "Please select a payment method" })}
                                    className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                                >
                                    <option value="">Select Payment Method</option>
                                    <option value="Cash On Delivery">💵 Cash On Delivery</option>
                                    <option value="Card">💳 Debit/Credit Card</option>
                                    <option value="UPI">📱 UPI</option>
                                </select>
                                {errors.type && (
                                    <p className="text-red-600 text-sm flex items-center gap-2">
                                        <AlertCircle size={16} />
                                        {errors.type.message}
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Card Payment Form */}
                        {paymentMethod === "Card" && (
                            <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard size={20} className="text-orange-600" />
                                        Card Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            Card Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="1234 5678 9012 3456"
                                            {...register("card_no", {
                                                required: "Card number is required",
                                                pattern: {
                                                    value: /^[0-9]{13,19}$/,
                                                    message: "Please enter a valid card number"
                                                }
                                            })}
                                            maxLength={19}
                                            className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                        {errors.card_no && (
                                            <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                                                <AlertCircle size={16} />
                                                {errors.card_no.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="bg-orange-100 border border-orange-300 rounded-lg p-3 flex items-center gap-2">
                                        <Shield size={16} className="text-orange-600 flex-shrink-0" />
                                        <p className="text-sm text-orange-900">Your payment information is secure and encrypted</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* UPI Payment Form */}
                        {paymentMethod === "UPI" && (
                            <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Smartphone size={20} className="text-orange-600" />
                                        UPI Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            UPI ID <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="yourname@upi"
                                            {...register("UPI_ID", {
                                                required: "UPI ID is required",
                                                pattern: {
                                                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z]+$/,
                                                    message: "Please enter a valid UPI ID (e.g., name@upi)"
                                                }
                                            })}
                                            className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                        {errors.UPI_ID && (
                                            <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                                                <AlertCircle size={16} />
                                                {errors.UPI_ID.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="bg-orange-100 border border-orange-300 rounded-lg p-3 flex items-center gap-2">
                                        <Shield size={16} className="text-orange-600 flex-shrink-0" />
                                        <p className="text-sm text-orange-900">UPI payments are fast and secure</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Cash On Delivery Info */}
                        {paymentMethod === "Cash On Delivery" && (
                            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-green-700">
                                        <Truck size={20} />
                                        Cash On Delivery
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Delivery Available</Badge>
                                        <p className="text-sm text-gray-600">
                                            You can pay the amount of <span className="font-bold text-green-700">${totalPrice.toFixed(2)}</span> when the product is delivered to your doorstep.
                                        </p>
                                        <ul className="text-sm text-gray-600 space-y-2 mt-3">
                                            <li className="flex items-center gap-2">
                                                <CheckCircle size={16} className="text-green-600" />
                                                Free delivery on this order
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle size={16} className="text-green-600" />
                                                Expected delivery in 3-5 business days
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle size={16} className="text-green-600" />
                                                No additional charges
                                            </li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Order Details Sidebar */}
                    <div className="space-y-6">
                        {/* Price Breakdown */}
                        <Card className="border-orange-200 bg-white sticky top-20">
                            <CardHeader>
                                <CardTitle>Price Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Unit Price</span>
                                        <span className="font-medium text-gray-900">
                                            ${product && product.amount ? (typeof product.amount === 'string' ? parseFloat(product.amount) : product.amount).toFixed(2) : '0.00'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Quantity</span>
                                        <span className="font-medium text-gray-900">{quantity || 1}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Delivery Charges</span>
                                        <span className="font-medium text-green-600">Free</span>
                                    </div>
                                    <div className="border-t border-orange-100 pt-3 flex justify-between">
                                        <span className="font-semibold text-gray-900">Total Amount</span>
                                        <span className="text-2xl font-bold text-orange-600">${totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Secure Checkout */}
                        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
                            <CardContent className="pt-6 space-y-3">
                                <div className="flex items-center gap-2 text-green-700">
                                    <Lock size={20} className="flex-shrink-0" />
                                    <span className="font-semibold">Secure Checkout</span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    All your payment information is encrypted and secure
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Messages */}
                {successMessage && (
                    <div className="fixed bottom-8 right-8 bg-green-50 border border-green-300 rounded-lg p-4 max-w-sm shadow-lg">
                        <div className="flex items-center gap-3 text-green-700">
                            <CheckCircle size={20} />
                            <p className="font-medium">{successMessage}</p>
                        </div>
                    </div>
                )}

                {errorMessage && (
                    <div className="fixed bottom-8 right-8 bg-red-50 border border-red-300 rounded-lg p-4 max-w-sm shadow-lg">
                        <div className="flex items-center gap-3 text-red-700">
                            <AlertCircle size={20} />
                            <p className="font-medium">{errorMessage}</p>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <div className="mt-8 flex gap-4">
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        className="flex-1 border-orange-300 text-orange-600 hover:bg-orange-50"
                    >
                        Continue Shopping
                    </Button>
                    <Button
                        onClick={handleSubmit(Pay)}
                        disabled={paymentLoading}
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-lg h-12"
                    >
                        {paymentLoading ? (
                            <>
                                <Loader2 size={18} className="mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Lock size={18} className="mr-2" />
                                Place Order
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default page