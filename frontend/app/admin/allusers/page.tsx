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
import { DeleteIcon, Trash2 } from 'lucide-react'
import { API_ENDPOINTS } from '@/lib/api'

const page = () => {

    // State to hold all users
    const [allusers, setAllusers] = useState<Users[] | null>(null)

    useEffect(() => {
        FetchAllUsers()
    }, [])

    // Function to fetch all users from the backend
    const FetchAllUsers = async () => {
        // console.log("Fetching all users")
        // GET request to fetch all users
        const response = await axios.get(API_ENDPOINTS.ADMIN_ALL_USERS)
        // console.log(response.data.Users)
        // Set the fetched users into state
        setAllusers(response.data.Users)
    }

    const DeleteUser = async (id: number) => {
        // console.log(id)
        // DELETE request to delete user by id
        await axios.delete(API_ENDPOINTS.DELETE_USER(id))
        // Refresh the user list after deletion
        FetchAllUsers()
    }
    return (
        <div>
            <h1 className='text-3xl font-extrabold flex justify-center my-10'>ALL USERS</h1>
            <Table>
                <TableCaption>A list of all recent users.</TableCaption>
                <TableHeader>
                    <TableRow className='justify-around'>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead >Phone No.</TableHead>
                        <TableHead>Password</TableHead>
                        <TableHead>Delete</TableHead>
                    </TableRow>
                </TableHeader>
                {allusers && allusers.map((users) =>
                    <TableBody key={users.id || Math.random()}>
                        <TableRow>
                            <TableCell className="font-medium">{users.id}</TableCell>
                            <TableCell>{users.email}</TableCell>
                            <TableCell>{users.username}</TableCell>
                            <TableCell>{users.phone_no}</TableCell>
                            <TableCell>{users.password}</TableCell>
                            <TableCell><Trash2 onClick={() => users.id && DeleteUser(users.id)}/></TableCell>
                        </TableRow>
                    </TableBody>
                )}
            </Table>
        </div>
    )
}

export default page