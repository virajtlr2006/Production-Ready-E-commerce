'use client'

import { useForm } from "react-hook-form"
import axios from "axios"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Lock, Loader2 } from "lucide-react"
import Link from "next/link"
import { API_ENDPOINTS } from "@/lib/api"

// Type for user login data
export interface User {
  email: string
  password: string
}

const page = () => {
  const [errormsg, setErrormsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>()

  // Function to handle user login
  const Login = async (data: User) => {
    try {
      setLoading(true)
      setErrormsg(null)

      // API call to login and data sending
      await axios.post(API_ENDPOINTS.USER_SIGNIN, data)

      // Store user email in local storage
      localStorage.setItem('useremail', data.email)

      router.push('/')
    } catch (error: any) {
      // Set error message from response
      setErrormsg(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg blur-sm opacity-75"></div>
              <div className="relative p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg">
                <Lock className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Welcome Back!</h1>

          {/* Hero Message Box */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 mb-4 shadow-md">
            <p className="text-xl font-bold text-white mb-1.5 tracking-tight">
              Your Shopping Awaits 🛍️
            </p>
            <p className="text-sm text-orange-50 leading-relaxed font-medium">
              Access your cart, orders, and favorites.<br />Shop amazing deals today.
            </p>
          </div>

          {/* Feature Badges */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="bg-green-50 border border-green-200 rounded-full px-3 py-1.5 flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-green-600" />
              <span className="text-xs font-semibold text-green-700">Secure Access</span>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-full px-3 py-1.5 flex items-center gap-1.5">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-blue-700">Always Online</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
          <div className="mb-4 pb-3 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-0.5">Sign In to Your Account</h2>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <span className="inline-block w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-[10px]">✓</span>
              Quick and secure customer access
            </p>
          </div>
          <form onSubmit={handleSubmit(Login)} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              />
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Error Message */}
            {errormsg && (
              <div className="p-2 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">{errormsg}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Signing In...
                </>
              ) : (
                'Sign In to Your Account'
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>

            {/* Signup Link */}
            <Link href="/users/signup">
              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Create Account
              </Button>
            </Link>
          </form>
        </div>

        {/* Footer Links */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-600">
            Protected by enterprise-grade security.{" "}
            <a href="#" className="text-blue-600 hover:text-orange-600 hover:underline">
              Learn more
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page