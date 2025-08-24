'use client'
import React, { useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '../../common/Button';
import Input from '../../common/Input';
import ModalHeader from '../../common/ModalHeader';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { updateHolidayType, HolidayType } from '@/redux/slice/holiday/holidayTypesSlice';
import { toast } from 'sonner';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { holidayTypeSchema, HolidayTypeFormInputs } from '@/schema/holidaySchema';
import FormError from '@/components/common/FormError';
import Textarea from '../../common/Input/Textarea';

interface EditHolidayTypeProps {
  open: boolean;
  toggleDrawer: (open: boolean) => void;
  selected: HolidayType | null;
}

const EditHolidayType: React.FC<EditHolidayTypeProps> = ({ open, toggleDrawer, selected }) => {
    const { handleSubmit, formState: { errors, isSubmitting }, setValue, reset } = useForm<HolidayTypeFormInputs>({
        resolver: zodResolver(holidayTypeSchema),
        mode: 'onChange'
    });

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (selected) {
        const initialName = selected.name;
        const initialDescription = selected.description || '';
        
        // Set local state for controlled components
        setName(initialName);
        setDescription(initialDescription);
        
        // Set react-hook-form state for validation
        reset({ name: initialName, description: initialDescription });
    }
  }, [selected, open, reset]);

  const onSubmit: SubmitHandler<HolidayTypeFormInputs> = async (data) => {
    if (!selected) {
      toast.error('No holiday type selected.');
      return;
    }
    try {
      await dispatch(updateHolidayType({ id: selected._id, data })).unwrap();
      toast.success('Holiday type updated successfully!');
      toggleDrawer(false);
    } catch (error: any) {
      toast.error(error || 'Failed to update holiday type.');
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setValue('name', value, { shouldValidate: true });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescription(value);
    setValue('description', value);
  };

  const handleClose = () => {
    toggleDrawer(false);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { width: '30%' } }}
    >
      <ModalHeader text="Edit Holiday Type" toggleDrawer={handleClose} />
      <form className="p-6 space-y-6">
        <div>
          <Input
            label="Holiday Type Name"
            value={name}
            onChange={handleNameChange}
            placeholder="e.g., Public Holiday"
            type="text"
          />
          <FormError error={errors.name?.message} />
        </div>
        <div>
          <Textarea
            label="Description"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Enter a short description"
          />
        </div>
      </form>
      <div className="flex justify-end items-center gap-3 absolute bottom-0 h-[70px] w-full pr-2 border-t-2 border-gray">
        <Button
          type="button"
          name="Cancel"
          onClick={handleClose}
          className="bg-graydark"
        />
        <Button
          type="button"
          onClick={handleSubmit(onSubmit)}
          name={isSubmitting ? 'Updating...' : 'Update'}
          className="bg-primary text-white min-w-[100px]"
          disabled={isSubmitting}
          loading={isSubmitting}
        />
      </div>
    </Drawer>
  );
};

export default EditHolidayType; 