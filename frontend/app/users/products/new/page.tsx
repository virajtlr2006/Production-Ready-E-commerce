'use client'

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form"
import { Plus, X, Check, AlertCircle, Upload } from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api";

//  Define the Products interface
export interface Products {
    id: number;
    email: string;
    category: string;
    p_name: string;
    description: string;
    price: number;
    image_url: string;
    stock: number;
    isApproved: boolean;
}

const page = () => {
    // State to handle error messages
    const [errormsg, setErrormsg] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [imagePreview, setImagePreview] = useState('')

    // Next.js router 
    const router = useRouter()

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Products>()

    // Watch image URL to show preview
    const imageUrl = watch("image_url")
    const price = watch("price")
    const stock = watch("stock")

    // Function to handle product creation
    const CreateProduct = async (data: Products) => {
        try {
            setIsLoading(true)
            setErrormsg(null)
            setSuccessMessage('')

            // Get user email from local storage
            const email = localStorage.getItem("useremail")

            // Redirect to login if email is not found
            if (!email) {
                router.push("/users/login")
                return
            }

            // Combine form data with email
            const newdata = { ...data, email }

            // Make POST request to create new product
            await axios.post(API_ENDPOINTS.NEW_PRODUCT, newdata);

            setSuccessMessage('Product created successfully!')

            // Redirect to all products page upon successful creation
            setTimeout(() => {
                router.push("/users/products/userall")
            }, 1500)
            
        } catch (error: any) {
            // Set error message from response
            setErrormsg(error.response?.data?.message || 'Failed to create product')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <Plus className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
                            <p className="text-gray-600 text-sm mt-1">List your product and start selling on our marketplace</p>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                            <Check size={16} />
                        </div>
                        <div>
                            <p className="text-green-800 font-semibold">{successMessage}</p>
                            <p className="text-green-700 text-sm mt-1">Redirecting to your products...</p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {errormsg && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-red-800 font-semibold">Error</p>
                            <p className="text-red-700 text-sm mt-1">{errormsg}</p>
                        </div>
                        <button
                            onClick={() => setErrormsg(null)}
                            className="text-red-600 hover:text-red-800"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}

                {/* Form Card */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                    <form onSubmit={handleSubmit(CreateProduct)} className="p-8 space-y-6">
                        {/* Category Field */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="category"
                                {...register("category", {
                                    required: "Category is required"
                                })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 transition-all duration-300"
                            >
                                <option value="">Select a category</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Books">Books</option>
                                <option value="Home & Garden">Home & Garden</option>
                                <option value="Sports">Sports</option>
                                <option value="Toys">Toys</option>
                                <option value="Beauty">Beauty</option>
                                <option value="Other">Other</option>
                            </select>
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
                                placeholder="Enter a clear and descriptive product name"
                                {...register("p_name", {
                                    required: "Product name is required",
                                    minLength: { value: 3, message: "Product name must be at least 3 characters" }
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
                                placeholder="Describe your product in detail. Include features, condition, and any other relevant information..."
                                rows={5}
                                {...register("description", {
                                    required: "Description is required",
                                    minLength: { value: 20, message: "Description must be at least 20 characters" }
                                })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300 resize-vertical"
                            />
                            {errors.description && (
                                <p className="text-red-600 text-sm mt-2 font-medium">{errors.description.message}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">At least 20 characters</p>
                        </div>

                        {/* Price and Stock Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                            min: { value: 0.01, message: "Price must be greater than 0" }
                                        })}
                                        className="w-full px-4 py-3 pl-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300"
                                    />
                                </div>
                                {errors.price && (
                                    <p className="text-red-600 text-sm mt-2 font-medium">{errors.price.message}</p>
                                )}
                                {price && <p className="text-xs text-green-600 mt-2 font-semibold">Price: ${parseFloat(String(price)).toFixed(2)}</p>}
                            </div>

                            {/* Stock Field */}
                            <div>
                                <label htmlFor="stock" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Stock Quantity <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="stock"
                                    type="number"
                                    placeholder="0"
                                    {...register("stock", {
                                        required: "Stock quantity is required",
                                        min: { value: 1, message: "Stock must be at least 1" }
                                    })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300"
                                />
                                {errors.stock && (
                                    <p className="text-red-600 text-sm mt-2 font-medium">{errors.stock.message}</p>
                                )}
                                {stock && <p className="text-xs text-blue-600 mt-2 font-semibold">Available: {stock} units</p>}
                            </div>
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
                            <p className="text-xs text-gray-500 mt-1">Use a direct link to an image (JPG, PNG, etc.)</p>
                        </div>

                        {/* Image Preview */}
                        {imageUrl && !errors.image_url && (
                            <div className="border-2 border-dashed border-orange-300 rounded-lg p-4 bg-orange-50">
                                <p className="text-sm font-semibold text-orange-900 mb-3 flex items-center gap-2">
                                    <Upload size={16} />
                                    Image Preview
                                </p>
                                <div className="relative w-full h-64 bg-white rounded-lg overflow-hidden border border-orange-200">
                                    <img
                                        src={imageUrl}
                                        alt="Product preview"
                                        className="w-full h-full object-cover"
                                        onError={() => setImagePreview('')}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:shadow-none"
                            >
                                <Plus size={20} />
                                {isLoading ? 'Creating Product...' : 'Create Product'}
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

                {/* Info Boxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-800 text-sm">
                            <span className="font-semibold">Tip:</span> Use high-quality product images to increase sales potential.
                        </p>
                    </div>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800 text-sm">
                            <span className="font-semibold">Note:</span> Products require approval before they appear in the marketplace.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page