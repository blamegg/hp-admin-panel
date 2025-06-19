import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Leaves from '@/components/leaves'
import React from 'react'

const page = () => {
  return (
    <DefaultLayout>
        <Breadcrumb pageName="Leaves" />
        <Leaves />
    </DefaultLayout>
  )
}

export default page