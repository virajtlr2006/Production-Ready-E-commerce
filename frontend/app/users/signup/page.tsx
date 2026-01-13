'use client'

import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { User, Mail, Lock, Phone, ArrowRight, CheckCircle } from "lucide-react"

// Define the Users interface
export interface Users {
    id: number,
    email: string,
    password: string,
    username: string,
    phone_no: number,
    profile_pic: string | null,
}

const page = () => {

    // Next.js router
    const router = useRouter()

    // State for error message
    const [errormsg, setErrormsg] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Users>()

    // Function to handle sign up
    const SignUp = async (data: Users) => {
        try {
            setIsLoading(true)
            setErrormsg(null)

            // API call to sign up and data sending
            const response = await axios.post("http://localhost:8080/users/signup", data)
            // On success, redirect to login page
            router.push("/users/login")

        } catch (error: any) {
            // Set error message on failure
            setErrormsg(error.response?.data?.message || "Signup failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 overflow-hidden relative">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Top-right glow */}
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                {/* Bottom-left glow */}
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
                {/* Grid pattern */}
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
            <div className="w-full max-w-md relative z-10">
                {/* Card container with glass effect */}
                <div className="relative group">
                    {/* Glow border */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>

                    {/* Main content */}
                    <div className="relative bg-slate-900/80 backdrop-blur-xl px-8 py-10 rounded-2xl border border-slate-800/50 shadow-2xl">
                        {/* Header */}
                        <div className="mb-10 text-center">
                            <div className="inline-block p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-500/30 mb-4">
                                <CheckCircle className="w-6 h-6 text-purple-400" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                                Create Account
                            </h1>
                            <p className="text-slate-400 text-sm font-light">
                                Join us today and explore amazing products
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(SignUp)} className="space-y-4">
                            {/* Username field */}
                            <div className="group relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors duration-300" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Username"
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

                            {/* Email field */}
                            <div className="group relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors duration-300" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-slate-800/80 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 backdrop-blur-sm"
                                />
                                {errors.email && (
                                    <span className="text-red-400 text-xs mt-1.5 block font-medium">
                                        {errors.email.message}
                                    </span>
                                )}
                            </div>

                            {/* Password field */}
                            <div className="group relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors duration-300" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters"
                                        }
                                    })}
                                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-slate-800/80 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 backdrop-blur-sm"
                                />
                                {errors.password && (
                                    <span className="text-red-400 text-xs mt-1.5 block font-medium">
                                        {errors.password.message}
                                    </span>
                                )}
                            </div>

                            {/* Phone field */}
                            <div className="group relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Phone className="w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors duration-300" />
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Phone number"
                                    {...register("phone_no", {
                                        required: "Phone number is required",
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: "Phone number must be 10 digits"
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

                            {/* Error message */}
                            {errormsg && (
                                <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 text-red-400 text-sm font-medium">
                                    {errormsg}
                                </div>
                            )}

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full mt-8 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 disabled:shadow-none relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Creating account...
                                        </>
                                    ) : (
                                        <>
                                            Sign Up
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                        </>
                                    )}
                                </span>
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <p className="text-slate-400 text-sm">
                                Already have an account?{' '}
                                <button
                                    onClick={() => router.push('/users/login')}
                                    className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-300 underline-offset-2 hover:underline"
                                >
                                    Sign in
                                </button>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="mt-8 flex justify-between items-center px-4">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                    <span className="px-3 text-xs text-slate-500 font-light">Secure Registration</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                </div>
            </div>
        </div>
    )
}

export default page