import Button from '@/components/common/Button';
import ModalHeader from '@/components/common/ModalHeader'
import { AppliedLeave, fetchTakenLeaves } from '@/redux/slice/leaves/leaveSclice';
import { AppDispatch } from '@/redux/store';
import { approveRejectLeaveFn } from '@/utility/queryFetcher';
import { Drawer } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface EditTakenLeaveProps {
  toggleDrawer: (open: boolean) => void;
  isEditTakenLeaveDrawerShowing: boolean;
  selectedLeave: AppliedLeave | null;
}

const EditTakenLeave = ({ toggleDrawer, isEditTakenLeaveDrawerShowing, selectedLeave }: EditTakenLeaveProps) => {

  const dispatch = useDispatch<AppDispatch>();
  
  const queryClient = useQueryClient();

  // State for status and reason
  const [status, setStatus] = useState('');
  const [reason, setReason] = useState('');

  // Update state when selectedLeave changes
  useEffect(() => {
    if (selectedLeave) {
      setStatus(selectedLeave.status || 'Pending');
      setReason('');
    }
  }, [selectedLeave]);

  const mutation = useMutation({
    mutationFn: ({ id, status, reason }: { id: string, status: string, reason: string }) =>
      approveRejectLeaveFn(id, { status, reason }),
    onSuccess: () => {
      toast.success(`Leave application ${status.toLowerCase()}`);
      dispatch(fetchTakenLeaves());
      toggleDrawer(false);
      queryClient.invalidateQueries(['takenLeaves']);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  });

  const handleSubmit = () => {
    if (!selectedLeave || !status) {
      toast.error("Please select a status.");
      return;
    }
    mutation.mutate({ id: selectedLeave._id, status, reason });
  };

  return (
    <Drawer
      anchor='right'
      open={isEditTakenLeaveDrawerShowing}
      PaperProps={{
        sx: {
          width: { md: "30%" }
        }
      }}
    >
      <ModalHeader text='Leave Confirmation' toggleDrawer={() => toggleDrawer(false)} />
      <div className="p-6 pt-4 ">
        {selectedLeave ? (
          <div className="space-y-4 text-sm">
            <div>
              <span className="font-medium text-gray-600 ">User name</span>
              <p className='px-2 bg-white rounded-md shadow-sm py-1 mt-1 border border-blue-200'>{selectedLeave.user_details?.name || 'N/A'}</p>
            </div>
            <div className='grid grid-cols-2 items-center gap-3'>
              <div>
                <span className="font-medium text-gray-600 ">Leave type</span>
                <p className='px-2 bg-white rounded-md shadow-sm py-1 mt-1 border border-blue-200'>{selectedLeave.leave_type?.name || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600 ">Mode</span>
                <p className='px-2 bg-white rounded-md shadow-sm py-1 mt-1 border border-blue-200 '>{selectedLeave.leave_mode}</p>
              </div>
            </div>
            <div className='grid grid-cols-2 items-center gap-3'>
              <div>
                <span className="font-medium text-gray-600">From</span>
                <p className='px-2 bg-white rounded-md shadow-sm py-1 mt-1 border border-blue-200'>
                  {new Date(selectedLeave.start_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">To</span>
                <p className='px-2 bg-white rounded-md shadow-sm py-1 mt-1 border border-blue-200'>
                  {new Date(selectedLeave.end_date || '').toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <span className="font-medium text-gray-600">Description:</span>
              <p className="px-2 bg-white rounded-md shadow-sm py-1 mt-1 border border-blue-200">{selectedLeave.description || '-'}</p>
            </div>
            <div>
              <label htmlFor="status" className="font-medium text-gray-600">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-2 rounded-md shadow-sm py-1.5 mt-1  bg-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label htmlFor="reason" className="font-medium text-gray-600">Reason</label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="w-full px-2 rounded-md shadow-sm py-1 mt-1 bg-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter reason..."
              />
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
          name={mutation.isLoading ? "Submitting..." : "Submit"}
          className="bg-success text-white min-w-[100px] transition-colors duration-200"
          onClick={handleSubmit}
          disabled={mutation.isLoading}
        />
      </div>
    </Drawer>
  )
}

export default EditTakenLeave