'use client'

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Products } from '../../products/new/page';
import axios from 'axios';
import { useForm } from "react-hook-form"


export interface Payment {
    invoice_no: number;
    buyer_email: string;
    product_id: number;
    image_url: string;
    p_name: string;
    amount: number;
    quantity: number;
    type: string;
    card_no: number;
    UPI_ID: number;
}

const page = () => {

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Payment>()

    const [product, setproduct] = useState<Payment | null>(null)
    const [price, setprice] = useState(0)

    const { id } = useParams()

    useEffect(() => {
        FetchProduct()
    }, [])

    const Quantity = watch("quantity");

    useEffect(() => {
        setprice(Quantity*price)
    }, [Quantity])
    


    const FetchProduct = async () => {
        const response = await axios.post(`http://localhost:8080/products/productdetails/${id}`)
        // console.log(response.data.ProductDetails[0]);
        
        setproduct(response.data.ProductDetails[0])
        setprice(response.data.ProductDetails[0].price)
    }

    const Pay = async (data:Payment) => {
        const email = localStorage.getItem("useremail")
        const response = await axios.post("http://localhost:8080/pay/newpayment",{ "buyer_email":email, "product_id":id, "amount":price, "quantity":data.quantity, "type":data.type, "card_no":data.card_no || 0, "UPI_ID":data.UPI_ID || "" })
        console.log(response.data)
    }
    const paymentMethod = watch("type");
    return (
        <div>
            <form onSubmit={handleSubmit(Pay)}>

            {product &&
                <div>
                    <img className=' h-50 w-50' src={product.image_url} />
                    <p>{product.p_name}</p>

                    <label>Quantity</label>
                    <input defaultValue={1} type='number' {...register("quantity", { required: true })} placeholder="Quantity" />
                    {errors.quantity && <span>This field is required</span>}

                    <label>Payment Type</label>
                    <select {...register("type", { required: true })}>
                        <option value="">Select Payment Type</option>
                        <option value="Cash On Delivery">Cash On Delivery</option>
                        <option value="Card">Card</option>
                        <option value="UPI">UPI</option>
                    </select>
                    {errors.type && <span>This field is required</span>}

                    {paymentMethod === "Card" &&
                        <div>
                            <input type='number' {...register("card_no", { required: true })} placeholder=" **** **** 9898" />
                            {errors.quantity && <span>This field is required</span>}
                        </div>}

                    {paymentMethod === "UPI" &&
                        <div>
                            <input {...register("UPI_ID", { required: true })} placeholder=" **** **** 9898" />
                            {errors.quantity && <span>This field is required</span>}
                        </div>}

                        {price && <p>{price}</p>}

                <button type='submit'>Place Order</button>
                </div>
            }
            </form>
        </div>
    )
}

export default page