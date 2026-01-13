'use client'

import axios from 'axios'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Products } from '../new/page'
import { ShoppingCart, Heart, Share2, Star, Truck, Shield, RotateCcw } from 'lucide-react'
import { API_ENDPOINTS } from '@/lib/api'

const page = () => {
    const { id } = useParams()
    const [singleproduct, setSingleproduct] = useState<Products | null>(null)
    const [quantity, setQuantity] = useState(1)
    const [isWishlisted, setIsWishlisted] = useState(false)

    useEffect(() => {
        fetchProductDetails()
    }, [])

    const fetchProductDetails = async () => {
        try {
            const response = await axios.post(API_ENDPOINTS.PRODUCT_DETAILS(String(id)))
            setSingleproduct(response.data.ProductDetails[0])
        } catch (error) {
            console.error('Error fetching product:', error)
        }
    }

    const handleQuantityChange = (value: number) => {
        if (value >= 1 && value <= 10) {
            setQuantity(value)
        }
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation breadcrumb */}
            <div className="border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="text-sm text-gray-600">
                        <a href="/users/products/all" className="hover:text-orange-600">Store</a>
                        <span className="mx-2">/</span>
                        <a href="#" className="hover:text-orange-600">{singleproduct?.category}</a>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 font-medium">{singleproduct?.p_name}</span>
                    </div>
                </div>
            </div>

            {singleproduct && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Product Image */}
                        <div className="lg:col-span-1 lg:order-1">
                            <div className="sticky top-8">
                                <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center min-h-96">
                                    <img
                                        src={singleproduct.image_url}
                                        alt={singleproduct.p_name}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsWishlisted(!isWishlisted)}
                                        className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2 border border-gray-300 ${
                                            isWishlisted
                                                ? 'bg-red-50 text-red-600 border-red-300'
                                                : 'bg-white text-gray-900 hover:bg-gray-50'
                                        }`}
                                    >
                                        <Heart size={20} />
                                        {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                                    </button>
                                    <button className="flex-1 py-2 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-900 hover:bg-gray-50">
                                        <Share2 size={20} />
                                        Share
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Middle Column - Product Details */}
                        <div className="lg:col-span-1">
                            {/* Category Badge */}
                            <div className="mb-4">
                                <span className="inline-block bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    {singleproduct.category}
                                </span>
                            </div>

                            {/* Product Title */}
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                                {singleproduct.p_name}
                            </h1>

                            {/* Rating Section */}
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={18}
                                            className={i < 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'}
                                        />
                                    ))}
                                </div>
                                <a href="#reviews" className="text-blue-600 hover:text-blue-800 font-semibold text-sm">
                                    256 customer reviews
                                </a>
                            </div>

                            {/* Price Section */}
                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <div className="flex items-baseline gap-3 mb-2">
                                    <span className="text-4xl font-bold text-gray-900">
                                        ${typeof singleproduct.price === 'string' ? parseFloat(singleproduct.price) : singleproduct.price}
                                    </span>
                                    <span className="text-xl text-gray-500 line-through">
                                        ${((typeof singleproduct.price === 'string' ? parseFloat(singleproduct.price) : singleproduct.price) * 1.2).toFixed(2)}
                                    </span>
                                </div>
                                <p className="text-sm text-red-600 font-semibold">Save ${((typeof singleproduct.price === 'string' ? parseFloat(singleproduct.price) : singleproduct.price) * 0.2).toFixed(2)} (17%)</p>
                            </div>

                            {/* Description */}
                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">About this item</h3>
                                <p className="text-gray-700 leading-relaxed text-sm line-clamp-4">
                                    {singleproduct.description}
                                </p>
                                <a href="#details" className="text-blue-600 hover:text-blue-800 font-semibold text-sm mt-2 inline-block">
                                    See more
                                </a>
                            </div>

                            {/* Seller Information */}
                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <p className="text-sm text-gray-600 mb-2">Sold by</p>
                                <p className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer">
                                    {singleproduct.email}
                                </p>
                            </div>

                            {/* Delivery Info */}
                            <div className="space-y-3 mb-6">
                                <div className="flex gap-3 items-start">
                                    <Truck size={20} className="text-gray-600 shrink-0 mt-1" />
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">Free Delivery</p>
                                        <p className="text-xs text-gray-600">Orders over $50. See details</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <Shield size={20} className="text-gray-600 shrink-0 mt-1" />
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">Secure Transaction</p>
                                        <p className="text-xs text-gray-600">Your transaction is secure</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <RotateCcw size={20} className="text-gray-600 shrink-0 mt-1" />
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">Easy Returns</p>
                                        <p className="text-xs text-gray-600">30-day return policy</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Purchase Options */}
                        <div className="lg:col-span-1 lg:order-3">
                            <div className="sticky top-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                {/* Stock Status */}
                                <div className="mb-6 pb-4 border-b border-gray-200">
                                    <p className="text-sm font-semibold text-green-600">In Stock</p>
                                    <p className="text-sm text-gray-600 mt-1">Free delivery by Thu, Jan 16</p>
                                </div>

                                {/* Quantity Selector */}
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                                        Quantity:
                                    </label>
                                    <select
                                        value={quantity}
                                        onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    >
                                        {[...Array(10)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Action Buttons */}
                                <a href={`/users/pay/${singleproduct.id}`} className="block w-full mb-3">
                                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                                        <ShoppingCart size={20} />
                                        Add to Cart
                                    </button>
                                </a>

                                <a href={`/users/pay/${singleproduct.id}`} className="block w-full">
                                    <button className="w-full bg-orange-100 hover:bg-orange-200 text-orange-900 font-bold py-3 px-6 rounded-lg transition-colors duration-200">
                                        Buy Now
                                    </button>
                                </a>

                                {/* Payment Methods */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <p className="text-xs text-gray-600 font-semibold mb-3">Secure transaction</p>
                                    <div className="flex gap-2">
                                        <div className="flex-1 px-2 py-2 bg-gray-50 rounded text-xs font-semibold text-center text-gray-600">
                                            Credit Card
                                        </div>
                                        <div className="flex-1 px-2 py-2 bg-gray-50 rounded text-xs font-semibold text-center text-gray-600">
                                            Debit Card
                                        </div>
                                        <div className="flex-1 px-2 py-2 bg-gray-50 rounded text-xs font-semibold text-center text-gray-600">
                                            UPI
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div id="reviews" className="mt-12 pt-8 border-t border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
                        <div className="bg-gray-50 rounded-lg p-6 text-center py-12">
                            <p className="text-gray-600 mb-4">No reviews yet. Be the first to review this product!</p>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
                                Write a Review
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default page