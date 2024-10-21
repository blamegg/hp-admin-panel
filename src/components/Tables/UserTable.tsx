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
import { formatTime, formatTimestamp } from "@/utility/helper";
import EditDrawer from "./EditDrawer";

const UserTable = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBasis, setSearchBasis] = useState("name");
  const [UserDrawer, setUserDrawer] = useState(false);
  const [deleteDrawer, setDeleteDrawer] = useState(false);
  const [editDrawer, setEditDrawer] = useState(false);
  const [selected, setSelected] = useState(null);
  const { direction } = useDirection();
  const { data: userList } = useQuery({
    queryKey: ["menu-list"],
    queryFn: usersFn,
  });

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

  const toggleUserDrawer = (value: boolean) => {
    setUserDrawer(value);
  };

  const toggleDeleteDrawer = (value: boolean) => {
    setDeleteDrawer(value);
  };

  const toggleEditDrawer = (value: boolean) => {
    setEditDrawer(value);
  };

  const columns = [
    {
      name: "S No",
      selector: (row: any, index: number) => index + 1,
      sortable: true,
      width: "80px",
    },
    {
      name: "Email",
      selector: (row: any) => row.email || "",
      sortable: true,
      width: "200px",
    },
    {
      name: "Name",
      selector: (row: any) => row.name || "",
      sortable: true,
      width: "200px",
    },
    {
      name: "Mobile",
      selector: (row: any) => row.mobile || "",
      sortable: true,
      width: "200px",
    },
    {
      name: "Status",
      selector: (row: any) => (row.status === true ? "Active" : "Inactive"),
      sortable: true,
      width: "100px",
    },
    {
      name: "Date Created",
      selector: (row: any) => formatTimestamp(row.createdAt),
      sortable: true,
      width: "150px",
    },
    {
      name: "Actions",
      cell: (row: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelected(row);
              toggleEditDrawer(true);
            }}
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
            data={userList?.data}
            pagination
            paginationPerPage={rowsPerPage}
            paginationTotalRows={userList?.data?.length}
            paginationComponent={() => (
              <CustomPagination
                rowsPerPage={rowsPerPage}
                currentPage={currentPage}
                rowCount={userList?.data?.length}
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
      <EditDrawer
        direction={direction}
        isDrawerOpen={editDrawer}
        toggleDrawer={toggleEditDrawer}
        selected={selected}
        setSelected={setSelected}
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

export default UserTable;
