import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import RoleResponsibility from '@/components/RoleTable'
import UserTable from '@/components/Tables/UserTable'
import React from 'react'

const RoleAndResponsibility = () => {
  return (
    <DefaultLayout>
    <Breadcrumb pageName="Tables" />

    <div className="flex flex-col gap-10">
      <RoleResponsibility />
    </div>
  </DefaultLayout>
  )
}

export default RoleAndResponsibility
