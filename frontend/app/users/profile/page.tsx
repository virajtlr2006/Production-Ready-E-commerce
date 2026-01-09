'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
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
    return (
        <div>
            {/* Profile details */}
            {profile && 
            <div>
                <img src={profile.profile_pic || "https://imgs.search.brave.com/pkPyTQFTOVFQw7Hki6hg6cgY5FPZ3UzkpUMsnfiuznQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvNTAwcC80/MS85MC9hdmF0YXIt/ZGVmYXVsdC11c2Vy/LXByb2ZpbGUtaWNv/bi1zaW1wbGUtZmxh/dC12ZWN0b3ItNTcy/MzQxOTAuanBn"} alt='user.jpeg'/>
                <p>{profile.email}</p>
                <p>{profile.username}</p>
                <p>{profile.phone_no}</p>
            </div>
            }
        </div>
    )
}

export default page