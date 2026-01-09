'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

// Type for updating password
export interface UpdatePass {
    oldPassword: string,
    newPassword: string,
}

const page = () => {

    // State for error message
    const [errormsg, setErrormsg] = useState(null)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm<UpdatePass>()

    //   Next.js router
    const router = useRouter()
    
    // Function to handle password update
    const updatePassword = async (data: UpdatePass) => {
        // Get email from local storage
        const email = localStorage.getItem("useremail")
        // Redirect to login if email not found
        if (!email) {
            router.push("/users/login")
            return false
        }

        try {
            // Make API call to update password
            const response = await axios.post("http://localhost:8080/users/newpass",{email , oldPassword: data.oldPassword, password: data.newPassword})
            // console.log(response.data)
        } catch (error : any) {
            // Handle error and set error message
            setErrormsg(error.response.data.message);
        }
    }
  return (
    <div>
        {/* Password update form */}
        <form onSubmit={handleSubmit(updatePassword)}>          

            <input type="password" placeholder="Old Password"  {...register("oldPassword", { required: true })} />
            {errors.oldPassword && <span>This field is required</span>}

            <input type="password" placeholder="New Password" {...register("newPassword", { required: true, minLength: { value: 6, message: "Minimum 6 enities" } })} />
            {errors.newPassword && <span>{errors.newPassword.message}</span>}

            {errormsg && <p>{errormsg}</p>}

            <input type="submit" />

        </form>
    </div>
  )
}

export default page