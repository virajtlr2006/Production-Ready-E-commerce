'use client'

import { Products } from '../../new/page'
import axios from 'axios'
import { useForm } from "react-hook-form"
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Edit3, Save, X } from 'lucide-react'
import { API_ENDPOINTS } from '@/lib/api'

const page = () => {
    const { id } = useParams()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Products>()

    useEffect(() => {
        FetchOldProduct()
    }, [])

    const FetchOldProduct = async () => {
        try {
            const response = await axios.post(API_ENDPOINTS.PRODUCT_DETAILS(String(id)))
            reset(response.data.ProductDetails[0])
        } catch (error) {
            console.error('Error fetching product:', error)
            setErrorMessage('Failed to load product details')
        }
    }

    const EditProduct = async (data: Products) => {
        try {
            setIsLoading(true)
            setErrorMessage('')
            setSuccessMessage('')

            await axios.post(API_ENDPOINTS.EDIT_PRODUCT(String(id)), data)
            setSuccessMessage('Product updated successfully!')

            setTimeout(() => {
                router.push("/users/products/userall")
            }, 1500)
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'Failed to update product')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <Edit3 className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                            <p className="text-gray-600 text-sm mt-1">Update your product details and information</p>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                            ✓
                        </div>
                        <div>
                            <p className="text-green-800 font-semibold">{successMessage}</p>
                            <p className="text-green-700 text-sm mt-1">Redirecting to your products...</p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {errorMessage && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                            !
                        </div>
                        <div className="flex-1">
                            <p className="text-red-800 font-semibold">Error</p>
                            <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
                        </div>
                        <button
                            onClick={() => setErrorMessage('')}
                            className="text-red-600 hover:text-red-800"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}

                {/* Form Card */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                    <form onSubmit={handleSubmit(EditProduct)} className="p-8 space-y-6">
                        {/* Category Field */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="category"
                                type="text"
                                placeholder="e.g., Electronics, Fashion, Books"
                                {...register("category", {
                                    required: "Category is required"
                                })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300"
                            />
                            {errors.category && (
                                <p className="text-red-600 text-sm mt-2 font-medium">{errors.category.message}</p>
                            )}
                        </div>

                        {/* Product Name Field */}
                        <div>
                            <label htmlFor="p_name" className="block text-sm font-semibold text-gray-900 mb-2">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="p_name"
                                type="text"
                                placeholder="Enter product name"
                                {...register("p_name", {
                                    required: "Product name is required"
                                })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300"
                            />
                            {errors.p_name && (
                                <p className="text-red-600 text-sm mt-2 font-medium">{errors.p_name.message}</p>
                            )}
                        </div>

                        {/* Description Field */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="description"
                                placeholder="Enter product description"
                                rows={4}
                                {...register("description", {
                                    required: "Description is required"
                                })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300 resize-vertical"
                            />
                            {errors.description && (
                                <p className="text-red-600 text-sm mt-2 font-medium">{errors.description.message}</p>
                            )}
                        </div>

                        {/* Price Field */}
                        <div>
                            <label htmlFor="price" className="block text-sm font-semibold text-gray-900 mb-2">
                                Price <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-3 text-gray-500 font-semibold">$</span>
                                <input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...register("price", {
                                        required: "Price is required",
                                        min: { value: 0, message: "Price must be greater than 0" }
                                    })}
                                    className="w-full px-4 py-3 pl-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300"
                                />
                            </div>
                            {errors.price && (
                                <p className="text-red-600 text-sm mt-2 font-medium">{errors.price.message}</p>
                            )}
                        </div>

                        {/* Stock Field */}
                        <div>
                            <label htmlFor="stock" className="block text-sm font-semibold text-gray-900 mb-2">
                                Stock Quantity <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="stock"
                                type="number"
                                placeholder="Enter stock quantity"
                                {...register("stock", {
                                    required: "Stock quantity is required",
                                    min: { value: 0, message: "Stock must be 0 or greater" }
                                })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300"
                            />
                            {errors.stock && (
                                <p className="text-red-600 text-sm mt-2 font-medium">{errors.stock.message}</p>
                            )}
                        </div>

                        {/* Image URL Field */}
                        <div>
                            <label htmlFor="image_url" className="block text-sm font-semibold text-gray-900 mb-2">
                                Image URL <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="image_url"
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                {...register("image_url", {
                                    required: "Image URL is required",
                                    pattern: {
                                        value: /^https?:\/\/.+/,
                                        message: "Please enter a valid URL starting with http:// or https://"
                                    }
                                })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300"
                            />
                            {errors.image_url && (
                                <p className="text-red-600 text-sm mt-2 font-medium">{errors.image_url.message}</p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:shadow-none"
                            >
                                <Save size={20} />
                                {isLoading ? 'Updating...' : 'Update Product'}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                <X size={20} />
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                {/* Info Box */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm">
                        <span className="font-semibold">Tip:</span> Make sure all fields are filled correctly. Changes will be reflected immediately after update.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default page