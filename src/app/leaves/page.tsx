import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import LeaveInfo from '@/components/Leaves/LeaveInfo'
import React from 'react'

const page = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Leaves" />
      <LeaveInfo />
    </DefaultLayout>
  )
}

export default page