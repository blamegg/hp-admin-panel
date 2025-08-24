import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UserTable from "@/components/Tables/UserTable";

export const metadata: Metadata = {
  title: "HP | Users",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="HP | Users" />

      <div className="flex flex-col gap-10 w-full">
        <UserTable />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
