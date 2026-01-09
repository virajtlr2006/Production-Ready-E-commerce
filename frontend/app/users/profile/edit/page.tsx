'use client'

import React, { useEffect } from 'react'
import { Users } from '../../signup/page'
import { useForm, SubmitHandler } from "react-hook-form"
import axios from 'axios'
import { useRouter } from 'next/navigation'


const page = () => {

    // Next.js router
    const router = useRouter()

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<Users>()

    // Watch the profile_pic field
    const ProfilePic = watch("profile_pic")

    // Use useEffect to fetch old profile data
    useEffect(() => {
        FetchOldProfile()
    }, [])

    // Function to fetch old profile data
    const FetchOldProfile = async () => {

        const email = localStorage.getItem("useremail")

        // If no email found, redirect to login page
        if(!email){
            router.push("/users/login")
        }

        try {
            // Fetch old profile data
            const oldprofile = await axios.post("http://localhost:8080/users/profile", { email })
            // Reset form with old profile data
            reset(oldprofile.data.profile)
        } catch (error) {
            // Handle error
            console.log(error)
        }
    }

    // Function to handle profile edit submission
    const EditProfile = async (data: Users) => {
        // console.log(data)
        try {
            // Make API call to edit profile
            const response = await axios.post("http://localhost:8080/users/profile/edit", data)
            // Redirect to profile page
            router.push("/users/profile")
        } catch (error) {
            // Handle error
            console.log(error)
        }
    }

    return (
        <div>
            {/* Profile edit form */}
            <form onSubmit={handleSubmit(EditProfile)}>

                {ProfilePic && <img src={ProfilePic} />}

                <input placeholder="username" {...register("username", { required: true })} />
                {errors.username && <span>This field is required</span>}

                <input type="number" placeholder="phone_no" {...register("phone_no", { required: true })} />
                {errors.phone_no && <span>This field is required</span>}

                <input placeholder="profile_pic" {...register("profile_pic")} />
                {errors.profile_pic && <span>This field is required</span>}

                <input type="submit" />

            </form>
        </div>
    )
}

export default page