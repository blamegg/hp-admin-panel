'use client'
import React from 'react'
import Image from 'next/image'
import blog1 from '../../../assets/blog/blog1.webp'
import blog2 from '../../../assets/blog/blog2.webp'
import blog3 from '../../../assets/blog/blog3.webp'
import Button from '@/components/common/Button'
import { useRouter } from 'next/navigation'

const RecentBlogs = () => {
    const router = useRouter();

    const recentBlogData = [
        {
            _id:1,
            title:"Lead Generation Ideas for Your Website that actually work!",
            image:blog1,
            pulishedData: "September 11, 2021",
        },
        {
            _id:2,
            title:"Why App Developers Love AWS - Amazon Web Services",
            image:blog2,
            pulishedData: "September 11, 2021",
        },
      
        {
            _id:3,
            title:"What is the Importance of a Website for Your Business?",
            image:blog3,
            pulishedData: "September 11, 2021",
        },
        {
            _id:4,
            title:"What is the Importance of a Website for Your Business?",
            image:blog3,
            pulishedData: "September 11, 2021",
        },
    ]
  return (
    <div className='flex flex-col gap-3'>
        {recentBlogData.map(items=>(
            <div key={items._id} className='flex  items-start justify-start  gap-2 border-b pb-2 hover:pl-2 transition-all cursor-pointer'>
                <div className='w-[300px]  h-[80px] relative'>
                    <Image src={items.image} alt={items.title} fill className='rounded-lg' />
                </div>
                <div>
                    <p className='text-xs text-graydark/60 font-bold'>{items.pulishedData}</p>
                    <h2 className='text-black text-sm font-[500] line-clamp-3'>{items.title}</h2>
                </div>
            </div>
        ))}
        <div>
            <Button type='button' name='Comments' onClick={()=> router.push(`/blog/comments`)} />
           
        </div>
    </div>
  )
}

export default RecentBlogs