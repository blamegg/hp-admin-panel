import React from "react";
import Input from "@/components/common/Input";

const Basic = () => {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3 ">
        <div>
          <Input label="First Name" type="text" placeholder="John" />
        </div>

        <div>
          <Input label="Last Name" type="text" placeholder="Doe" />
        </div>

        <div>
          <Input label="Username" type="text" placeholder="johndoe123" />
        </div>

        <div>
          <Input label="Email" type="email" placeholder="example@example.com" />
        </div>
        <div>
          <Input label="Password" type="password" placeholder="••••••••" />
        </div>

        <div>
          <Input label="Phone Number" type="number" placeholder="+1234567890" />
        </div>
      </div>
    </>
  );
};

export default Basic;
