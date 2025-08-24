import React from "react";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { CurrentRoleDataInterFace } from "@/utility/queryFetcher";

const Basic = ({ register, errors, isDrawerOpen }: any) => {

  const roles = useSelector((state: RootState) => 
    isDrawerOpen ? state.role.allRoles : []
  );
  const roleList = roles?.map((role: CurrentRoleDataInterFace) => ({ value: role._id, label: role.name }));
  
  return (
    <div className="grid gap-4 md:grid-cols-2">
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
          type="text"
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
      <div>
        <Select
          label="Role"
          options={roleList}
          register={register("role_id")}
          error={errors.role_id?.message}
        >
        </Select>
      </div>
    </div>
  );
};

export default Basic;
