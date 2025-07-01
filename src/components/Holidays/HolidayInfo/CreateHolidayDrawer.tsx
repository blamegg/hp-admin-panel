'use client';
import React, { useState, useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@/components/common/Button';
import Select from '@/components/common/Select';
import Input from '@/components/common/Input';
import ModalHeader from '@/components/common/ModalHeader';
import { useDispatch, useSelector } from 'react-redux';
import { createHoliday, fetchHolidays } from '@/redux/slice/holidaySlice';
import { AppDispatch, RootState } from '@/redux/store';
import { toast } from 'sonner';
import MultipleDatePicker from '@/components/FormElements/DatePicker/MultipleDatePicker';
import Textarea from '@/components/common/Input/Textarea';

interface HolidayTypesListData {
    _id: string;
    name: string;
}
  
interface CreateHolidayDrawerProps {
    open: boolean;
    onClose: () => void;
    selectedDateRange: { start: Date; end: Date } | null;
    holidayTypes: HolidayTypesListData[];
}

const CreateHolidayDrawer: React.FC<CreateHolidayDrawerProps> = ({ open, onClose, selectedDateRange, holidayTypes }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading } = useSelector((state: RootState) => state.holidays);
    const [createLoading, setCreateLoading] = useState(false);

    const [holidayType, setHolidayType] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dates, setDates] = useState<Date[]>([]);

    useEffect(() => {
        if(open && selectedDateRange) {
            setHolidayType(holidayTypes[0]?._id || '');
            setTitle('');
            setDescription('');
            // Only select the start date by default
            setDates([new Date(selectedDateRange.start)]);
        }
    }, [open, selectedDateRange, holidayTypes]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (dates.length > 0 && title && holidayType) {
            setCreateLoading(true);
            const newHoliday = {
                title: title,
                description: description,
                dates: dates.map(date => 
                    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
                ),
                holiday_type: holidayType,
            };
            const result = await dispatch(createHoliday(newHoliday));
            setCreateLoading(false);
            if (createHoliday.fulfilled.match(result)) {
                toast.success("Holiday created successfully!");
                dispatch(fetchHolidays());
                onClose();
            } else if (createHoliday.rejected.match(result)) {
                const errorMessage = typeof result.payload === 'string' ? result.payload : 'An unknown error occurred';
                toast.error(`Failed to create holiday: ${errorMessage}`);
            }
        } else {
            toast.error("Please select at least one date and provide a title and holiday type.");
        }
    };
    
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{ sx: { width: '30%' } }}
        >
            <ModalHeader text="Create Holiday" toggleDrawer={onClose} />
            <form id="create-holiday-form" onSubmit={handleSubmit} className="p-6 space-y-6">
                 <div>
                    <MultipleDatePicker
                        label="Dates"
                        selectedDates={dates}
                        onChange={setDates}
                    />
                </div>
                <div>
                    <Select
                        label="Holiday Type"
                        options={Array.isArray(holidayTypes) ? holidayTypes.map((type) => ({ value: type._id, label: type.name })) : []}
                        value={holidayType}
                        onChange={(e) => setHolidayType(e.target.value)}
                    />
                </div>
                <div>
                    <Input
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter holiday title"
                        type="text"
                    />
                </div>
                <div>
                    <Textarea
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter a short description"
                    />
                </div>
            </form>
            <div className="flex justify-end items-center gap-3 absolute bottom-0 h-[70px] w-full pr-2 border-t-2 border-gray">
                <Button
                    type="button"
                    name="Cancel"
                    className="bg-graydark"
                    onClick={onClose}
                />
                <Button
                    type="submit"
                    form="create-holiday-form"
                    name={createLoading ? 'Creating...' : 'Create'}
                    className="bg-primary text-white min-w-[100px]"
                    disabled={createLoading}
                    loading={createLoading}
                />
            </div>
        </Drawer>
    );
};

export default CreateHolidayDrawer; 