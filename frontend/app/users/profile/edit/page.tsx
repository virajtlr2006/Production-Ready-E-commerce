'use client'

import React, { useEffect, useState } from 'react'
import { Users } from '../../signup/page'
import { useForm, SubmitHandler } from "react-hook-form"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { User, Phone, Image, ArrowLeft, Check, AlertCircle, Loader } from 'lucide-react'

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
            const oldprofile = await axios.post("http://localhost:8080/users/profile", { email })
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

            const response = await axios.post("http://localhost:8080/users/profile/edit", data)
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
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage:
                            'linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent)',
                        backgroundSize: '50px 50px',
                    }}
                ></div>
            </div>

            {/* Main container */}
            <div className="max-w-2xl mx-auto relative z-10">
                {/* Header with back button */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.push("/users/profile")}
                        className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors duration-300 text-slate-400 hover:text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
                        <p className="text-slate-400 text-sm mt-1">Update your personal information</p>
                    </div>
                </div>

                {/* Card container */}
                <div className="relative group">
                    {/* Glow border */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>

                    {/* Main content */}
                    <div className="relative bg-slate-900/80 backdrop-blur-xl p-8 md:p-10 rounded-2xl border border-slate-800/50 shadow-2xl">
                        
                        {/* Success message */}
                        {successMsg && (
                            <div className="mb-6 bg-green-500/10 border border-green-500/50 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top">
                                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                <p className="text-green-400 text-sm font-medium">{successMsg}</p>
                            </div>
                        )}

                        {/* Error message */}
                        {errorMsg && (
                            <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-red-400 text-sm font-medium">{errorMsg}</p>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit(EditProfile)} className="space-y-6">
                            
                            {/* Profile Picture Section */}
                            <div className="space-y-4">
                                <label className="block text-sm font-semibold text-white">Profile Picture</label>
                                
                                {/* Preview */}
                                {profilePicPreview && (
                                    <div className="relative inline-block group">
                                        <img
                                            src={profilePicPreview}
                                            alt="Profile preview"
                                            className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover border-2 border-purple-500/30 group-hover:border-purple-500/60 transition-all duration-300 shadow-lg"
                                        />
                                        <div className="absolute inset-0 rounded-2xl bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                                    </div>
                                )}

                                {/* Input field */}
                                <div className="group relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Image className="w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors duration-300" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter image URL"
                                        {...register("profile_pic")}
                                        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-slate-800/80 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 backdrop-blur-sm"
                                    />
                                    {errors.profile_pic && (
                                        <span className="text-red-400 text-xs mt-1.5 block font-medium">
                                            {String(errors.profile_pic.message)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>

                            {/* Username field */}
                            <div className="group relative">
                                <label className="block text-sm font-semibold text-white mb-2">Username</label>
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none mt-8">
                                    <User className="w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors duration-300" />
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
                                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-slate-800/80 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 backdrop-blur-sm"
                                />
                                {errors.username && (
                                    <span className="text-red-400 text-xs mt-1.5 block font-medium">
                                        {errors.username.message}
                                    </span>
                                )}
                            </div>

                            {/* Phone number field */}
                            <div className="group relative">
                                <label className="block text-sm font-semibold text-white mb-2">Phone Number</label>
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none mt-8">
                                    <Phone className="w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors duration-300" />
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    {...register("phone_no", {
                                        required: "Phone number is required",
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: "Phone number must be exactly 10 digits"
                                        }
                                    })}
                                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-slate-800/80 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 backdrop-blur-sm"
                                />
                                {errors.phone_no && (
                                    <span className="text-red-400 text-xs mt-1.5 block font-medium">
                                        {errors.phone_no.message}
                                    </span>
                                )}
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-4 pt-6 mt-8 border-t border-slate-700/50">
                                <button
                                    type="button"
                                    onClick={() => router.push("/users/profile")}
                                    className="flex-1 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-white font-semibold py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500/20"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 disabled:shadow-none relative overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        {isLoading ? (
                                            <>
                                                <Loader className="w-4 h-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-4 h-4" />
                                                Save Changes
                                            </>
                                        )}
                                    </span>
                                    {/* Shimmer effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page