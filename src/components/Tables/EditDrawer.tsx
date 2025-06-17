"use client";
import { Drawer } from "@mui/material";
import React, { useEffect } from "react";
import Button from "@/components/common/Button";
import ModalHeader from "../common/ModalHeader";
import Input from "../common/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditUserFormInputs, editUserSchema, } from "@/schema/createUserSchema";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CurrentRoleDataInterFace, updateUserFn } from "@/utility/queryFetcher";
import { toast } from "sonner";
import Select from "../common/Select";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchRoleFn } from "@/redux/slice/roleSlice";

const EditDrawer = ({
  direction,
  isDrawerOpen,
  toggleDrawer,
  selected,
  setSelected,
}: any) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();
  
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
      queryClient.refetchQueries({ queryKey: ["users"] });
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
        role_id: selected.role._id || ""
      });
    }
  }, [selected, reset]);

  // Fetch roles when drawer is opened
  useEffect(() => {
    if (isDrawerOpen) {
      dispatch(fetchRoleFn({ page: 1, limit: 1000 })); // Fetch all roles for dropdown
    }
  }, [isDrawerOpen, dispatch]);

  const onSubmit = (data: EditUserFormInputs) => {
    updateUserMn.mutate({ ...data, userId: selected._id });
  };

  const roles = useSelector((state: RootState) => state.role.allRoles );
  const roleList = roles?.map((role: CurrentRoleDataInterFace) => ({ value: role._id, label: role.name }));
  console.log(roleList)

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
      <div role="presentation" className="">
        <ModalHeader text={"Edit User"} toggleDrawer={toggleDrawer} />
        <div className="mt-6 w-full ">
          <div className="px-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 md:grid-cols-1 w-full">
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
                  <Select
                    label="Role"
                    options={roleList}
                    error={errors.role_id?.message}
                    register={register("role_id")}
                  />
                </div>
              </div>

              <div className="mt-6">
              </div>

            </form>
          </div>
          <div className='flex justify-end items-center gap-2 absolute bottom-0 h-[60px] w-[100%] pr-8 border-t-2 border-gray'>
            <Button type="button" name="Close" className="mr-4" style={{ backgroundColor: "gray" }} onClick={() => toggleDrawer(false)} />
            <Button
              name="Submit"
              type="button"
              loading={updateUserMn.isPending}
              style={{ backgroundColor: "#04aa6d" }}
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default EditDrawer;
