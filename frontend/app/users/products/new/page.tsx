'use client'

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form"

//  Define the Products interface
export interface Products {
    id:number;
    email: string;
    category: string;
    p_name: string;
    description: string;
    price: number;
    image_url: string;
    stock: number;
    isApproved:boolean;
}


const page = () => {

    // State to handle error messages
    const [errormsg, setErrormsg] = useState(null)

    // Next.js router 
    const router = useRouter()

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Products>()

    // Function to handle product creation
    const CreateProduct = async (data: Products) => {

        try {
            // Get user email from local storage
            const email = localStorage.getItem("useremail")

            // Redirect to login if email is not found
            if (!email) {
                router.push("/users/login")
            }

            // Combine form data with email
            const newdata = { ...data, email }
            // console.log(newdata)

            // Make POST request to create new product
            const response = await axios.post("http://localhost:8080/products/newproducts", newdata);
            // console.log(response.data)

            // Redirect to all products page upon successful creation
            router.push("/users/products/all")
        } catch (error : any) {
            // Set error message from response
            setErrormsg(error.response.data.message)
        }
    }

    return (
        <div>
            {/* Form to create a new product */}
            <form onSubmit={handleSubmit(CreateProduct)}>

                <input {...register("category", { required: true })} placeholder="Category" />
                {errors.category && <span>This field is required</span>}

                <input {...register("p_name", { required: true })} placeholder="Product Name" />
                {errors.p_name && <span>This field is required</span>}

                <input {...register("description", { required: true })} placeholder="Description" />
                {errors.description && <span>This field is required</span>}

                <input type="number" {...register("price", { required: true })} placeholder="Price" />
                {errors.price && <span>This field is required</span>}

                <input {...register("image_url", { required: true })} placeholder="Image URL" />
                {errors.image_url && <span>This field is required</span>}

                <input type="number" {...register("stock", { required: true })} placeholder="Stock" />
                {errors.stock && <span>This field is required</span>}

                {errormsg && <p>{errormsg}</p>}

                <input type="submit" />
            </form>
        </div>
    )
}

export default page