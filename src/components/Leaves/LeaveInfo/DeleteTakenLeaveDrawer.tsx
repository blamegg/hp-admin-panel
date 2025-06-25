import ModalHeader from '@/components/common/ModalHeader'
import { AppliedLeave } from '@/redux/slice/takenLeaveSclice';
import { Drawer } from '@mui/material'
import React from 'react'
import Button from '../../common/Button';

interface DeleteTakenLeaveProps {
  toggleDrawer: (open: boolean) => void;
  isDeleteTakenLeaveDrawerShowing: boolean;
  selectedLeave: AppliedLeave | null;
}

const DeleteTakenLeaveDrawer = ({toggleDrawer, isDeleteTakenLeaveDrawerShowing, selectedLeave}: DeleteTakenLeaveProps) => {
  // Add your delete logic here (call deleteLeaveFn, show feedback, etc.)

  return (
    <Drawer anchor='right' open={isDeleteTakenLeaveDrawerShowing} PaperProps={{ sx: {width:"30%"}}}>
      <ModalHeader text='Delete Leave Application' toggleDrawer={()=> toggleDrawer(false)} />
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Are you sure you want to delete this leave?</h2>
        <p className="mb-6">{selectedLeave?.leave_type?.name} ({selectedLeave?.start_date} - {selectedLeave?.end_date})</p>
        <div className="flex gap-4">
          <Button type="button" name="Cancel" className="bg-graydark" onClick={() => toggleDrawer(false)} />
          <Button type="button" name="Delete" className="bg-danger" onClick={() => {
            // Call your delete function here
          }} />
        </div>
      </div>
    </Drawer>
  )
}

export default DeleteTakenLeaveDrawer