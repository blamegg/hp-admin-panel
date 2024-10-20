import Input from "@/components/common/Input";
import React from "react";
import { UseFormRegister } from "react-hook-form";

export interface TabProps {
  register: UseFormRegister<any>;
  errors: any;
}

const Company = ({ register, errors }: TabProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div>
        <Input
          label="Company Name"
          type="text"
          placeholder="Enter company name"
          register={register("companyName")}
          error={errors.companyName?.message}
        />
      </div>

      <div>
        <Input
          label="Company Email"
          type="email"
          placeholder="Enter company email"
          register={register("companyEmail")}
          error={errors.companyEmail?.message}
        />
      </div>

      <div>
        <Input
          label="Company Phone"
          type="text"
          placeholder="Enter company phone number"
          register={register("companyPhone")}
          error={errors.companyPhone?.message}
        />
      </div>

      <div>
        <Input
          label="Company Address"
          type="text"
          placeholder="Enter company address"
          register={register("companyAddress")}
          error={errors.companyAddress?.message}
        />
      </div>

      <div>
        <Input
          label="Company Website"
          type="text"
          placeholder="Enter company website"
          register={register("companyWebsite")}
          error={errors.companyWebsite?.message}
        />
      </div>

      <div>
        <Input
          label="Company Description"
          type="text"
          placeholder="Enter company description"
          register={register("companyDescription")}
          error={errors.companyDescription?.message}
        />
      </div>
    </div>
  );
};

export default Company;
