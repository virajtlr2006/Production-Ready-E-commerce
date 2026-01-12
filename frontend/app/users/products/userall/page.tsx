'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Products } from '../new/page'
import { useRouter } from 'next/navigation'

const page = () => {

    // State to hold user products
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
            if(!email){
                router.push("/users/login")
                // Break the function execution
                return false
            }
            // Make POST request to fetch user products
            const response = await axios.post("http://localhost:8080/users/userproducts", { email })
            // Set the fetched products to state
            setUserproducts(response.data.userproducts)
        } catch (error : any) {
            // Log if any errors occurs
            setErrormsg(error.response.data.message)
        }

    }
    return (
        <div>
            {userproducts && userproducts.map((u) =>
                <div key={u.id}>
                    <img src={u.image_url} />
                    <p>{u.category}</p>
                    <p>{u.p_name}</p>
                    <p>{u.description}</p>
                    <p>{u.price}</p>
                    <p>{u.stock}</p>
                    <p>Status : {u.isApproved ? "Approved" : "Pending"}</p>
                </div>
            )}
            {errormsg && <p>{errormsg}</p>}
        </div>
    )
}

export default page