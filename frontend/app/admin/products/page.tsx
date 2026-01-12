'use client'

import { Products } from '@/app/users/products/new/page'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Check, X } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const page = () => {

    // State to hold all products
    const [allProducts, setAllProducts] = useState<Products[] | null>(null)

    useEffect(() => {
        FetchAllProducts()
    }, [])


    const FetchAllProducts = async () => {

        try {
            // Fetch all products from the backend
            const response = await axios.get("http://localhost:8080/products/allproducts")
            // console.log(response.data.Allproducts)
            setAllProducts(response.data.Allproducts)

        } catch (error) {
            console.log(error)
        }
    }

    // Function to approve a product
        const ApproveProduct = async (id:number) => {
            // POST request to approve product by id
            await axios.post(`http://localhost:8080/products/approveproduct/${id}`)
            // Refresh the product list after approval
            FetchAllProducts()
        }

    // Function to reject a product
        const RejectProduct = async (id:number) => {
            // POST request to reject product by id
            await axios.post(`http://localhost:8080/products/rejectproduct/${id}`)
            // Refresh the product list after rejection
            FetchAllProducts()
        }

    return (
        <div>
            All Products in admin page
            <Table>
                <TableCaption>A list of all recent users.</TableCaption>
                <TableHeader>
                    <TableRow className='justify-around'>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead >Product</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Approve</TableHead>
                        <TableHead>Reject</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allProducts && allProducts.map((p) =>
                        <TableRow key={p.id}>
                            <TableCell className="font-medium">{p.id}</TableCell>
                            <TableCell>{p.email}</TableCell>
                            <TableCell>{p.category}</TableCell>
                            <TableCell>{p.p_name}</TableCell>
                            <TableCell>{p.price}</TableCell>
                            <TableCell>
                                <Dialog>
                                    <DialogTrigger>Show Image</DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>{p.p_name}</DialogTitle>
                                            <DialogDescription>
                                                <img src={p.image_url}/>
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                            <TableCell>{p.stock}</TableCell>
                            <TableCell><Check onClick={() => ApproveProduct(p.id)}/></TableCell>
                            <TableCell><X onClick={() => RejectProduct(p.id)}/></TableCell>
                            <TableCell>{p.isApproved ? "Approved" : "Pending"}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default page