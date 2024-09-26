"use client";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash } from "react-icons/fa";
import CustomPagination from "@/components/CustomPagination";
import { Button, Drawer } from "@mui/material";
import { useDirection } from "@/context/DirectionContext";

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

const TableThree = () => {
  const [mockData, setMockData] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { direction, toggleDirection } = useDirection();

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

  // Filter the mockData based on the search query
  const filteredData = mockData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      setIsDrawerOpen(open);
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
        <div className="flex gap-2">
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

  return (
    <>
      <div className="custom_tbl_container h-[90vh] max-w-[800px] md:max-w-full">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className=" rounded border p-1 text-[12px] text-black outline-none"
          />
          <Button variant="contained" size="small" onClick={toggleDrawer(true)}>
            Open Side Bar
          </Button>
        </div>
        <div className="mt-5 overflow-x-auto">
          <DataTable
            columns={columns}
            data={filteredData.slice(
              (currentPage - 1) * rowsPerPage,
              currentPage * rowsPerPage,
            )}
            pagination
            paginationPerPage={rowsPerPage}
            paginationTotalRows={filteredData.length}
            paginationComponent={() => (
              <CustomPagination
                rowsPerPage={rowsPerPage}
                currentPage={currentPage}
                rowCount={filteredData.length}
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
                  // padding: "0 8px",
                },
              },
              headRow: {
                style: {
                  fontSize: "12px",
                  minHeight: "30px",
                  // padding: "0 8px",
                },
              },
              headCells: {
                style: {
                  fontWeight: 700,
                  // padding: "0 8px",
                },
              },
              cells: {
                style: {
                  fontSize: "11px",
                  fontWeight: 500,
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  // padding: "0 8px",
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
      <Drawer
        anchor={direction === "ltr" ? "right" : "left"}
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: "50%",
          },
        }}
      >
        <div
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <div className="flex items-center justify-between bg-blue-600 p-4 text-white">
            <h2 className="text-xl font-bold">Drawer Title</h2>
            <Button
              variant="contained"
              color="error"
              onClick={toggleDrawer(false)}
            >
              Close
            </Button>
          </div>

          <div className="bg-gray-100 h-full overflow-y-auto p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded bg-white p-4 shadow">
                <h3 className="text-lg font-semibold">Item 1</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
              <div className="rounded bg-white p-4 shadow">
                <h3 className="text-lg font-semibold">Item 2</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
              <div className="rounded bg-white p-4 shadow">
                <h3 className="text-lg font-semibold">Item 3</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
              <div className="rounded bg-white p-4 shadow">
                <h3 className="text-lg font-semibold">Item 4</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            </div>

            <div className="mt-6">
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Voluptatem nostrum alias nesciunt numquam aperiam ipsam aut
                voluptates omnis veritatis id non tempora porro sit deserunt
                ipsum quisquam neque, suscipit fuga.
              </p>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default TableThree;
