"use client"
import React, { useState } from 'react'
import Button from '../common/Button'
import CreateLeave from './CreateLeave'
import DeleteDrawer from '../Tables/DeleteDrawer'
import DeleteLeave from './DeleteLeave'

const Leaves = () => {

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);


  const toggleDrawer = () =>{
    setIsDrawerOpen(true)
  }
  const toggleDeleteLeaveDrawer = () =>{
    setIsDeleteDrawerOpen(true)
  }


  return (
    <div>
      <Button name='Create Leave' type="button" onClick={toggleDrawer} />
      <Button name='Delete Leave' type="button" onClick={toggleDeleteLeaveDrawer} />

      <CreateLeave open={isDrawerOpen} toggleDrawer={setIsDrawerOpen} />
      <DeleteLeave open={isDeleteDrawerOpen} toggleDeleteLeaveDrawer={setIsDeleteDrawerOpen} />
    </div>
  )
}

export default Leaves