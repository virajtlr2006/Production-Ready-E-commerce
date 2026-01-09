'use client'

import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"

// Define the Users interface
export interface Users {
    id:number,
    email: string,
    password: string,
    username: string,
    phone_no: number,
    profile_pic :string | null,
}

const page = () => {

    // Next.js router
    const router = useRouter()

    // State for error message
    const [errormsg, setErrormsg] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Users>()

    // Function to handle sign up
    const SignUp = async (data: Users) => {
        // console.log(data)
        try {
            // API call to sign up and data sending
            const response = await axios.post("http://localhost:8080/users/signup",data)
            // On success, redirect to login page
            router.push("/users/login")
            
        } catch (error:any) {
            // Set error message on failure
            setErrormsg(error.response.data.message)
        }
    }
    return (
        <div>
            {/* Sign Up form */}
            <form onSubmit={handleSubmit(SignUp)}>

                <input placeholder="name" {...register("username", { required: true })} />
                {errors.username && <span>This field is required</span>}

                <input type="email" placeholder="email"  {...register("email", { required: true })} />
                {errors.email && <span>This field is required</span>}

                <input type="password" placeholder="password" {...register("password", { required: true, minLength:{value:6,message:"Minimum 6 enities"}})} />
                {errors.password && <span>{errors.password.message}</span>}

                <input type="number" placeholder="phone_no" {...register("phone_no", { required: true })} />
                {errors.phone_no && <span>This field is required</span>}

                {errormsg && <p>{errormsg}</p>}

                <input type="submit" />

            </form>
        </div>
    )
}

export default page