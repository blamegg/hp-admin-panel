"use client";
import React from "react";
import DataTable from "react-data-table-component";

// Define the data type for each row
interface User {
  id: number;
  name: string;
  age: number;
  email: string;
}

// Sample data for the table
const data: User[] = [
  { id: 1, name: "John Doe", age: 28, email: "john@example.com" },
  { id: 2, name: "Jane Smith", age: 34, email: "jane@example.com" },
  { id: 3, name: "Sam Green", age: 22, email: "sam@example.com" },
];

// Define the columns of the table
const columns = [
  {
    name: "ID",
    selector: (row: User) => row.id,
    sortable: true,
  },
  {
    name: "Name",
    selector: (row: User) => row.name,
    sortable: true,
  },
  {
    name: "Age",
    selector: (row: User) => row.age,
    sortable: true,
  },
  {
    name: "Email",
    selector: (row: User) => row.email,
    sortable: true,
  },
];

const CustomTable: React.FC = () => {
  return (
    <div>
      <h1>User Data Table</h1>
      <DataTable
        title="User Information"
        columns={columns}
        data={data}
        pagination
        highlightOnHover
        striped
        customStyles={{
          cells: {
            style: {
              padding: "0px", // Adjust this value to decrease or increase cell padding
              height: "2px",
            },
          },
        }}
      />
    </div>
  );
};

export default CustomTable;
