'use client'

import axios from 'axios'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
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
    <div className='min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8'>
        {singleproduct && 
        <div className='max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10'>
                {/* Product Image */}
                <div className='flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden'>
                    <img 
                        src={singleproduct.image_url}
                        alt={singleproduct.p_name}
                        className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
                    />
                </div>

                {/* Product Details */}
                <div className='flex flex-col justify-between'>
                    {/* Category Badge */}
                    <div className='mb-4'>
                        <span className='inline-block bg-orange-100 text-orange-800 text-sm font-semibold px-3 py-1 rounded-full'>
                            {singleproduct.category}
                        </span>
                    </div>

                    {/* Product Name */}
                    <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
                        {singleproduct.p_name}
                    </h1>

                    {/* Price */}
                    <div className='mb-6'>
                        <p className='text-4xl font-bold text-orange-500'>
                            ${singleproduct.price}
                        </p>
                    </div>

                    {/* Description */}
                    <div className='mb-6'>
                        <h2 className='text-lg font-semibold text-gray-800 mb-2'>Description</h2>
                        <p className='text-gray-600 leading-relaxed'>
                            {singleproduct.description}
                        </p>
                    </div>

                    {/* Seller Info */}
                    <div className='mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200'>
                        <p className='text-sm text-gray-500'>Seller Email</p>
                        <p className='text-gray-800 font-medium'>{singleproduct.email}</p>
                    </div>

                    {/* Buy Button */}
                    <a href={`/users/pay/${singleproduct.id}`} className='w-full'>
                        <button className='w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg'>
                            Buy Now
                        </button>
                    </a>
                </div>
            </div>
        </div>
        }
    </div>
  )
}

export default page