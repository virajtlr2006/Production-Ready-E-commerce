'use client'

import { Users } from '@/app/users/signup/page'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, Users as UsersIcon, Mail, Phone, User, Loader2, AlertCircle, CheckCircle, Search } from 'lucide-react'
import { API_ENDPOINTS } from '@/lib/api'

const page = () => {

    // State to hold all users
    const [allusers, setAllusers] = useState<Users[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState<number | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        FetchAllUsers()
    }, [])

    // Function to fetch all users from the backend
    const FetchAllUsers = async () => {
        try {
            setLoading(true)
            const response = await axios.get(API_ENDPOINTS.ADMIN_ALL_USERS)
            setAllusers(response.data.Users)
            setErrorMessage('')
        } catch (error) {
            console.error('Error fetching users:', error)
            setErrorMessage('Failed to load users')
        } finally {
            setLoading(false)
        }
    }

    const DeleteUser = async (id: number | undefined, email: string) => {
        if (!id) return
        
        if (!window.confirm(`Are you sure you want to delete ${email}? This action cannot be undone.`)) {
            return
        }

        try {
            setDeleting(id)
            await axios.delete(API_ENDPOINTS.DELETE_USER(id))
            setSuccessMessage(`User ${email} deleted successfully`)
            setTimeout(() => setSuccessMessage(''), 3000)
            FetchAllUsers()
        } catch (error) {
            console.error('Error deleting user:', error)
            setErrorMessage('Failed to delete user')
        } finally {
            setDeleting(null)
        }
    }

    // Filter users based on search query
    const filteredUsers = allusers?.filter(user =>
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone_no?.includes(searchQuery)
    ) || []

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <UsersIcon size={32} className="text-purple-600" />
                        <h1 className="text-4xl font-bold text-gray-900">All Users</h1>
                    </div>
                    <p className="text-gray-600">Manage and monitor all registered users</p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <Card className="border-purple-200 bg-white hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-purple-600 mb-2">
                                    {allusers?.length || 0}
                                </div>
                                <p className="text-sm text-gray-600">Total Users</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-purple-200 bg-white hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-2">
                                    {allusers?.filter(u => u.email).length || 0}
                                </div>
                                <p className="text-sm text-gray-600">Verified Emails</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-purple-200 bg-white hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600 mb-2">
                                    {allusers?.filter(u => u.phone_no).length || 0}
                                </div>
                                <p className="text-sm text-gray-600">Phone Verified</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-purple-200 bg-white hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-orange-600 mb-2">
                                    {allusers?.filter(u => u.username).length || 0}
                                </div>
                                <p className="text-sm text-gray-600">Username Set</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search Bar */}
                <Card className="border-purple-200 bg-white mb-6">
                    <CardContent className="pt-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by email, username, or phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Messages */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-300 rounded-lg flex items-center gap-3 text-green-700">
                        <CheckCircle size={20} />
                        <p className="font-medium">{successMessage}</p>
                    </div>
                )}

                {errorMessage && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg flex items-center gap-3 text-red-700">
                        <AlertCircle size={20} />
                        <p className="font-medium">{errorMessage}</p>
                    </div>
                )}

                {/* Users Table */}
                <Card className="border-purple-200 bg-white">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-white border-b border-purple-200">
                        <CardTitle className="text-purple-900">Users Directory</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 size={48} className="text-purple-600 animate-spin" />
                            </div>
                        ) : allusers && allusers.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b-2 border-purple-200 hover:bg-purple-50">
                                            <TableHead className="font-bold text-purple-900">ID</TableHead>
                                            <TableHead className="font-bold text-purple-900">Email</TableHead>
                                            <TableHead className="font-bold text-purple-900">Username</TableHead>
                                            <TableHead className="font-bold text-purple-900">Phone</TableHead>
                                            <TableHead className="font-bold text-purple-900">Profile</TableHead>
                                            <TableHead className="font-bold text-purple-900 text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.map((user) => (
                                            <TableRow 
                                                key={user.id || Math.random()}
                                                className="border-b border-gray-200 hover:bg-purple-50 transition-colors"
                                            >
                                                <TableCell>
                                                    <Badge className="bg-purple-100 text-purple-700">#{user.id}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Mail size={16} className="text-gray-400" />
                                                        <span className="font-medium text-gray-900">{user.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <User size={16} className="text-gray-400" />
                                                        <span className="text-gray-700">{user.username || '-'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Phone size={16} className="text-gray-400" />
                                                        <span className="text-gray-700">{user.phone_no || '-'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        {user.username && (
                                                            <Badge className="bg-green-100 text-green-700">Username</Badge>
                                                        )}
                                                        {user.phone_no && (
                                                            <Badge className="bg-blue-100 text-blue-700">Phone</Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => DeleteUser(user.id, user.email)}
                                                        disabled={deleting === user.id}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        {deleting === user.id ? (
                                                            <>
                                                                <Loader2 size={16} className="mr-2 animate-spin" />
                                                                Deleting...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Trash2 size={16} className="mr-2" />
                                                                Delete
                                                            </>
                                                        )}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                {filteredUsers.length === 0 && (
                                    <div className="text-center py-8">
                                        <AlertCircle size={48} className="mx-auto text-gray-400 mb-2" />
                                        <p className="text-gray-600">No users found matching your search</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <UsersIcon size={48} className="mx-auto text-gray-400 mb-3" />
                                <p className="text-gray-600 font-medium">No users registered yet</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Footer Info */}
                {allusers && allusers.length > 0 && (
                    <div className="mt-4 text-center text-sm text-gray-600">
                        <p>Showing {filteredUsers.length} of {allusers.length} users</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default page