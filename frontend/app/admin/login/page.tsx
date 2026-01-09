'use client'

import { useForm, SubmitHandler } from "react-hook-form"
import axios from "axios"
import { useState } from "react"
import { useRouter } from "next/navigation"

export interface Admin {
    email: string,
    password: string,
}


const page = () => {

    const [errormsg, seterrormsg] = useState(null)

    const router = useRouter()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Admin>()

    const signUp = async (data: Admin) => {
        // console.log(data)

        try {
            const response = await axios.post("http://localhost:8080/admin/signin", {
                "email": data.email,
                "password": data.password,
            })
            // console.log(response)
            localStorage.setItem("email",data.email)
            router.push("/")
        } catch (error: any) {
            seterrormsg(error.response.data.message);          
        }

    }

    return (
        <div>

            <form onSubmit={handleSubmit(signUp)}>

                <input placeholder="email"  {...register("email", { required: true })} />
                {errors.email && <span>This field is required</span>}

                <input placeholder="password" {...register("password", { required: true })} />
                {errors.password && <span>This field is required</span>}

                <input type="submit" />

                {errormsg && <p className="text-red-500 font-bold">{errormsg}</p>}
            </form>
        </div>
    )
}

export default page