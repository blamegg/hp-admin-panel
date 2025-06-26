import Button from '@/components/common/Button';
import ModalHeader from '@/components/common/ModalHeader';
import { AppliedLeave } from '@/redux/slice/takenLeaveSclice';
import { Drawer } from '@mui/material';
import React from 'react';

interface ViewTakenLeaveProps {
    toggleDrawer: (open: boolean) => void;
    isViewTakenLeaveDrawerShowing: boolean;
    selectedLeave: AppliedLeave | null;
}

const ViewTakenLeaveDrawer = ({ selectedLeave, isViewTakenLeaveDrawerShowing, toggleDrawer }: ViewTakenLeaveProps) => {
    return (
        <Drawer
            anchor='right'
            open={isViewTakenLeaveDrawerShowing}
            onClose={() => toggleDrawer(false)}
            PaperProps={{
                sx: {
                    width: { md: "30%" }
                }
            }}
        >
            <ModalHeader text='View Leave Details' toggleDrawer={() => toggleDrawer(false)} />
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
                            <span className="font-medium text-gray-600">Status:</span>
                            <p
                                className={`
                                                px-2 rounded-md shadow-sm py-1 mt-1 text-white 
                                                    ${selectedLeave.status?.toLowerCase() === "approved"
                                        ? "bg-success"
                                        : selectedLeave.status?.toLowerCase() === "rejected"
                                            ? "bg-danger"
                                            : "bg-blue-100 text-gray-800 border border-blue-200"
                                    }
    `}
                            >
                                {selectedLeave.status || '-'}
                            </p>
                        </div>

                        {selectedLeave.reason &&
                            ["approved", "rejected"].includes((selectedLeave.status || '').toLowerCase()) && (
                                <div>
                                    <span className={`font-medium ${selectedLeave.status?.toLowerCase() === "approved" ? "text-success" : " text-danger"}`}>Reason:</span>
                                    <p
                                        className={`px-2 rounded-md shadow-sm py-1 mt-1 text-white ${selectedLeave.status?.toLowerCase() === "approved" ? "bg-success" : "bg-danger"
                                            }`}
                                    >
                                        {selectedLeave.reason}
                                    </p>
                                </div>
                            )}

                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">No leave selected.</p>
                )}
            </div>
              <div className='flex justify-end items-center gap-2 absolute bottom-0 h-[60px] w-full pr-8 border-t-2 border-gray'>
                    <Button type="button" name="Cancel" className="bg-graydark" onClick={() => toggleDrawer(false)} />
            </div>
        </Drawer>
    );
};

export default ViewTakenLeaveDrawer;