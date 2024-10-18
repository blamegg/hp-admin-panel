"use client";
import { FaRegQuestionCircle } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash } from "react-icons/fa";
import CustomPagination from "@/components/CustomPagination";
import { Tooltip } from "@mui/material";
import { useDirection } from "@/context/DirectionContext";
import CreateUserDrawer from "./CreateUserDrawer";
import Button from "@/components/common/Button";
import DeleteDrawer from "./DeleteDrawer";
import { useQuery } from "@tanstack/react-query";
import { usersFn } from "@/utility/queryFetcher";

const generateData = (count: number) => {
  return Array.from({ length: count }, (v, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    description: `description of ${i + 1}`,
    email: `item${i + 1}@example.com`,
    dateCreated: new Date().toLocaleDateString(),
    status: i % 2 === 0 ? "Active" : "Inactive",
  }));
};

const TableThree = () => {
  const [mockData, setMockData] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBasis, setSearchBasis] = useState("name");
  const [UserDrawer, setUserDrawer] = useState(false);
  const [deleteDrawer, setDeleteDrawer] = useState(false);
  const [selected, setSelected] = useState({});
  const { direction } = useDirection();
  const { data: userList } = useQuery({
    queryKey: ["menu-list"],
    queryFn: usersFn,
  });

  useEffect(() => {
    const data = generateData(20);
    setMockData(data);
    setTotalItems(data.length);
  }, []);

  useEffect(() => {
    const totalPages = Math.ceil(totalItems / rowsPerPage);
    if (currentPage > totalPages) {
      setCurrentPage(totalPages > 0 ? totalPages : 1);
    }
  }, [totalItems, rowsPerPage, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const handleDeleteClick = (row: any) => {
    setDeleteDrawer(true);
    setSelected(row);
  };

  const filteredData = mockData.filter((item) => {
    return item[searchBasis].toLowerCase().includes(searchQuery.toLowerCase());
  });

  const toggleUserDrawer = (value: boolean) => {
    setUserDrawer(value);
  };

  const toggleDeleteDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      setDeleteDrawer(open);
    };

  const columns = [
    {
      name: "S No",
      selector: (row: any) => `${row.id}`,
      sortable: true,
      width: "80px",
    },
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
            onClick={() => console.log(`Edit item with ID: ${row.id}`)}
            className="text-blue-500 hover:text-blue-700"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
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
          <select
            value={searchBasis}
            onChange={(e) => setSearchBasis(e.target.value)}
            className="rounded border px-1 py-2 text-[12px] text-black outline-none"
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
          </select>
          <input
            type="text"
            placeholder={`Search by ${searchBasis}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded border p-1 text-[12px] text-black outline-none"
          />
          <Button
            name="Create User"
            type="submit"
            onClick={() => toggleUserDrawer(true)}
          />
          <Tooltip
            title="Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore natus sed rerum temporibus ab, molestiae fuga ut saepe eaque maxime."
            arrow
          >
            <button>
              <FaRegQuestionCircle />
            </button>
          </Tooltip>
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
            customStyles={{
              header: {
                style: {
                  fontSize: "12px",
                  minHeight: "30px",
                },
              },
              headRow: {
                style: {
                  fontSize: "12px",
                  minHeight: "30px",
                },
              },
              headCells: {
                style: {
                  fontWeight: 700,
                },
              },
              cells: {
                style: {
                  fontSize: "11px",
                  fontWeight: 500,
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
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
      <CreateUserDrawer
        direction={direction}
        isDrawerOpen={UserDrawer}
        toggleDrawer={toggleUserDrawer}
      />
      <DeleteDrawer
        direction={direction}
        isDrawerOpen={deleteDrawer}
        toggleDrawer={toggleDeleteDrawer}
        setDeleteDrawer={setDeleteDrawer}
        selected={selected}
        setSelected={setSelected}
      />
    </>
  );
};

export default TableThree;
