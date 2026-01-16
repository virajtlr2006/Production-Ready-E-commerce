'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_ENDPOINTS } from '@/lib/api'
import { Bell, Package, CheckCircle, XCircle, Loader2, Inbox } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Notification {
    id: number
    user_id: string
    title: string
    message: string
}

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchNotifications()
    }, [])

    const fetchNotifications = async () => {
        try {
            setLoading(true)
            setError(null)
            const email = localStorage.getItem('useremail')
            
            if (!email) {
                setError('Please log in to view notifications')
                setLoading(false)
                return
            }

            const response = await axios.post(API_ENDPOINTS.Get_notification, { email })
            console.log('Notifications:', response.data)
            setNotifications(response.data.AllNotifs || [])
        } catch (error) {
            console.error('Error fetching notifications:', error)
            setError('Failed to load notifications')
        } finally {
            setLoading(false)
        }
    }

    const getNotificationIcon = (title: string) => {
        if (title.toLowerCase().includes('approved')) {
            return <CheckCircle className="h-5 w-5 text-green-600" />
        } else if (title.toLowerCase().includes('rejected')) {
            return <XCircle className="h-5 w-5 text-red-600" />
        }
        return <Package className="h-5 w-5 text-orange-600" />
    }

    const getNotificationColor = (title: string) => {
        if (title.toLowerCase().includes('approved')) {
            return 'from-green-50 to-green-100 border-green-200'
        } else if (title.toLowerCase().includes('rejected')) {
            return 'from-red-50 to-red-100 border-red-200'
        }
        return 'from-orange-50 to-orange-100 border-orange-200'
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg blur-sm opacity-75"></div>
                            <div className="relative p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg">
                                <Bell className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                            <p className="text-sm text-gray-600">
                                Stay updated with your product status
                            </p>
                        </div>
                        {notifications.length > 0 && (
                            <Badge className="ml-auto bg-orange-100 text-orange-700 border-orange-300">
                                {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-10 w-10 text-orange-500 animate-spin mb-3" />
                        <p className="text-gray-600 text-sm">Loading notifications...</p>
                    </div>
                ) : error ? (
                    <div className="bg-white border border-red-200 rounded-lg shadow-sm p-8 text-center">
                        <XCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <Button 
                            onClick={fetchNotifications}
                            className="bg-orange-500 hover:bg-orange-600"
                        >
                            Try Again
                        </Button>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center">
                        <Inbox className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Notifications</h3>
                        <p className="text-gray-600">You don't have any notifications yet.</p>
                        <p className="text-sm text-gray-500 mt-2">
                            We'll notify you when there are updates on your products.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`bg-gradient-to-r ${getNotificationColor(
                                    notification.title
                                )} border rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        {getNotificationIcon(notification.title)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-semibold text-gray-900 mb-1">
                                            {notification.title}
                                        </h3>
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            {notification.message}
                                        </p>
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="flex-shrink-0 text-xs"
                                    >
                                        #{notification.id}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Refresh Button */}
                {!loading && !error && (
                    <div className="mt-6 text-center">
                        <Button
                            onClick={fetchNotifications}
                            variant="outline"
                            className="gap-2"
                        >
                            <Bell className="h-4 w-4" />
                            Refresh Notifications
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NotificationsPage
