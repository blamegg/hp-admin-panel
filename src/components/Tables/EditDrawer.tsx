"use client";
import { Drawer } from "@mui/material";
import React from "react";
import Button from "@/components/common/Button";
import ModalHeader from "../common/ModalHeader";
import { UserDrawerProps } from "@/types/CreateUser";
import Input from "../common/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserFormInputs, userSchema } from "@/schema/createUserSchema";
import { useForm } from "react-hook-form";

const EditDrawer = ({
  direction,
  isDrawerOpen,
  toggleDrawer,
}: UserDrawerProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormInputs>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = (data: UserFormInputs) => {
    console.log(data);
    // createUserMn.mutate({ ...data });
  };

  return (
    <Drawer
      anchor={direction === "ltr" ? "right" : "left"}
      open={isDrawerOpen}
      disableEnforceFocus
      onClose={() => {
        toggleDrawer(false);
      }}
      PaperProps={{
        sx: {
          width: "30%",
        },
      }}
    >
      <div role="presentation">
        <ModalHeader text={"Edit User"} toggleDrawer={toggleDrawer} />
        <div className="mt-6 px-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 md:grid-cols-1">
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
                  label="Email"
                  type="email"
                  placeholder="example@example.com"
                  register={register("email")}
                  error={errors.email?.message}
                />
              </div>
              <div>
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  register={register("password")}
                  error={errors.password?.message}
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

            <div className="mt-8">
              <Button
                name="Confirm Edit"
                type="submit"
                className="bg-red-600 px-4  py-1.5 text-[16px] text-white"
              />
            </div>
          </form>
        </div>
      </div>
    </Drawer>
  );
};

export default EditDrawer;
