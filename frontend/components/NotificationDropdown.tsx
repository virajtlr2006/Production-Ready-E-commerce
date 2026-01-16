'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, Check, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { API_ENDPOINTS } from '@/lib/api'

interface Notification {
  id: number
  user_id: string
  title: string
  message: string
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [notification, setNotification] = useState<Notification | null>(null)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('useremail')
      if (email) {
        fetchNotifications(email)
      }
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchNotifications = async (email: string) => {
    try {
      setLoading(true)
      const response = await axios.post(API_ENDPOINTS.Get_notification, { email })
      if (response.data.AllNotifs) {
        setNotification(response.data.AllNotifs)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDismiss = () => {
    setNotification(null)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative gap-2"
      >
        <Bell className="h-5 w-5" />
        {notification && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">1</span>
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center">
                <div className="animate-spin h-6 w-6 border-2 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Loading...</p>
              </div>
            ) : notification ? (
              <div className="p-4 hover:bg-gray-50 border-b border-gray-100">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Check className="h-4 w-4 text-green-500" />
                      <h4 className="font-semibold text-sm text-gray-900">{notification.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                  </div>
                  <button
                    onClick={handleDismiss}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No notifications</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
