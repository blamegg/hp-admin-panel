import React, { useEffect, useState } from "react";
import { Drawer } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leaveFormSchema, LeaveFormInputs } from "@/schema/leaveSchema";
import { toast } from "sonner";
import { applyLeaveFn } from "@/utility/queryFetcher";
import Button from "../../common/Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import Textarea from "../../common/Input/Textarea";
import Select from "../../common/Select";
import Input from "../../common/Input";
import ModalHeader from "@/components/common/ModalHeader";
import { fetchTakenLeaves } from "@/redux/slice/takenLeaveSclice";
import { FaPlus, FaTrash } from 'react-icons/fa';
import { fetchLeaveTypesList } from "@/redux/slice/leaveTypesListSlice";
import { fetchLeaveModeList } from "@/redux/slice/leaveModeListSlice";

const LEAVE_MODES = [
    { value: "Half-Day", label: "Half-Day" },
    { value: "Full-Day", label: "Full-Day" },
    { value: "Day-Range", label: "Day-Range" },
    { value: "Multi-Days", label: "Multi-Days" },
];

const HALF_DAY_SESSIONS = [
    { value: "Morning", label: "Morning" },
    { value: "Afternoon", label: "Afternoon" },
];

const defaultValues: LeaveFormInputs = {
    leave_type: "",
    leave_mode: "",
    start_date: "",
    end_date: "",
    description: "",
    dates: [],
    half_day_session: "",
};

interface LeaveFormProps {
    isLeaveFormShowing: boolean;
    toggleDrawer: (value: boolean) => void;
}

const LeaveForm: React.FC<LeaveFormProps> = ({ isLeaveFormShowing, toggleDrawer }) => {
    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<LeaveFormInputs>({
        resolver: zodResolver(leaveFormSchema),
        defaultValues,
    });
    const leave_mode = watch("leave_mode");
    const [loading, setLoading] = useState(false);
    const [singleDateInput, setSingleDateInput] = useState(""); // State for single date input
    const dispatch = useDispatch<AppDispatch>();
    const dates = watch('dates');

    const leaveTypes = useSelector((state: RootState) => state.leaveTypesList.LeaveTypesList);
    const leaveModes = useSelector((state: RootState) => state.leaveModeList.LeaveModes);

    useEffect(() => {
        dispatch(fetchLeaveTypesList())
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchLeaveModeList());
    }, [dispatch]);

    // Reset form when drawer closes
    React.useEffect(() => {
        if (!isLeaveFormShowing) {
            reset(defaultValues);
            setSingleDateInput(""); // Clear single date input
        }
    }, [isLeaveFormShowing, reset]);

    React.useEffect(() => {
        if (leave_mode === "Multi-Days" && (!dates || dates.length === 0)) {
            setValue("dates", []);
        }
        // Clear start_date when switching to Multi-Days mode
        if (leave_mode === "Multi-Days") {
            setValue("start_date", "");
        }
        // Clear dates when switching to other modes
        if (leave_mode !== "Multi-Days") {
            setValue("dates", []);
            setSingleDateInput(""); // Clear single date input
        }
    }, [leave_mode, setValue]);

    // Add a single date to the selected dates
    const handleAddSingleDate = (selectedDate: string) => {
        if (!selectedDate) return;

        const currentDates = watch('dates') || [];
        // Check if date already exists
        if (currentDates.includes(selectedDate)) {
            toast.error("This date is already selected");
            return;
        }
        setValue('dates', [...currentDates, selectedDate]);
    };

    // Remove a specific date from selected dates
    const handleRemoveSelectedDate = (dateToRemove: string) => {
        const currentDates = watch('dates') || [];
        const updatedDates = currentDates.filter(date => date !== dateToRemove);
        setValue('dates', updatedDates);
    };

    const onSubmit = async (data: LeaveFormInputs) => {
        console.log("Form data:", data);
        console.log("Form errors:", errors);

        // Check if form has validation errors
        if (Object.keys(errors).length > 0) {
            console.error("Form validation errors:", errors);
            toast.error("Please fix the form errors before submitting");
            return;
        }

        // Additional validation for Multi-Days mode
        if (data.leave_mode === "Multi-Days") {
            if (!data.dates || data.dates.length === 0) {
                toast.error("Please select at least one date for Multi-Days leave");
                return;
            }
            const validDates = data.dates.filter(date => date && date.trim() !== "");
            if (validDates.length === 0) {
                toast.error("Please select valid dates for Multi-Days leave");
                return;
            }
            // Check if there are any duplicate dates
            const uniqueDates = new Set(validDates);
            if (uniqueDates.size !== validDates.length) {
                toast.error("Please remove duplicate dates");
                return;
            }
        }

        setLoading(true);
        try {
            // Prepare payload based on leave mode
            const payload: any = { ...data };

            // For Multi-Days, remove start_date and end_date from payload
            if (data.leave_mode === "Multi-Days") {
                delete payload.start_date;
                delete payload.end_date;
                // Ensure dates array is properly formatted and remove empty dates
                if (payload.dates && payload.dates.length > 0) {
                    payload.dates = payload.dates.filter((date: string) => date && date.trim() !== "");
                }
            }

            // For other modes, remove dates from payload
            if (data.leave_mode !== "Multi-Days") {
                delete payload.dates;
            }

            const response = await applyLeaveFn(payload);
            toast.success(response.message || "Leave application submitted successfully");
            dispatch(fetchTakenLeaves());
            reset();
            setSingleDateInput(""); // Clear single date input
            toggleDrawer(false);
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || "Failed to submit leave application";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const leaveTypeOptions = Array.isArray(leaveTypes)
        ? leaveTypes.map((type) => ({
            value: String(type),
            label: String(type)
        }))
        : [];

        console.log("mode:",leaveModes)
    return (
        <div className="flex justify-center items-center">
            <Drawer anchor="right" open={isLeaveFormShowing} onClose={() => toggleDrawer(false)} PaperProps={{ sx: { width: "30%" } }}>
                <ModalHeader text="Apply for Leave" toggleDrawer={() => toggleDrawer(false)} />
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
                    <div className="flex flex-wrap gap-4 px-4">
                        <div className="md:flex items-center justify-between gap-10 w-full ">
                            <div className="w-full">
                                <Select
                                    label="Leave Type"
                                    options={leaveTypeOptions}
                                    register={register("leave_type")}
                                    error={errors.leave_type?.message}
                                />
                            </div>
                            <div className="w-full mt-2 md:mt-0">
                                <Select
                                    label="Leave Mode"
                                    options={leaveModes}
                                    register={register("leave_mode")}
                                    error={errors.leave_mode?.message}
                                />
                            </div>
                        </div>

                        {/* Date selection logic */}
                        {leave_mode === "Multi-Days" ? (
                            <div className="w-full">
                                <label className="block font-medium text-gray-700 mb-1">Select Dates *</label>

                                {/* Single Date Input */}
                                <div className="grid grid-cols-2 gap-10 mb-3">
                                    <div>
                                        <Input
                                            type="date"
                                            label=""
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
                                                setSingleDateInput("");
                                            }
                                        }}
                                        disabled={!singleDateInput}
                                    >
                                    </Button>
                                </div>

                                {dates && dates.length > 0 && (
                                    <div className="mb-3">
                                        <div className="flex items-start justify-start gap-4 mb-2">
                                            <label className="block font-medium text-gray-600 text-sm">Selected Dates: ( {dates.length} )</label>
                                            {dates.length <= 1 ? <></> :
                                                <Button
                                                    name=" Clear All"
                                                    type="button"
                                                    onClick={() => setValue('dates', [])}
                                                    className="bg-danger text-white text-xs"
                                                >

                                                </Button>
                                            }
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {dates.map((date: string, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-1 bg-green-100 border border-green-300 rounded px-2 py-1 text-sm"
                                                >
                                                    <span className="text-green-800">{date}</span>
                                                    <Button
                                                        name=''
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
                            <div className={`md:flex items-center justify-between gap-10 ${leave_mode === "Full-Day" ? 'md:w-1/2 md:pr-4.5 w-full' : 'w-full'}`}>
                                <div className="w-full">
                                    <Input
                                        label="Start Date *"
                                        type="date"
                                        register={register("start_date")}
                                        error={errors.start_date?.message}
                                        placeholder="Select start date"
                                        aria-invalid={!!errors.start_date}
                                    />
                                </div>
                                {(leave_mode === "Day-Range") && (
                                    <div className="w-full transition-all duration-200 mt-2 md:mt-0">
                                        <Input
                                            label="End Date *"
                                            type="date"
                                            register={register("end_date")}
                                            error={errors.end_date?.message}
                                            placeholder="Select end date"
                                            aria-invalid={!!errors.end_date}
                                        />
                                    </div>
                                )}
                                {leave_mode === "Half-Day" && (
                                    <div className="w-full transition-all duration-200 mt-2 md:mt-0">
                                        <Select
                                            label="Session *"
                                            options={HALF_DAY_SESSIONS}
                                            register={register("half_day_session")}
                                            error={errors.half_day_session?.message}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="w-full">
                            <Textarea
                                label="Description"
                                value={watch("description")}
                                onChange={e => setValue("description", e.target.value)}
                                error={errors.description?.message}
                                placeholder="Describe your leave reason (optional)"
                                rows={3}
                                aria-invalid={!!errors.description}
                            />
                        </div>
                    </div>
                    <div className='flex justify-end items-center gap-2 absolute bottom-0 h-[60px] w-full pr-8 border-t-2 border-gray'>
                        <Button type="button" name="Cancel" className="bg-graydark" onClick={() => toggleDrawer(false)} />
                        <Button
                            name={loading ? "Submitting..." : "Submit"}
                            type="submit"
                            className="bg-success font-medium min-w-[120px]"
                            disabled={loading}
                            loading={loading}
                        />
                    </div>
                </form>
            </Drawer>
        </div>
    );
};

export default LeaveForm;

