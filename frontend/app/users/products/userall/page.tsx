'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Products } from '../new/page'
import { useRouter } from 'next/navigation'
import { Edit2, Trash2 } from 'lucide-react'

const page = () => {

    // State to hold user productserror
    const [userproducts, setUserproducts] = useState<Products[] | null>(null)
    const [errormsg, setErrormsg] = useState(null)

    useEffect(() => {
        FetchUserProducts()
    }, [])

    // Next.js router
    const router = useRouter()

    // Function to fetch products of the logged-in user
    const FetchUserProducts = async () => {
        try {
            // Get user email from local storage
            const email = localStorage.getItem("useremail")

            // Redirect to login if email is not found
            if (!email) {
                router.push("/users/login")
                // Break the function execution
                return false
            }
            // Make POST request to fetch user products
            const response = await axios.post("http://localhost:8080/users/userproducts", { email })
            // Set the fetched products to state
            setUserproducts(response.data.userproducts)
        } catch (error: any) {
            // Log if any errors occurs
            setErrormsg(error.response.data.message)
        }
    }

    // Delete User Product
    const DeleteProduct = async (id: number) => {
        try {
            const response = await axios.delete(`http://localhost:8080/products/deleteproduct/${id}`)
            FetchUserProducts()
        } catch (error:any) {
            setErrormsg(error.response.data.message)
        }
    }

    // Edit User Product
    const EditProduct = async (id:number) => {
        await router.push(`/users/products/edit/${id}`)
    }

    return (
        <div>
            {userproducts && userproducts.map((u) =>
                <div key={u.id}>
                    <a href={`/users/products/${u.id}`}>
                    <img src={u.image_url} />
                    <p>{u.category}</p>
                    <p>{u.p_name}</p>
                    <p>{u.description}</p>
                    <p>{u.price}</p>
                    <p>{u.stock}</p>
                    </a>
                    <p>Status : {u.isApproved ? "Approved" : "Pending"}</p>
                    <Trash2 onClick={() => DeleteProduct(u.id)}/>
                    <Edit2 onClick={() => EditProduct(u.id)}/>
                </div>
            )}
            {errormsg && <p>{errormsg}</p>}
        </div>
    )
}

export default page