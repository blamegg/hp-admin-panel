import React from "react";

interface FormErrorProps {
  error?: string;
}

const FormError = ({ error }: FormErrorProps) => {
  return (
    <p className="text-[12px] font-semibold leading-5 text-red">{error}</p>
  );
};

export default FormError;
