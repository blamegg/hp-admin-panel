import React, { useEffect, useState } from 'react';
import { Drawer } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leaveFormSchema, LeaveFormInputs } from '@/schema/leaveSchema';
import Button from '../../common/Button';
import Textarea from '../../common/Input/Textarea';
import Select from '../../common/Select';
import Input from '../../common/Input';
import ModalHeader from '@/components/common/ModalHeader';
import { AppliedLeave, fetchTakenLeaves } from '@/redux/slice/takenLeaveSclice';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { FaTrash } from 'react-icons/fa6';
import { updateAppliedLeaveFn } from '@/utility/queryFetcher';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { fetchLeaveType } from '@/redux/slice/leaveTypesSlice';
import { fetchLeaveTypesList, LeaveTypesListData } from '@/redux/slice/leaveTypesListSlice';

// Placeholder for update API
const updateLeaveFn = async (id: string, payload: any) => {
  // TODO: Replace with real API call
  return new Promise((resolve) => setTimeout(() => resolve({ message: 'Leave updated successfully' }), 1000));
};

const LEAVE_MODES = [
  { value: '', label: 'Select leave mode' },
  { value: 'Half-Day', label: 'Half-Day' },
  { value: 'Full-Day', label: 'Full-Day' },
  { value: 'Day-Range', label: 'Day-Range' },
  { value: 'Multi-Days', label: 'Multi-Days' },
];

const HALF_DAY_SESSIONS = [
  { value: 'Morning', label: 'Morning' },
  { value: 'Afternoon', label: 'Afternoon' },
];

interface UpdateTakenLeaveDrawerProps {
  selectedLeave: AppliedLeave | null;
  isUpdateDrawerShowing: boolean;
  toggleDrawer: (open: boolean) => void;
}

const UpdateTakenLeaveDrawer: React.FC<UpdateTakenLeaveDrawerProps> = ({ selectedLeave, isUpdateDrawerShowing, toggleDrawer }) => {
  const [loading, setLoading] = useState(false);
  const [singleDateInput, setSingleDateInput] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LeaveFormInputs>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      leave_type: '',
      leave_mode: '',
      start_date: '',
      end_date: '',
      description: '',
      dates: [],
      half_day_session: '',
    },
  });
  const leave_mode = watch('leave_mode');
  const dates = watch('dates');
  const leaveTypes = useSelector((state: RootState) => state.leaveTypesList.LeaveTypesList);
  const leaveTypeOptions = leaveTypes?.map((type: LeaveTypesListData) => ({ value: type._id, label: type.name }));

  const dispatch = useDispatch<AppDispatch>();

  // Fetch leave types when the drawer is opened

  useEffect(() => {
    if (isUpdateDrawerShowing) {
      dispatch(fetchLeaveTypesList());
    }
  }, [isUpdateDrawerShowing, dispatch]);

  
  // Prefill form when selectedLeave changes
  useEffect(() => {
    if (selectedLeave) {
      reset({
        leave_type: typeof selectedLeave.leave_type === 'object'
          ? selectedLeave.leave_type._id
          : selectedLeave.leave_type || '',
        leave_mode: selectedLeave.leave_mode as '' | 'Half-Day' | 'Full-Day' | 'Day-Range' | 'Multi-Days' || '',
        start_date: selectedLeave.start_date || '',
        end_date: selectedLeave.end_date || '',
        description: selectedLeave.description || '',
        dates: Array.isArray((selectedLeave as any).dates) ? (selectedLeave as any).dates : [],
        half_day_session: selectedLeave.half_day_session || '',
      });
    }
  }, [selectedLeave, reset]);

  // Add date logic (same as LeaveForm)
  const handleAddSingleDate = (selectedDate: string) => {
    if (!selectedDate) return;
    const currentDates = watch('dates') || [];
    if (currentDates.includes(selectedDate)) return;
    setValue('dates', [...currentDates, selectedDate]);
  };
  const handleRemoveSelectedDate = (dateToRemove: string) => {
    const currentDates = watch('dates') || [];
    setValue('dates', currentDates.filter(date => date !== dateToRemove));
  };

  // Reset singleDateInput when drawer closes
  useEffect(() => {
    if (!isUpdateDrawerShowing) setSingleDateInput('');
  }, [isUpdateDrawerShowing]);

  // Clear form on close
  const handleClose = () => {
    reset();
    setSingleDateInput('');
    toggleDrawer(false);
  };

  const onSubmit = async (data: LeaveFormInputs) => {
    setLoading(true);
    try {
      // Prepare payload (similar to LeaveForm)
      const payload: any = { ...data };
      if (data.leave_mode === 'Multi-Days') {
        delete payload.start_date;
        delete payload.end_date;
        payload.dates = payload.dates.filter((date: string) => date && date.trim() !== '');
      } else {
        delete payload.dates;
      }
      if (selectedLeave) {
        console.log(payload)
        const response = await updateAppliedLeaveFn(selectedLeave._id, payload);
        toast.success(response.message || "Leave Application Updated Successfully")
        dispatch(fetchTakenLeaves());
        reset();
        toggleDrawer(false);
      }
      handleClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isUpdateDrawerShowing}
      onClose={handleClose}
      PaperProps={{ sx: { width: { md: '30%' } } }}
    >
      <ModalHeader text="Update Leave" toggleDrawer={handleClose} />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-2">
        <div className="flex flex-wrap gap-4 px-4">
            <div className='w-full'>
              <span className="font-medium text-gray-600 text-xm ">User name</span>
              <p className='px-2 bg-white rounded-md shadow-sm py-1 text-xs mt-1 border border-blue-200'>{selectedLeave?.user_details?.name || 'N/A'}</p>
            </div>
          <div className="md:flex items-center justify-between gap-10 w-full ">
            <div className="w-full">
              <Select
                label="Leave Mode"
                options={LEAVE_MODES}
                register={register('leave_mode')}
                error={errors.leave_mode?.message}
              />
            </div>
            <div className="w-full mt-2 md:mt-0">
              <Select
                label="Leave Type"
                options={leaveTypeOptions}
                register={register('leave_type')}
                error={errors.leave_type?.message}
              />
            </div>
          </div>
          {/* Multi-Days logic */}
          {leave_mode === 'Multi-Days' ? (
            <div className="w-full">
              <label className="block font-medium text-gray-700 mb-1">Select Dates *</label>
              <div className="grid grid-cols-2 gap-10 mb-3">
                <div>
                  <Input
                    label=""
                    type="date"
                    value={singleDateInput}
                    onChange={e => setSingleDateInput(e.target.value)}
                    placeholder="Select a date"
                  />
                </div>
                <Button
                  type="button"
                  name="Add date"
                  onClick={() => {
                    if (singleDateInput) {
                      handleAddSingleDate(singleDateInput);
                      setSingleDateInput('');
                    }
                  }}
                  disabled={!singleDateInput}
                />
              </div>
              {dates && dates.length > 0 && (
                <div className="">
                  <div className="flex items-start justify-start gap-4 mb-2">
                    <label className="block font-medium text-gray-600 text-sm">Selected Dates: ( {dates.length} )</label>
                    {dates.length > 1 && (
                      <Button
                        name="Clear All"
                        type="button"
                        onClick={() => setValue('dates', [])}
                        className="bg-danger text-white text-xs"
                      />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-[120px]  overflow-scroll">
                    {dates.map((date: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1 bg-green-100 border border-green-300 rounded px-2 py-1 text-sm"
                      >
                        <span className="text-green-800">{date}</span>
                        <Button
                          name=""
                          type="button"
                          onClick={() => handleRemoveSelectedDate(date)}
                          className="text-red-500 bg-transparent px-0 hover:text-red-700 text-xs"
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {errors.dates?.message && (
                <p className="text-red-500 text-xs mt-1">{errors.dates.message as string}</p>
              )}
            </div>
          ) : (
            <div className={`md:flex items-center justify-between gap-10 ${leave_mode === 'Full-Day' ? 'md:w-1/2 md:pr-4.5 w-full' : 'w-full'}`}>
              <div className="w-full">
                <Input
                  label="Start Date *"
                  type="date"
                  register={register('start_date')}
                  error={errors.start_date?.message}
                  placeholder="Select start date"
                  aria-invalid={!!errors.start_date}
                />
              </div>
              {leave_mode === 'Day-Range' && (
                <div className="w-full transition-all duration-200 mt-2 md:mt-0">
                  <Input
                    label="End Date *"
                    type="date"
                    register={register('end_date')}
                    error={errors.end_date?.message}
                    placeholder="Select end date"
                    aria-invalid={!!errors.end_date}
                  />
                </div>
              )}
              {leave_mode === 'Half-Day' && (
                <div className="w-full transition-all duration-200 mt-2 md:mt-0">
                  <Select
                    label="Session *"
                    options={HALF_DAY_SESSIONS}
                    register={register('half_day_session')}
                    error={errors.half_day_session?.message}
                  />
                </div>
              )}
            </div>
          )}
          <div className="w-full">
            <Textarea
              label="Description"
              value={watch('description')}
              onChange={e => setValue('description', e.target.value)}
              error={errors.description?.message}
              placeholder="Describe your leave reason (optional)"
              rows={3}
              aria-invalid={!!errors.description}
            />
          </div>
        </div>
        <div className='z-100 bg-white flex justify-end items-center gap-2 absolute bottom-0 h-[60px] w-full pr-8 border-t-2 border-gray'>
          <Button type="button" name="Cancel" className="bg-graydark" onClick={handleClose} />
          <Button
            name={loading ? 'Updating...' : 'Update'}
            type="submit"
            className="bg-success font-medium min-w-[120px]"
            disabled={loading}
            loading={loading}
          />
        </div>
      </form>
    </Drawer>
  );
};

export default UpdateTakenLeaveDrawer; 