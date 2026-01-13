'use client'

import React, { useEffect, useState } from 'react'
import { Users } from '../../signup/page'
import { useForm } from "react-hook-form"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { User, Phone, Image, ArrowLeft, Check, AlertCircle, Loader2, Save } from 'lucide-react'
import { API_ENDPOINTS } from '@/lib/api'

const page = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [successMsg, setSuccessMsg] = useState<string | null>(null)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<Users>()

    const ProfilePic = watch("profile_pic")
    const username = watch("username")
    const phone = watch("phone_no")

    // Fetch old profile data on mount
    useEffect(() => {
        FetchOldProfile()
    }, [])

    // Update preview when profile_pic changes
    useEffect(() => {
        if (ProfilePic && typeof ProfilePic === 'string') {
            setProfilePicPreview(ProfilePic)
        }
    }, [ProfilePic])

    const FetchOldProfile = async () => {
        const email = localStorage.getItem("useremail")

        if (!email) {
            router.push("/users/login")
            return
        }

        try {
            const oldprofile = await axios.post(API_ENDPOINTS.USER_PROFILE, { email })
            reset(oldprofile.data.profile)
            if (oldprofile.data.profile.profile_pic) {
                setProfilePicPreview(oldprofile.data.profile.profile_pic)
            }
        } catch (error) {
            console.log(error)
            setErrorMsg("Failed to load profile. Please try again.")
        }
    }

    const EditProfile = async (data: Users) => {
        try {
            setIsLoading(true)
            setErrorMsg(null)
            setSuccessMsg(null)

            await axios.post(API_ENDPOINTS.USER_PROFILE_EDIT, data)
            setSuccessMsg("Profile updated successfully!")

            setTimeout(() => {
                router.push("/users/profile")
            }, 1500)
        } catch (error: any) {
            setErrorMsg(error.response?.data?.message || "Failed to update profile. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Header with back button */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.push("/users/profile")}
                        className="p-2 hover:bg-orange-100 rounded-lg transition-colors duration-300 text-gray-600 hover:text-orange-600"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
                        <p className="text-gray-600 text-sm mt-1">Update your personal information and profile picture</p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                    <div className="p-8 space-y-6">
                        {/* Success message */}
                        {successMsg && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-green-800 font-semibold text-sm">{successMsg}</p>
                                    <p className="text-green-700 text-sm mt-1">Redirecting to your profile...</p>
                                </div>
                            </div>
                        )}

                        {/* Error message */}
                        {errorMsg && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-red-800 font-semibold text-sm">Error</p>
                                    <p className="text-red-700 text-sm mt-1">{errorMsg}</p>
                                </div>
                                <button
                                    onClick={() => setErrorMsg(null)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit(EditProfile)} className="space-y-6">
                            {/* Profile Picture Section */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-4">Profile Picture</label>

                                {/* Preview */}
                                {profilePicPreview && (
                                    <div className="relative mb-4">
                                        <div className="inline-block relative group">
                                            <img
                                                src={profilePicPreview}
                                                alt="Profile preview"
                                                className="w-32 h-32 rounded-xl object-cover border-4 border-orange-200 group-hover:border-orange-400 transition-all duration-300 shadow-md"
                                            />
                                            <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-3">Current profile picture</p>
                                    </div>
                                )}

                                {/* Input field */}
                                <div className="group relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Image className="w-5 h-5 text-gray-500 group-focus-within:text-orange-600 transition-colors duration-300" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter image URL (https://example.com/image.jpg)"
                                        {...register("profile_pic")}
                                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300"
                                    />
                                    {errors.profile_pic && (
                                        <span className="text-red-600 text-xs mt-2 block font-medium">
                                            {String(errors.profile_pic.message)}
                                        </span>
                                    )}
                                    <p className="text-xs text-gray-500 mt-2">Use a direct link to an image file (JPG, PNG, etc.)</p>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-gray-200"></div>

                            {/* Username field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Username</label>
                                <div className="group relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="w-5 h-5 text-gray-500 group-focus-within:text-orange-600 transition-colors duration-300" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter your username"
                                        {...register("username", {
                                            required: "Username is required",
                                            minLength: {
                                                value: 3,
                                                message: "Username must be at least 3 characters"
                                            }
                                        })}
                                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300"
                                    />
                                </div>
                                {errors.username && (
                                    <span className="text-red-600 text-xs mt-2 block font-medium">
                                        {errors.username.message}
                                    </span>
                                )}
                                {username && !errors.username && (
                                    <p className="text-xs text-green-600 mt-2 font-semibold">✓ Username looks good</p>
                                )}
                            </div>

                            {/* Phone number field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number</label>
                                <div className="group relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Phone className="w-5 h-5 text-gray-500 group-focus-within:text-orange-600 transition-colors duration-300" />
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="Enter your 10-digit phone number"
                                        {...register("phone_no", {
                                            required: "Phone number is required",
                                            pattern: {
                                                value: /^[0-9]{10}$/,
                                                message: "Phone number must be exactly 10 digits"
                                            }
                                        })}
                                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300"
                                    />
                                </div>
                                {errors.phone_no && (
                                    <span className="text-red-600 text-xs mt-2 block font-medium">
                                        {errors.phone_no.message}
                                    </span>
                                )}
                                {phone && !errors.phone_no && (
                                    <p className="text-xs text-green-600 mt-2 font-semibold">✓ Phone number is valid</p>
                                )}
                            </div>

                            {/* Action buttons */}
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
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Info Card */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm">
                        <span className="font-semibold">Tip:</span> Make sure your phone number is correct and your profile picture is a clear, professional image for better user recognition.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default page