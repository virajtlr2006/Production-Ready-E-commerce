'use client'

import API_BASE_URL, { API_ENDPOINTS } from '@/lib/api'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export interface Notifs {
    id:number;
    user_id: string;
    title: string;
    message: string;
}

const page = () => {

    const [notification, setnotification] = useState<Notifs[] | null>(null)

    useEffect(() => {
        FetchNotifications()
    }, [])


    const FetchNotifications = async () => {
        const email = localStorage.getItem("useremail")
        console.log(email)
        const response = await axios.post(API_ENDPOINTS.Get_notification, { email })
        setnotification(response.data.AllNotifs)
    }

    return (
        <div>
            {notification && notification.map((n) =>
                <div key={n.id}>
                    <p>{n.title}</p>
                    <p>{n.message}</p>
                </div>

            )}
        </div>
    )
}

export default page