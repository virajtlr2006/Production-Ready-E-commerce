'use client'

import { Products } from '../../new/page'
import axios from 'axios'
import { useForm } from "react-hook-form"
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'


const page = () => {

    const {id} = useParams()

    const router = useRouter() 

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<Products>()

    useEffect(() => {
        FetchOldProduct()
    }, [])
    

    const FetchOldProduct = async () => {

        const response = await axios.post(`http://localhost:8080/products/productdetails/${id}`)

        reset(response.data.ProductDetails[0])
    }

    const EditProduct = async (data:Products) => {
        const response = await axios.post(`http://localhost:8080/products/editproduct/${id}`,data)
        router.push("/users/products/userall")
    }

  return (
    <div>Edit product
        <form onSubmit={handleSubmit(EditProduct)}>

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

                <input type="submit" />
            </form>
    </div>
  )
}

export default page