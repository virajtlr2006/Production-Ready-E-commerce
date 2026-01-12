'use client'

import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Products } from '../new/page'

const page = () => {

    const {id} = useParams()

    const [singleproduct, setSingleproduct] = useState<Products | null>(null)
    
    useEffect(() => {
        fetchProductDetails()
    }, [])  

    const fetchProductDetails = async() => {
            const response = await axios.post(`http://localhost:8080/products/productdetails/${id}`)
            console.log(response.data.ProductDetails)
            setSingleproduct(response.data.ProductDetails[0])
    }


  return (
    <div>
        {singleproduct && 
        <div>
            <img src={singleproduct.image_url}/>
            <p>{singleproduct.email}</p>
            <p>{singleproduct.category}</p>
            <p>{singleproduct.p_name}</p>
            <p>{singleproduct.description}</p>
            <p>{singleproduct.price}</p>
        </div>
        }
    </div>
  )
}

export default page