import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Setting from "@/components/setting";

export const metadata: Metadata = {
  title: "Next.js Settings | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Settings page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const Settings = () => {

 
  return (
    <DefaultLayout>
      <Setting />
    </DefaultLayout>
  );
};

export default Settings;
