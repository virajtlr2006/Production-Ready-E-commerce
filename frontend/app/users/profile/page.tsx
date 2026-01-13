'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Users } from '../signup/page'

const page = () => {

    // Use useEffect to fetch profile data
    useEffect(() => {
        FetchProfile()
    }, [])

    // State for user profile data
    const [profile, setProfile] = useState<Users | null>(null)

    // Next.js router
    const router = useRouter()

    // Function to fetch user profile
    const FetchProfile = async () => {
        // Get user email from local storage
        const email = localStorage.getItem("useremail")
        // console.log(email)

        // If no email found, redirect to login page
        if (!email) {
            router.push("/users/login")
            return false
        }

        try {
            // Make API call to fetch profile data
            const response = await axios.post("http://localhost:8080/users/profile", { email })
            setProfile(response.data.profile)

        } catch (error) {
            // Handle error
            console.log(error)
        }
    }

    const UpdatePassword = async () => {
        router.push("/users/updatePass")
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
            {/* Profile details */}
            {profile && 
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Header Background */}
                <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                
                {/* Profile Content */}
                <div className="px-6 pb-6">
                    {/* Profile Picture */}
                    <div className="flex justify-center -mt-20 mb-4">
                        <img 
                            src={profile.profile_pic || "https://imgs.search.brave.com/pkPyTQFTOVFQw7Hki6hg6cgY5FPZ3UzkpUMsnfiuznQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvNTAwcC80/MS85MC9hdmF0YXIt/ZGVmYXVsdC11c2Vy/LXByb2ZpbGUtaWNv/bi1zaW1wbGUtZmxh/dC12ZWN0b3ItNTcy/MzQxOTAuanBn"} 
                            alt='user profile'
                            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                        />
                    </div>
                    
                    {/* User Information */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{profile.username}</h2>
                        
                        <div className="space-y-3">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="text-gray-800 font-medium break-all">{profile.email}</p>
                            </div>
                            
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-600">Phone</p>
                                <p className="text-gray-800 font-medium">{profile.phone_no}</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Update Password Button */}
                    <button 
                        onClick={() => UpdatePassword()}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
                    >
                        Update Password
                    </button>
                </div>
            </div>
            }
        </div>
    )
}

export default page