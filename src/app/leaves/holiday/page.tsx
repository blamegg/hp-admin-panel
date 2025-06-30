import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import HolidayInfo from '@/components/Holidays/HolidayInfo'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'

const page = () => {
  return (
    <DefaultLayout>
        <Breadcrumb pageName='Holiday' />
        <HolidayInfo />
    </DefaultLayout>
  )
}

export default page