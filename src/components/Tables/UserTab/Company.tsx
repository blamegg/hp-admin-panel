import Input from "@/components/common/Input";
import React from "react";

const Company = () => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Company Name Input */}
      <div>
        <Input
          label="Company Name"
          type="text"
          placeholder="Enter company name"
        />
      </div>

      {/* Company Email Input */}
      <div>
        <Input
          label="Company Email"
          type="email"
          placeholder="Enter company email"
        />
      </div>

      {/* Company Phone Input */}
      <div>
        <Input
          label="Company Phone"
          type="number"
          placeholder="Enter company phone number"
        />
      </div>

      {/* Company Address Input */}
      <div>
        <Input
          label="Company Address"
          type="text"
          placeholder="Enter company address"
        />
      </div>

      {/* Company Website Input */}
      <div>
        <Input
          label="Company Website"
          type="text"
          placeholder="Enter company website"
        />
      </div>

      {/* Company Description Input */}
      <div>
        <Input
          label="Company Description"
          type="text"
          placeholder="Enter company description"
        />
      </div>
    </div>
  );
};

export default Company;
