import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import HolidayTypes from '@/components/Holidays/holidayTypes'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'

const page = () => {
  return (
    <DefaultLayout>
        <Breadcrumb pageName='Holiday type' />
        <HolidayTypes />
    </DefaultLayout>
  )
}

export default page