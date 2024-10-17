import React from "react";
import Register from "@/components/Register";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "HP | Register",
};

const page = () => {
  return <Register />;
};

export default page;
