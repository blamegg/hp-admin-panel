import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import HolidayInfo from '@/components/Holidays/HolidaysInfo'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'

const page = () => {
  return (
    <DefaultLayout>
        <Breadcrumb pageName='Holiday' />
        <HolidayInfo
         />
    </DefaultLayout>
  )
}

export default page