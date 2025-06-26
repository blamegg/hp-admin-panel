import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import HolidayType from '@/components/Holiday/HolidayTyep'
import HolidayInfo from '@/components/Holiday/HolidayTyep'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'

const page = () => {
  return (
    <DefaultLayout>
        <Breadcrumb pageName='Holiday type' />
        <HolidayType />
    </DefaultLayout>
  )
}

export default page