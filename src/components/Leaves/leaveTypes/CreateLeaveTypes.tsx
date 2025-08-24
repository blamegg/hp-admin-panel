import { Drawer } from '@mui/material';
import React, { useState } from 'react'
import ModalHeader from '../../common/ModalHeader'
import Button from '../../common/Button';
import Input from '../../common/Input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateLeaveFormInput, leaveSchema } from '@/schema/leaveSchema';
import { createLeaveTypeFn } from '@/utility/queryFetcher';
import { toast } from 'sonner';
import CheckboxFour from '../../Checkboxes/CheckboxFour';
import Textarea from '../../common/Input/Textarea';
import { Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateLeaveInferFace {
    open: boolean;
    toggleDrawer: (open: boolean) => void;
    direction: string;
    fetchLeaveTypes: () => void;
}

const CreateLeaveType = ({ open, toggleDrawer, direction, fetchLeaveTypes }: CreateLeaveInferFace) => {

    const { register, handleSubmit, reset, formState: { errors }, control } = useForm<CreateLeaveFormInput>({
        resolver: zodResolver(leaveSchema),
        mode: "onSubmit",
        defaultValues: { name: "", paid: true , half_day_allowed: false, description: "", total_days_allowed: undefined }
    })
    const handleClose = () => {
        toggleDrawer(false);
        reset();
    }

    const queryClient = useQueryClient();

    const createLeaveTypeMutation = useMutation({
        mutationFn: (payload: CreateLeaveFormInput) => createLeaveTypeFn(payload),
        onSuccess: () => {
            reset();
            toast.success("Successfully created leave Type");
            queryClient.refetchQueries({ queryKey: ["users"] });
            fetchLeaveTypes();
            toggleDrawer(false);
        },
        onError: (error: any) => {
            let errorMessage = error?.response?.data?.message;
            if (typeof errorMessage !== 'string') {
                errorMessage = "unknown error"
            }
            toast.error(errorMessage)
        }
    })

    const handleCreateLeaveType = (data: CreateLeaveFormInput) => {
        console.log(data);
        createLeaveTypeMutation.mutate({ ...data });
    }

    return (
        <Drawer
            open={open} onClose={handleClose} anchor={direction === 'ltr' ? 'right' : 'left'}
            PaperProps={{
                sx: {
                    width: "30%"
                }
            }}
        >
            <ModalHeader text={"Create Leave Type"} toggleDrawer={toggleDrawer} />
            <form onSubmit={handleSubmit(handleCreateLeaveType)} >
                <div className='px-4 mt-4'>
                    <div>
                        <Input
                            type="text"
                            label='Name'
                            register={register('name')}
                            error={errors.name?.message}
                            placeholder='Create leave' />
                    </div>
                    <div className='mt-3'>
                        <Input
                            type="number"
                            label='Total days allowed'
                            register={register('total_days_allowed', { valueAsNumber: true })}
                            error={errors.total_days_allowed?.message}
                            placeholder='Enter number of days'
                        />
                    </div>
                    <div className='mt-3 flex justify-start gap-4 items-center'>
                        <div className=''>
                            <Controller
                                name="paid"
                                control={control}
                                render={({ field }) => (
                                    <CheckboxFour
                                        label="Paid"
                                        id="paid"
                                        checked={field.value ?? false}
                                        onChange={() => field.onChange(!field.value)}
                                        
                                    />
                                )}
                            />
                        </div>
                        <div className=''>
                            <Controller
                                name="monthly"
                                control={control}
                                render={({ field }) => (
                                    <CheckboxFour
                                        label="Monthly"
                                        id="monthly"
                                        checked={field.value ?? false}
                                        onChange={() => field.onChange(!field.value)}
                                    />
                                )}
                            />
                        </div>
                        <div className=''>
                            <Controller
                                name="half_day_allowed"
                                control={control}
                                render={({ field }) => (
                                    <CheckboxFour
                                        label="Half day"
                                        id="half-day"
                                        checked={field.value ?? false}
                                        onChange={() => field.onChange(!field.value)}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div className='mt-3'>
                        <Textarea
                            label="Description"
                            placeholder="Write Description"
                            error={errors.description?.message}
                            {...register('description')}
                            rows={6}
                        />
                    </div>
                </div>
                <div className='flex justify-end items-center gap-2 absolute bottom-0 h-[60px] w-full pr-8 border-t-2 border-gray'>
                    <Button type="button" name="Cancel" onClick={handleClose} className="bg-graydark" />
                    <Button type="submit" name=" Create Leave" className="bg-success"></Button>
                </div>
            </form>
        </Drawer >
    )
}

export default CreateLeaveType