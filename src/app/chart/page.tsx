import Chart from "@/components/Charts/page";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";

export async function generateMetadata() {
  // Return metadata dynamically based on product information
  return {
    title: "test",
    description: "gg",
  };
}

const BasicChartPage: React.FC = () => {
  return (
    <DefaultLayout>
      <Chart />
    </DefaultLayout>
  );
};

export default BasicChartPage;
