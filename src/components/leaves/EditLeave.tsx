import { Drawer } from '@mui/material'
import React from 'react'
import ModalHeader from '../common/ModalHeader'
import Button from '../common/Button';
import { Form, useForm } from 'react-hook-form';
import Input from '../common/Input';
import { useState, useEffect } from 'react';
import { updateLeaveFn } from '@/utility/queryFetcher';
import { toast } from 'sonner';
import CheckboxFour from '../Checkboxes/CheckboxFour';
import Textarea from '../common/Input/Textarea';
import { Controller } from 'react-hook-form';

interface EditLeaveInterface {
  open: boolean;
  toggleDrawer: (open: boolean) => void;
  direction: string;
  selected: any;
  setSelected: React.Dispatch<any>;
  fetchLeavesType: () => void;
}

const EditLeave = ({ open, toggleDrawer, direction, selected, setSelected, fetchLeavesType }: EditLeaveInterface) => {
  const { register, handleSubmit, reset, formState: { errors }, control } = useForm({ defaultValues: selected });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (selected) {
      reset(selected);
    }
  }, [selected, reset]);

  const onSubmit = async (data: any) => {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      await updateLeaveFn(data, selected._id);
      setSuccess(true);
      toast.success(`Leave ${data.name} updated successfully.`);
      fetchLeavesType();
      setTimeout(() => {
        handleClose();
      }, 1200);
    } catch (err: any) {
      setError(err?.message || 'Failed to update leave');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    toggleDrawer(false);
    setSelected(null);
    setSuccess(false);
    setError(null);
  };

  return (
    <Drawer open={open} onClose={handleClose} 
    anchor={direction === 'ltr' ? 'right' : 'left'}
    PaperProps={{
      sx:{
        width: "30%"
      }
    }}
    >
      <ModalHeader text="Edit Leave" toggleDrawer={toggleDrawer} />
      <form onSubmit={handleSubmit(onSubmit)} >
        <div className='px-4 mt-4'>
          <div>
            <Input
              type="text"
              label='Name'
              register={register('name')}
              error={typeof errors.description?.message === 'string' ? errors.description.message : undefined}
              placeholder='Create leave' />
          </div>
          <div className='mt-3'>
            <Controller
              name="paid"
              control={control}
              render={({ field }) => (
                <CheckboxFour
                  label="Paid"
                  id="paid"
                  checked={field.value}
                  onChange={() => field.onChange(!field.value)}
                />
              )}
            />
          </div>
          <div className='mt-3'>
            <Controller
              name="half_day_allowed"
              control={control}
              render={({ field }) => (
                <CheckboxFour
                  label="Half day"
                  id="half-day"
                  checked={field.value}
                  onChange={() => field.onChange(!field.value)}
                />
              )}
            />
          </div>
          <div className='mt-3'>
            <Textarea
              label="Description"
              placeholder="Write Description"
              error={typeof errors.description?.message === 'string' ? errors.description.message : undefined}
              {...register('description')}
              rows={6}
            />
          </div>
        </div>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        <div className="flex justify-end items-center gap-2 absolute bottom-0 h-[60px] w-full pr-8 border-t-2 border-gray">
          <Button name='Close' type='button' className='bg-graydark' onClick={handleClose} />
          <Button name={loading ? 'Updating...' : 'Update'} type='submit' className='bg-success' disabled={loading} />
        </div>
      </form>
    </Drawer>
  )
}

export default EditLeave;