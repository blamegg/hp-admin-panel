import Button from '@/components/common/Button';
import ModalHeader from '@/components/common/ModalHeader'
import { AppliedLeave, fetchTakenLeaves } from '@/redux/slice/takenLeaveSclice';
import { AppDispatch } from '@/redux/store';
import { approveRejectLeaveFn } from '@/utility/queryFetcher';
import { Drawer } from '@mui/material'
import React from 'react'
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

interface EditTakenLeaveProps {
  toggleDrawer: (open: boolean) => void;
  isEditTakenLeaveDrawerShowing: boolean;
  selectedLeave: AppliedLeave | null;
}

const EditTakenLeave = ({ toggleDrawer, isEditTakenLeaveDrawerShowing, selectedLeave }: EditTakenLeaveProps) => {

  const dispatch = useDispatch<AppDispatch>();

  const handleApproveLeave = async ()=>{
    if(!selectedLeave){
      return;
    }
    try {
      await approveRejectLeaveFn(selectedLeave._id, 'Approved');
      toast.success("Leave application approved")
      dispatch(fetchTakenLeaves());
      toggleDrawer(false);
    } catch (error:any) {
      toast.error(error?.response?.data?.message)
    }
  }

  const hanldeRejectLeave = async ()=>{
    if(!selectedLeave){
      return;
    }
    try {
      await approveRejectLeaveFn(selectedLeave._id, "Rejected");
      toast.success("Leave application rejected")
      dispatch(fetchTakenLeaves());
      toggleDrawer(false);
    } catch (error:any) {
      toast.error(error?.response?.data?.message)
    }
  }

  return (
    <Drawer
      anchor='right'
      open={isEditTakenLeaveDrawerShowing}
      PaperProps={{
        sx: {
          width: "30%"
        }
      }}
    >
      <ModalHeader text='Leave Details' toggleDrawer={() => toggleDrawer(false)} />
      <div className="p-6 pt-4 pb-24">
        {selectedLeave ? (
          <div className="space-y-4 text-sm text-gray-700">
            <div className='grid grid-cols-2 items-center gap-3'>
              <div >
                <span className="font-medium text-gray-600 ">Leave Type</span>
                <p className='px-1 bg-white rounded-md shadow-sm py-1 mt-1 border border-blue-200'>{selectedLeave.leave_type?.name || 'N/A'}</p>
              </div>
              <div >
                <span className="font-medium text-gray-600 ">Mode</span>
                <p className='px-1 bg-white rounded-md shadow-sm py-1 mt-1 border border-blue-200 '>{selectedLeave.leave_mode}</p>
              </div>
            </div>
            <div className='grid grid-cols-2 items-center gap-3'>
              <div >
                <span className="font-medium text-gray-600">From</span>
                <p className='px-1 bg-white rounded-md shadow-sm py-1 mt-1 border border-blue-200'>
                  {selectedLeave.start_date}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">To</span>
                <p className='px-1 bg-white rounded-md shadow-sm py-1 mt-1 border border-blue-200'>
                  {selectedLeave.end_date}
                </p>
              </div>
            </div>
            <div className='grid grid-cols-2 items-center gap-3'>
              <div >
                <span className="font-medium text-gray-600">Status:</span>
                <p className='px-1 bg-white rounded-md shadow-sm py-1 mt-1 border border-blue-200'>{selectedLeave.status}</p>
              </div>
              {selectedLeave.half_day_session && (
                <div >
                  <span className="font-medium text-gray-600">Half Day Session:</span>
                  <p className='px-1 bg-white rounded-md shadow-sm py-1 mt-1 border border-blue-200'>{selectedLeave.half_day_session}</p>
                </div>
              )}
            </div>

            <div>
              <span className="font-medium text-gray-600">Description:</span>
              <p className="px-1 bg-white rounded-md shadow-sm py-1 mt-1 border border-blue-200">{selectedLeave.description || '-'}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No leave selected.</p>
        )}
      </div>

      <div className='flex justify-end items-center gap-2 absolute bottom-0 h-[60px] w-full pr-8 border-t-2 border-gray'>
        <Button type="button" name="Cancel" className="bg-graydark" onClick={() => toggleDrawer(false)} />

        <Button
          type="button"
          name="Reject"
          className="bg-danger text-white min-w-[100px] transition-colors duration-200"
          onClick={hanldeRejectLeave}
        />
        <Button
          type="button"
          name="Approve"
          className="bg-success text-white min-w-[100px] transition-colors duration-200"
          onClick={handleApproveLeave}
        />
      </div>
    </Drawer>
  )
}

export default EditTakenLeave