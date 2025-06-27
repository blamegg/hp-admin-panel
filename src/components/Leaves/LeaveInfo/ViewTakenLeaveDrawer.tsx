import Button from '@/components/common/Button';
import ModalHeader from '@/components/common/ModalHeader';
import { AppliedLeave } from '@/redux/slice/takenLeaveSclice';
import { Drawer } from '@mui/material';
import React from 'react';
import DetailItem from '@/components/common/DetailItem';

interface ViewTakenLeaveProps {
    toggleDrawer: (open: boolean) => void;
    isViewTakenLeaveDrawerShowing: boolean;
    selectedLeave: AppliedLeave | null;
    onUpdate?: (leave: AppliedLeave) => void;
}

const ViewTakenLeaveDrawer = ({ selectedLeave, isViewTakenLeaveDrawerShowing, toggleDrawer, onUpdate }: ViewTakenLeaveProps) => {

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
            <div className="p-6 pt-4">
                {selectedLeave ? (
                    <div className="space-y-4 text-sm">
                        <DetailItem label="User name" value={selectedLeave.user_details?.name} />
                        <div className='grid grid-cols-2 items-center gap-3'>
                            <DetailItem label="Leave type" value={
                              typeof selectedLeave.leave_type === 'object'
                                ? selectedLeave.leave_type.name
                                : selectedLeave.leave_type
                            } />
                            <DetailItem label="Mode" value={selectedLeave.leave_mode} />
                        </div>
                        {/* Date logic for different leave modes */}
                        {selectedLeave.leave_mode === 'Day-Range' && (
                          <div className='grid grid-cols-2 items-center gap-3'>
                            <DetailItem label="From" value={selectedLeave.start_date} />
                            <DetailItem label="To" value={selectedLeave.end_date} />
                          </div>
                        )}
                        {selectedLeave.leave_mode === 'Full-Day' && (
                          <DetailItem label="Date" value={selectedLeave.start_date} />
                        )}
                        {selectedLeave.leave_mode === 'Half-Day' && (
                          <>
                            <DetailItem label="Date" value={selectedLeave.start_date} />
                            <DetailItem label="Session" value={selectedLeave.half_day_session} />
                          </>
                        )}
                        {selectedLeave.leave_mode === 'Multi-Days' && Array.isArray((selectedLeave as any).dates) && (selectedLeave as any).dates.length > 0 && (
                          <div>
                            <label className="block font-medium text-gray-600 text-sm mb-1">Selected Dates: {((selectedLeave as any).dates.length)}</label>
                            <div className="flex flex-wrap gap-2 max-h-[120px] overflow-scroll">
                              {(selectedLeave as any).dates.map((date: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="flex items-center gap-1 bg-green-100 border border-green-300 rounded px-2 py-1 text-sm text-green-800"
                                >
                                  {date}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <DetailItem label="Description" value={selectedLeave.description || '-'} />
                        <DetailItem
                            label="Status:"
                            value={selectedLeave.status}
                            valueClassName={`text-white ${selectedLeave.status?.toLowerCase() === "approved"
                                    ? "bg-success"
                                    : selectedLeave.status?.toLowerCase() === "rejected"
                                        ? "bg-danger"
                                        : "bg-warning text-gray-800"
                                }`}
                        />
                        {selectedLeave.reason &&
                            ["approved", "rejected"].includes((selectedLeave.status || '').toLowerCase()) && (
                                <DetailItem
                                    label="Reason:"
                                    value={selectedLeave.reason}
                                    valueClassName={`text-white border-0 ${selectedLeave.status?.toLowerCase() === "approved"
                                            ? "bg-success"
                                            : "bg-danger"
                                        }`}
                                />
                            )}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">No leave selected.</p>
                )}
            </div>
            <div className='flex justify-end items-center gap-2 absolute bottom-0 h-[60px] w-full pr-8 border-t-2 border-gray'>
                <Button type="button" name="Cancel" className="bg-graydark" onClick={() => toggleDrawer(false)} />
                {selectedLeave && onUpdate && (
                    <Button
                        type="button"
                        name="Update"
                        className="bg-primary text-white"
                        onClick={() => onUpdate(selectedLeave)}
                    />
                )}
            </div>
        </Drawer>
    );
};

export default ViewTakenLeaveDrawer;