'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

// Type for user login data
export interface User {
  email: string,
  password: string,
}

const page = () => {

  // State for error message
  const [errormsg, setErrormsg] = useState<string | null>(null)

  // Next.js router
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<User>()

  // Function to handle user login
  const Login = async (data: User) => {
    try {
      // API call to login and data sending
      const response = await axios.post("http://localhost:8080/users/signin", data)

      // Store user email in local storage
      localStorage.setItem("useremail",data.email)

      router.push("/")
    } catch (error : any) {
      // Set error message from response
      setErrormsg(error.response.data.message)
    }
  }

  return (
    <div>
      {/* Login form */}
      <form onSubmit={handleSubmit(Login)}>

        <input type="email" placeholder="email"  {...register("email", { required: true })} />
        {errors.email && <span>This field is required</span>}

        <input type="password" placeholder="password" {...register("password", { required: true, minLength: { value: 6, message: "Minimum 6 enities" } })} />
        {errors.password && <span>{errors.password.message}</span>}

        {errormsg && <p>{errormsg}</p>}

        <input type="submit" />

      </form>
    </div>
  )
}

export default page