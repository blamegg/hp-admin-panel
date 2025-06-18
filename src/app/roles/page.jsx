import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Roles from '@/components/RoleTable'
import React from 'react'

const RolesPage = React.memo(() => {
  return (
    <DefaultLayout>
    <Breadcrumb pageName="Roles" />
    <div className="flex flex-col">
      <Roles key="roles-component" />
    </div>
  </DefaultLayout>
  )
})

RolesPage.displayName = 'RolesPage'

export default RolesPage
