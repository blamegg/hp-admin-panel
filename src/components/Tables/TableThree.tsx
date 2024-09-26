"use client";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash } from "react-icons/fa";
import CustomPagination from "@/components/CustomPagination";

const generateData = (count: number) => {
  return Array.from({ length: count }, (v, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    description: `description of ${i + 1}`,
    email: `item${i + 1}@example.com`, // Generating email addresses
    dateCreated: new Date().toLocaleDateString(), // Adding date created
    status: i % 2 === 0 ? "Active" : "Inactive", // Adding status field
  }));
};

const columns = [
  {
    name: "Name",
    selector: (row: any) => row.name,
    sortable: true,
    width: "200px",
  },
  {
    name: "Description",
    selector: (row: any) => row.description,
    width: "300px",
  },
  {
    name: "Email",
    selector: (row: any) => row.email,
    sortable: true,
    width: "200px",
  },
  {
    name: "Date Created",
    selector: (row: any) => row.dateCreated,
    sortable: true,
    width: "150px",
  },
  {
    name: "Status",
    selector: (row: any) => row.status,
    sortable: true,
    width: "100px",
  },
  {
    name: "Actions",
    cell: (row: any) => (
      <div className="flex space-x-2">
        <button
          onClick={() => handleEdit(row.id)}
          className="text-blue-500 hover:text-blue-700"
        >
          <FaEdit />
        </button>
        <button
          onClick={() => handleDelete(row.id)}
          className="text-red-500 hover:text-red-700"
        >
          <FaTrash />
        </button>
      </div>
    ),
    width: "120px",
  },
];

const TableThree = () => {
  const [mockData, setMockData] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const data = generateData(100);
    setMockData(data);
    setTotalItems(data.length);
  }, []);

  useEffect(() => {
    const totalPages = Math.ceil(totalItems / rowsPerPage);
    if (currentPage > totalPages) {
      setCurrentPage(totalPages > 0 ? totalPages : 1);
    }
  }, [totalItems, rowsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const handleEdit = (id: number) => {
    console.log(`Edit item with ID: ${id}`);
    // Add your edit logic here
  };

  const handleDelete = (id: number) => {
    console.log(`Delete item with ID: ${id}`);
    // Add your delete logic here
  };

  return (
    <div className="custom_tbl_container max-w-[800px] md:max-w-full">
      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={mockData.slice(
            (currentPage - 1) * rowsPerPage,
            currentPage * rowsPerPage,
          )}
          pagination
          paginationPerPage={rowsPerPage}
          paginationTotalRows={totalItems}
          paginationComponent={() => (
            <CustomPagination
              rowsPerPage={rowsPerPage}
              currentPage={currentPage}
              rowCount={totalItems}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handleRowsPerPageChange}
            />
          )}
          className="custom_tbl"
          progressPending={isLoading}
          customStyles={{
            header: {
              style: {
                fontSize: "12px",
                minHeight: "30px",
                padding: "0 8px",
              },
            },
            headRow: {
              style: {
                fontSize: "12px",
                minHeight: "30px",
                padding: "0 8px",
              },
            },
            headCells: {
              style: {
                fontWeight: 700,
                padding: "0 8px",
              },
            },
            cells: {
              style: {
                fontSize: "11px",
                fontWeight: 500,
                wordBreak: "break-word",
                overflowWrap: "break-word",
                padding: "0 8px",
                height: "27px",
              },
            },
            rows: {
              style: {
                fontSize: "11px",
                minHeight: "27px",
                "&:not(:last-of-type)": {
                  borderBottomStyle: "solid",
                  borderBottomWidth: "1px",
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default TableThree;
