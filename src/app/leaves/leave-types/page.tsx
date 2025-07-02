import LeaveTypes from '@/components/Leaves/leaveTypes'
import React from 'react'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'

const page = () => {
  return (
    <DefaultLayout>
        <Breadcrumb pageName="Leave Types" />
        <LeaveTypes />
    </DefaultLayout>
  )
}

export default page