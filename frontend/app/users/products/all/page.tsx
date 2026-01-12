'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Products } from '../new/page'
import { useParams } from 'next/navigation'

const page = () => {

  const [allProducts, setAllProducts] = useState<Products[] | null>(null)  

  useEffect(() => {
    ApprovedProducts()
  }, [])
  

  const ApprovedProducts = async () => {

        // Fetch all products from the backend
        const response = await axios.post("http://localhost:8080/products/approvedproducts")
        // console.log(response.data.Approvedproducts)
        setAllProducts(response.data.Approvedproducts)

  }

  return (
    <div>
      <h1 >All Approved Products</h1>
      <div>
        {allProducts && allProducts.map((product) => (
          <div className='border-4 mt-5' key={product.id}>
            <a href={`/users/products/${product.id}`}>
            <img src={product.image_url} alt={product.p_name}/>
            <h2>{product.p_name}</h2>
            <p >Price: ${product.price}</p>
            </a>
          </div>
        ))}
      </div>    
    </div>
  )
}

export default page