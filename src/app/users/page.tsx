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
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <UserTable />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
