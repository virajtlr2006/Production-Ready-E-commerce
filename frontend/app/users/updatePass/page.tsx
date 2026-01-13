'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Lock, Eye, EyeOff, ArrowLeft, Check, AlertCircle, Loader2, Shield } from 'lucide-react'
import { API_ENDPOINTS } from '@/lib/api'

// Type for updating password
export interface UpdatePass {
    oldPassword: string
    newPassword: string
}

const page = () => {
    // State for error message
    const [errormsg, setErrormsg] = useState<string | null>(null)
    const [successMsg, setSuccessMsg] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<UpdatePass>()

    //   Next.js router
    const router = useRouter()

    const newPassword = watch("newPassword")

    // Function to handle password update
    const updatePassword = async (data: UpdatePass) => {
        try {
            setIsLoading(true)
            setErrormsg(null)
            setSuccessMsg(null)

            // Get email from local storage
            const email = localStorage.getItem("useremail")
            // Redirect to login if email not found
            if (!email) {
                router.push("/users/login")
                return false
            }

            // Make API call to update password
            await axios.post(API_ENDPOINTS.USER_CHANGE_PASSWORD, {
                email,
                oldPassword: data.oldPassword,
                password: data.newPassword
            })

            setSuccessMsg('Password updated successfully!')
            reset()

            setTimeout(() => {
                router.push("/users/profile")
            }, 1500)
        } catch (error: any) {
            // Handle error and set error message
            setErrormsg(error.response?.data?.message || 'Failed to update password')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                {/* Header with back button */}
                <div className="flex items-center gap-3 mb-8">
                    <button
                        onClick={() => router.push("/users/profile")}
                        className="p-2 hover:bg-orange-100 rounded-lg transition-colors duration-300 text-gray-600 hover:text-orange-600"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
                        <p className="text-gray-600 text-xs mt-0.5">Keep your account secure</p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-6 flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Shield className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-white font-semibold text-sm">Secure Password Update</p>
                            <p className="text-orange-50 text-xs mt-0.5">Protect your account with a strong password</p>
                        </div>
                    </div>

                    <div className="p-8 space-y-6">
                        {/* Success Message */}
                        {successMsg && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-green-800 font-semibold text-sm">{successMsg}</p>
                                    <p className="text-green-700 text-xs mt-1">Redirecting to your profile...</p>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {errormsg && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-red-800 font-semibold text-sm">Error</p>
                                    <p className="text-red-700 text-sm mt-1">{errormsg}</p>
                                </div>
                                <button
                                    onClick={() => setErrormsg(null)}
                                    className="text-red-600 hover:text-red-800 flex-shrink-0"
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit(updatePassword)} className="space-y-5">
                            {/* Old Password Field */}
                            <div>
                                <label htmlFor="oldPassword" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Current Password <span className="text-red-500">*</span>
                                </label>
                                <div className="group relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-gray-500 group-focus-within:text-orange-600 transition-colors duration-300" />
                                    </div>
                                    <input
                                        id="oldPassword"
                                        type={showOldPassword ? "text" : "password"}
                                        placeholder="Enter your current password"
                                        {...register("oldPassword", {
                                            required: "Current password is required"
                                        })}
                                        className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-orange-600 transition-colors duration-300"
                                    >
                                        {showOldPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.oldPassword && (
                                    <p className="text-red-600 text-sm mt-2 font-medium">{errors.oldPassword.message}</p>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-gray-200"></div>

                            {/* New Password Field */}
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-900 mb-2">
                                    New Password <span className="text-red-500">*</span>
                                </label>
                                <div className="group relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-gray-500 group-focus-within:text-orange-600 transition-colors duration-300" />
                                    </div>
                                    <input
                                        id="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="Enter a strong new password"
                                        {...register("newPassword", {
                                            required: "New password is required",
                                            minLength: {
                                                value: 6,
                                                message: "Password must be at least 6 characters"
                                            }
                                        })}
                                        className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-orange-600 transition-colors duration-300"
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.newPassword && (
                                    <p className="text-red-600 text-sm mt-2 font-medium">{errors.newPassword.message}</p>
                                )}
                                {newPassword && !errors.newPassword && (
                                    <div className="mt-2 text-xs">
                                        <p className="text-green-600 font-semibold flex items-center gap-1">
                                            <Check size={14} /> Password strength: Strong
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Password Requirements */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-blue-900 text-xs font-semibold mb-2">Password Requirements:</p>
                                <ul className="space-y-1 text-xs text-blue-800">
                                    <li className={newPassword?.length >= 6 ? 'text-green-600' : 'text-blue-800'}>
                                        ✓ At least 6 characters
                                    </li>
                                    <li>✓ Use a combination of letters and numbers</li>
                                    <li>✓ Avoid using personal information</li>
                                </ul>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => router.push("/users/profile")}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft size={18} />
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:shadow-none"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-5 h-5" />
                                            Update Password
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Security Tips Card */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                        <span className="font-semibold">🔒 Security Tip:</span> Never share your password with anyone. This should be unique and strong. Change your password regularly to keep your account secure.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default page