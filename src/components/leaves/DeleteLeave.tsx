

import { Drawer } from '@mui/material'
import React from 'react'
import ModalHeader from '../common/ModalHeader'
interface DeleteLeaveInterface{
    open:boolean;
    toggleDeleteLeaveDrawer: (open:boolean) => void;
}

const DeleteLeave = ({open, toggleDeleteLeaveDrawer}: DeleteLeaveInterface)  => {

      const handleClose = () => {
        toggleDeleteLeaveDrawer(false);
    }
  return (
    <Drawer open={open} onClose={handleClose}>
        <ModalHeader text="Delete Leave" toggleDeleteLeaveDrawer={toggleDeleteLeaveDrawer}  />
    </Drawer>
  )
}

export default DeleteLeave