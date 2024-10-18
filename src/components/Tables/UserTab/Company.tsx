import Input from "@/components/common/Input";
import React from "react";
import { z } from "zod";

const schema = z.object({
  companyName: z.string().nonempty("Company name is required"),
  companyEmail: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  companyPhone: z.string().nonempty("Phone number is required"),
  companyAddress: z.string().nonempty("Address is required"),
  companyWebsite: z.string().url("Invalid website URL").optional(),
  companyDescription: z.string().optional(),
});

const Company = ({ control, register, errors }: any) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div>
        <Input
          {...register("companyName")}
          label="Company Name"
          type="text"
          placeholder="Enter company name"
          error={errors.companyName?.message}
        />
      </div>

      <div>
        <Input
          {...register("companyEmail")}
          label="Company Email"
          type="email"
          placeholder="Enter company email"
          error={errors.companyEmail?.message}
        />
      </div>

      <div>
        <Input
          {...register("companyPhone")}
          label="Company Phone"
          type="tel"
          placeholder="Enter company phone number"
          error={errors.companyPhone?.message}
        />
      </div>

      <div>
        <Input
          {...register("companyAddress")}
          label="Company Address"
          type="text"
          placeholder="Enter company address"
          error={errors.companyAddress?.message}
        />
      </div>

      <div>
        <Input
          {...register("companyWebsite")}
          label="Company Website"
          type="text"
          placeholder="Enter company website"
          error={errors.companyWebsite?.message}
        />
      </div>

      <div>
        <Input
          {...register("companyDescription")}
          label="Company Description"
          type="text"
          placeholder="Enter company description"
          error={errors.companyDescription?.message}
        />
      </div>
    </div>
  );
};

export default Company;
