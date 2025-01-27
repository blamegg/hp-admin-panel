"use client";
import { Drawer } from "@mui/material";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ModalHeader from "@/components/common/ModalHeader";
import Input from "@/components/common/Input";
import { ViewUserFormInputs, viewUserSchema } from "@/schema/createUserSchema";
import { user3 } from "@/assets";
import { Calendar, dayjsLocalizer, Views } from 'react-big-calendar'
import dayjs from 'dayjs'
import "react-big-calendar/lib/css/react-big-calendar.css";
import BasicTabs from "@/components/tabs";

const ViewDrawer = ({
    direction,
    isDrawerOpen,
    toggleDrawer,
    selected,
    setSelected,
}: any) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ViewUserFormInputs>({
        resolver: zodResolver(viewUserSchema),
    });

    useEffect(() => {
        if (selected) {
            reset({
                name: selected.name || "",
                email: selected.email || "",
                mobile: String(selected.mobile) || "",
            });
        }
    }, [selected, reset]);

    const onSubmit = (data: ViewUserFormInputs) => {
        console.log(data);
    };

    const handleDateSelect = (slotInfo: any) => {
        setSelectedDate(slotInfo.start); // Update selected date on slot click
        console.log("Selected date:", slotInfo.start);
    };
    const localizer = dayjsLocalizer(dayjs)

    const leaveData = {
        totalLeave: 20,
        takingLeave: 5,
        remainingLeave: 15,
    };

    return (
        <Drawer
            anchor={direction === "ltr" ? "right" : "left"}
            open={isDrawerOpen}
            disableEnforceFocus
            onClose={() => {
                toggleDrawer(false);
                setSelected(null);
            }}
            PaperProps={{
                sx: {
                    width: "70%",
                },
            }}
        >
            <div role="presentation">
                <ModalHeader text={"View User"} toggleDrawer={toggleDrawer} />
                <div className="flex justify-between px-8">
                    <div className="mt-6 px-6 w-4/6">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex justify-between">
                                <div>
                                    <Input
                                        label="Email"
                                        type="email"
                                        placeholder="example@example.com"
                                        register={register("email")}
                                        error={errors.email?.message}
                                        disabled={true}
                                    />
                                </div>
                                <div>
                                    <Input
                                        label="Name"
                                        type="text"
                                        placeholder="John Doe"
                                        register={register("name")}
                                        error={errors.name?.message}
                                    />
                                </div>
                                <div>
                                    <Input
                                        label="Phone Number"
                                        type="text"
                                        placeholder="+1234567890"
                                        register={register("mobile")}
                                        error={errors.mobile?.message}
                                    />
                                </div>
                                    </div>
                                <div>
                                    <h1 className="text-black font-semibold mt-3">Address</h1>
                                    <textarea
                                        rows={3}
                                        name=""
                                        id=""
                                        className="border w-full border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    ></textarea>
                                </div>
                        </form>

                    </div>
                    <div className="w-1/4 mt-6">
                        <img src={user3.src} alt="abc" className="rounded-2xl w-[180px]" />
                    </div>
                </div>
                <div>
                    <BasicTabs />
                </div>

            </div>
        </Drawer>
    );
};

export default ViewDrawer;