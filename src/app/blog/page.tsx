import Blog from '@/components/Blog'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'

const page = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName='Blog' />
      <Blog />
    </DefaultLayout>
  )
}

export default page