import React from "react";
import Input from "@/components/common/Input";

const Basic = ({ register, errors }: any) => {
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
    </div>
  );
};

export default Basic;
