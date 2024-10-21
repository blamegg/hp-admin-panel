"use client";
import { Drawer } from "@mui/material";
import React, { useEffect } from "react";
import Button from "@/components/common/Button";
import ModalHeader from "../common/ModalHeader";
import { UserDrawerProps } from "@/types/CreateUser";
import Input from "../common/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EditUserFormInputs,
  editUserSchema,
  UserFormInputs,
  userSchema,
} from "@/schema/createUserSchema";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserFn } from "@/utility/queryFetcher";
import { toast } from "sonner";

const EditDrawer = ({
  direction,
  isDrawerOpen,
  toggleDrawer,
  selected,
  setSelected,
}: any) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditUserFormInputs>({
    resolver: zodResolver(editUserSchema),
  });
  const updateUserMn = useMutation({
    mutationFn: (payload: any) => updateUserFn(payload, payload.userId),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["menu-list"] });
      toast.success("User is updated successfully");
      toggleDrawer(false);
    },
    onError: (error: any) => {
      let errorMessage = error?.response?.data?.message;
      if (typeof errorMessage !== "string") {
        errorMessage = "unknown error";
      }
      toast.error(errorMessage);
    },
  });

  useEffect(() => {
    if (selected) {
      reset({
        name: selected.name || "",
        email: selected.email || "",
        mobile: String(selected.mobile) || "",
        password: "",
      });
    }
  }, [selected, reset]);

  const onSubmit = (data: EditUserFormInputs) => {
    console.log(data, "password");
    updateUserMn.mutate({ ...data, userId: selected._id });
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
              <div>
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  register={register("password")}
                  error={errors.password?.message}
                />
              </div>
            </div>

            <div className="mt-6">
              <Button
                name="Submit"
                type="submit"
                loading={updateUserMn.isPending}
                className="bg-red-600 h-[30px] w-[100px] text-[16px] text-white"
              />
            </div>
          </form>
        </div>
      </div>
    </Drawer>
  );
};

export default EditDrawer;
