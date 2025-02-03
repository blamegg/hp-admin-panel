import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import ProjectTable from '@/components/ProjectTable'
import React from 'react'

const Projects = () => {
  return (
    <DefaultLayout>
    <Breadcrumb pageName="Tables" />

    <div className="flex flex-col gap-10">
      <ProjectTable />
    </div>
  </DefaultLayout>
  )
}

export default Projects
