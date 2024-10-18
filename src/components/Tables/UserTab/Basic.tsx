import React from "react";
import Input from "@/components/common/Input";

const Basic = ({ register, errors }: any) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div>
        <Input
          label="First Name"
          type="text"
          placeholder="John"
          register={register("firstName")}
          error={errors.firstName?.message}
        />
      </div>
      <div>
        <Input
          label="Last Name"
          type="text"
          placeholder="Doe"
          register={register("lastName")}
          error={errors.lastName?.message}
        />
      </div>
      <div>
        <Input
          label="Username"
          type="text"
          placeholder="johndoe123"
          register={register("username")}
          error={errors.username?.message}
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
          type="number"
          placeholder="+1234567890"
          register={register("mobile")}
          error={errors.mobile?.message}
        />
      </div>
    </div>
  );
};

export default Basic;
