import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Roles from '@/components/RoleTable'
import React from 'react'

const RolesPage = () => {
  return (
    <DefaultLayout>
    <Breadcrumb pageName="Roles" />
    <div className="flex flex-col">
              
      <Roles />
    </div>
  </DefaultLayout>
  )
}

export default RolesPage
