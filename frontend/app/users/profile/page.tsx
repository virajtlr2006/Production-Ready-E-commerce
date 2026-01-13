'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Users } from '../signup/page'
import { User, Mail, Phone, Lock, Edit2, LogOut, Loader2 } from 'lucide-react'
import { API_ENDPOINTS } from '@/lib/api'

const page = () => {
    // Use useEffect to fetch profile data
    useEffect(() => {
        FetchProfile()
    }, [])

    // State for user profile data
    const [profile, setProfile] = useState<Users | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Next.js router
    const router = useRouter()

    // Function to fetch user profile
    const FetchProfile = async () => {
        try {
            setLoading(true)
            // Get user email from local storage
            const email = localStorage.getItem("useremail")

            // If no email found, redirect to login page
            if (!email) {
                router.push("/users/login")
                return false
            }

            // Make API call to fetch profile data
            const response = await axios.post(API_ENDPOINTS.USER_PROFILE, { email })
            setProfile(response.data.profile)
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to load profile')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const UpdatePassword = async () => {
        router.push("/users/updatePass")
    }

    const HandleLogout = () => {
        localStorage.removeItem("useremail")
        router.push("/users/login")
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 text-orange-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 text-base font-medium">Loading your profile...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-8 px-4 sm:px-6 lg:px-8">
            {error && (
                <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 font-semibold">{error}</p>
                </div>
            )}

            {profile && (
                <div className="max-w-2xl mx-auto">
                    {/* Profile Header Card */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                        {/* Header Background */}
                        <div className="h-40 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 left-0 w-40 h-40 bg-orange-600 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                                <div className="absolute bottom-0 right-0 w-40 h-40 bg-orange-600 rounded-full translate-x-1/2 translate-y-1/2"></div>
                            </div>
                        </div>

                        {/* Profile Content */}
                        <div className="px-6 pb-8 -mt-16 relative">
                            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                                {/* Left side - Profile Picture and Name */}
                                <div className="flex items-end gap-4">
                                    {/* Profile Picture */}
                                    <div className="relative">
                                        <img
                                            src={profile.profile_pic || "https://imgs.search.brave.com/pkPyTQFTOVFQw7Hki6hg6cgY5FPZ3UzkpUMsnfiuznQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvNTAwcC80/MS85MC9hdmF0YXIt/ZGVmYXVsdC11c2Vy/LXByb2ZpbGUtaWNv/bi1zaW1wbGUtZmxh/dC12ZWN0b3ItNTcy/MzQxOTAuanBn"}
                                            alt='user profile'
                                            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                                        />
                                        <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                                    </div>

                                    {/* Name and Badge */}
                                    <div className="pb-2">
                                        <h1 className="text-2xl font-bold text-gray-900">{profile.username}</h1>
                                        <p className="text-orange-600 font-semibold text-sm">Member since 2024</p>
                                    </div>
                                </div>

                                {/* Edit Button */}
                                <button
                                    onClick={() => router.push('/users/profile/edit')}
                                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 w-full sm:w-auto justify-center"
                                >
                                    <Edit2 size={18} />
                                    Edit Profile
                                </button>
                            </div>

                            {/* Information Section */}
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Email Card */}
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-blue-500 rounded-lg">
                                            <Mail className="h-5 w-5 text-white" />
                                        </div>
                                        <p className="text-sm font-semibold text-blue-900">Email Address</p>
                                    </div>
                                    <p className="text-gray-800 font-medium ml-11 break-all text-sm">
                                        {profile.email}
                                    </p>
                                </div>

                                {/* Phone Card */}
                                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-green-500 rounded-lg">
                                            <Phone className="h-5 w-5 text-white" />
                                        </div>
                                        <p className="text-sm font-semibold text-green-900">Phone Number</p>
                                    </div>
                                    <p className="text-gray-800 font-medium ml-11 text-sm">
                                        {profile.phone_no}
                                    </p>
                                </div>

                                {/* Username Card */}
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-purple-500 rounded-lg">
                                            <User className="h-5 w-5 text-white" />
                                        </div>
                                        <p className="text-sm font-semibold text-purple-900">Username</p>
                                    </div>
                                    <p className="text-gray-800 font-medium ml-11 text-sm">
                                        {profile.username}
                                    </p>
                                </div>

                                {/* Account Status Card */}
                                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-yellow-500 rounded-lg">
                                            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-yellow-500 text-xs font-bold">✓</div>
                                        </div>
                                        <p className="text-sm font-semibold text-yellow-900">Account Status</p>
                                    </div>
                                    <p className="text-gray-800 font-medium ml-11 text-sm">
                                        Active
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={UpdatePassword}
                                    className="flex items-center justify-center gap-2 bg-orange-100 hover:bg-orange-200 text-orange-900 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 border border-orange-300"
                                >
                                    <Lock size={20} />
                                    Change Password
                                </button>

                                <button
                                    onClick={HandleLogout}
                                    className="flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-900 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 border border-red-300"
                                >
                                    <LogOut size={20} />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => router.push('/users/products/userall')}
                            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 text-center"
                        >
                            <div className="text-3xl mb-2">📦</div>
                            <h3 className="font-bold text-gray-900 mb-1">My Products</h3>
                            <p className="text-sm text-gray-600">Manage your listings</p>
                        </button>

                        <button
                            onClick={() => router.push('/users/products/new')}
                            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 text-center"
                        >
                            <div className="text-3xl mb-2">➕</div>
                            <h3 className="font-bold text-gray-900 mb-1">Add Product</h3>
                            <p className="text-sm text-gray-600">List a new item</p>
                        </button>

                        <button
                            onClick={() => router.push('/users/products/all')}
                            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 text-center"
                        >
                            <div className="text-3xl mb-2">🛍️</div>
                            <h3 className="font-bold text-gray-900 mb-1">Browse Products</h3>
                            <p className="text-sm text-gray-600">Explore marketplace</p>
                        </button>
                    </div>

                    {/* Account Info Card */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                            <span className="text-xl">ℹ️</span>
                            Account Information
                        </h3>
                        <ul className="space-y-2 text-sm text-blue-800">
                            <li>✓ Your account is secure and protected</li>
                            <li>✓ You can edit your profile information anytime</li>
                            <li>✓ Keep your password strong and private</li>
                            <li>✓ Contact support for any account issues</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
}

export default page