"use client";
import { FaEye, FaRegQuestionCircle } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash } from "react-icons/fa";
import CustomPagination from "@/components/CustomPagination";
import { Tooltip } from "@mui/material";
import { useDirection } from "@/context/DirectionContext";
import CreateUserDrawer from "./CreateUserDrawer";
import Button from "@/components/common/Button";
import DeleteDrawer from "./DeleteDrawer";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { resetPasswordFn, usersFn } from "@/utility/queryFetcher";
import { formatTimestamp, toSentenceCase } from "@/utility/helper";
import EditDrawer from "./EditDrawer";
import ViewDrawer from "./UserTab/ViewDrawer";
import { usePathname } from "next/navigation";
import CreateBulkUserDrawer from "./CreateBulkUserDrawer";
import { TbLockOff } from "react-icons/tb";
import { toast } from "sonner";
import { useMenuList } from "@/hooks/useMenuList";
import { useUserPermissions, useHasPermission } from '@/hooks/useUserPermissions';
import useDebounce from "@/hooks/useDebounce";


const UserTable = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBasis, setSearchBasis] = useState("name");
  const [UserDrawer, setUserDrawer] = useState(false);
  const [bulkUserDrawer, setBulkUserDrawer] = useState(false);
  const [deleteDrawer, setDeleteDrawer] = useState(false);
  const [editDrawer, setEditDrawer] = useState(false);
  const [viewDrawer, setViewDrawer] = useState(false);
  const [selected, setSelected] = useState(null);
  const pathname = usePathname();
  const [showSearchBar, setShowSearchBar] = useState(false);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useMenuList();
  useUserPermissions();

  const hasPermission = useHasPermission();

  // Check if user has any action permissions
  const hasAnyActionPermission = (): boolean => {
    return hasPermission(toSentenceCase('Edit User')) || hasPermission(toSentenceCase('Delete User')) || hasPermission(toSentenceCase('View User Details'));
  };

  useEffect(() => {
    const path = pathname.toLowerCase();
    const shouldShow = path.includes('/users');
    setShowSearchBar(shouldShow);
  }, [pathname]);

  const { direction } = useDirection();
  const queryClient = useQueryClient();

  // Use server-side pagination with search
  const { data: userList, isLoading } = useQuery({
    queryKey: ["users", currentPage, rowsPerPage, debouncedSearchQuery, searchBasis],
    queryFn: async () => {
     
      const result = await usersFn(currentPage, rowsPerPage, debouncedSearchQuery, searchBasis);
      return result;
    },
    refetchOnWindowFocus: false,
    staleTime: 0, // Always consider data stale to ensure fresh fetches
    enabled: showSearchBar, // Only enable when on users page
  });


  // Update total items when data changes
  useEffect(() => {
    if (userList?.pagination) {
      setTotalItems(userList.pagination.totalCount || 0);
    }
  }, [userList]);


  // Reset to page 1 when rows per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, searchBasis]);

  // Handle search with debounce
  /* useEffect(() => {
    if (!showSearchBar) return; // Don't run if not on users page
    
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim() || searchBasis) {
        setCurrentPage(1);
        queryClient.invalidateQueries({ queryKey: ["users"] });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchBasis, queryClient, showSearchBar]); */

  // Auto-refresh to detect blocked users
  useEffect(() => {
    if (!showSearchBar) return; // Don't run if not on users page
    
    const intervalId = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(intervalId);
  }, [queryClient, showSearchBar]);

  // Cleanup queries when leaving users page
  useEffect(() => {
    if (!showSearchBar) {
      queryClient.cancelQueries({ queryKey: ["users"] });
    }
  }, [showSearchBar, queryClient]);

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
  const handleViewClick = (row: any) => {
    setViewDrawer(true);
  };

  const handleResetPassword = async (row: any) => {
    try {
      const response = await resetPasswordFn(row._id)
      toast.success(response?.message);
      // Refresh table data after successful password reset
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error: any) {
      toast.error(error.response.data.message)
    }
  }

  const toggleUserDrawer = (value: boolean) => {
    setUserDrawer(value);
  };
  const toggleBulkUserDrawer = (value: boolean) => {
    setBulkUserDrawer(value);
  };

  const toggleDeleteDrawer = (value: boolean) => {
    setDeleteDrawer(value);
  };

  const toggleEditDrawer = (value: boolean) => {
    setEditDrawer(value);
  };
  const toggleViewDrawer = (value: boolean) => {
    setViewDrawer(value);
  };

  const columns = [
    {
      name: "S No",
      selector: (row: any) =>
        (currentPage - 1) * rowsPerPage + (userList?.data?.indexOf(row) + 1),
      sortable: true,
      width: "75px",
    },
    {
      name: "Role",
      selector: (row: any) => row.role.name || "",
      sortable: true,
      width: "130px",
    },
    {
      name: "Email",
      selector: (row: any) => row.email || "",
      sortable: true,
      width: "160px",
    },
    {
      name: "Name",
      selector: (row: any) => row.name || "",
      sortable: true,
      width: "120px",
    },
    {
      name: "Mobile",
      selector: (row: any) => row.mobile || "",
      sortable: true,
      width: "100px",
    },
    {
      name: "Status",
      selector: (row: any) => {
        const isActive = row.status === true;
        const isLocked = row.isLocked;

        if (isLocked) {
          return (
            <div className="flex items-center gap-2">
              <span className="text-red-500 text-xs">Locked</span>
              <TbLockOff className="w-3 h-3 text-red-500" />
            </div>
          );
        }

        return isActive ? "Active" : "Inactive";
      },
      sortable: true,
      width: "90px",
    },
    {
      name: "Date Created",
      selector: (row: any) => formatTimestamp(row.createdAt),
      sortable: true,
      width: "150px",
    },
    ...(hasAnyActionPermission() ? [{
      name: "Actions",
      cell: (row: any) => (
        <div className="flex gap-3">
          {hasPermission(toSentenceCase('Edit User')) && (
            <Tooltip
              title="Edit user">
              <button
                onClick={() => {
                  setSelected(row);
                  toggleEditDrawer(true);
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                <FaEdit />
              </button>
            </Tooltip>
          )}


          {hasPermission(toSentenceCase('View User Details')) && (
            <Tooltip title="User details">
              <button
                onClick={() => {
                  handleViewClick(row);
                  toggleViewDrawer(true);
                }}
              >
                <FaEye className="w-3 h-3" />
              </button>

            </Tooltip>
          )}


          {hasPermission(toSentenceCase('Delete User')) && (
            <Tooltip title="Delete user">

              <button
                onClick={() => handleDeleteClick(row)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash className="text-danger" />
              </button>
            </Tooltip>

          )}

          {hasPermission(toSentenceCase('Reset Password')) && (
            <Tooltip title="Reset Password">

              <button
                onClick={() => {
                  handleResetPassword(row);
                }}
              >
                {row.isLocked && <TbLockOff className="w-4 h-4 text-danger" />}

              </button>
            </Tooltip>

          )}

        </div>
      ),
      width: "120px"
    }] : []),
  ];

  return (
    <>
      <div className="custom_tbl_container h-[74vh]  w-[350px] md:w-full">
        {
          showSearchBar && (
            <div className=" grid grid-cols-2 md:flex items-center gap-4">
              {hasPermission(toSentenceCase('View All Users')) && (
                <>
                  <select
                    value={searchBasis}
                    onChange={(e) => setSearchBasis(e.target.value)}
                    className="rounded bg-[#eff4fb] border  py-2 px-2 text-[12px] text-black outline-none dark:bg-boxdark dark:text-bodydark"

                  >
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                    <option value="mobile">Mobile</option>
                  </select>
                  <input
                    type="text"
                    placeholder={`Search by ${searchBasis}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        setCurrentPage(1);
                        queryClient.invalidateQueries({ queryKey: ["users"] });
                      }
                    }}
                    className="rounded bg-[#eff4fb] border  p-1 text-[12px] text-black outline-none dark:bg-boxdark dark:text-bodydark"
                  />
                </>
              )}
              {hasPermission(toSentenceCase('Create User')) && (
                <Button
                  name="Create User"
                  type="submit"
                  onClick={() => toggleUserDrawer(true)}
                  className="w-full md:w-auto bg-primary"
                />
              )}
              {hasPermission(toSentenceCase('Create User')) && (
                <Button
                  name="Create Bulk users"
                  type="submit"
                  onClick={() => toggleBulkUserDrawer(true)}
                  className="w-full md:w-auto bg-primary"
                />
              )}
              {hasPermission(toSentenceCase('View All Users')) && (
                <Tooltip
                  title="Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore natus sed rerum temporibus ab, molestiae fuga ut saepe eaque maxime."
                  arrow
                  className="hidden md:block"
                >
                  <button>
                    <FaRegQuestionCircle />
                  </button>
                </Tooltip>
              )}
            </div>
          )
        }


        <div className="mt-5 overflow-x-auto ">

          {/* {hasPermission('View All Users') && ( */}
            <>
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                 <p>Loading...</p>
                </div>
              ) : (
                <>
                  <div className="max-h-[59vh] overflow-scroll">
                    <DataTable
                      columns={columns}
                      data={userList?.data || []}
                      pagination={false}
                      className="custom_tbl "
                      customStyles={{
                        header: {
                          style: {
                            fontSize: "12px",
                            minHeight: "30px",
                            backgroundColor: "#F9FAFB", // Light mode header background
                            color: "#1C243F", // Light mode header text
                          },
                        },
                        headRow: {
                          style: {
                            fontSize: "12px",
                            minHeight: "30px",
                            backgroundColor: "#F9FAFB", // Light mode header row background
                            borderBottomWidth: "1px",
                            borderBottomColor: "#E2E8F0", // stroke
                          },
                        },
                        headCells: {
                          style: {
                            fontWeight: 700,
                            color: "#1C243F", // Light mode header cells text
                            backgroundColor: "#F9FAFB", // Light mode header cells background
                          },
                        },
                        cells: {
                          style: {
                            fontSize: "11px",
                            fontWeight: 500,
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                            height: "27px",
                            color: "#1C243F", // Light mode cell text
                            backgroundColor: "#FFFFFF", // Light mode cell background
                          },
                        },
                        rows: {
                          style: {
                            fontSize: "11px",
                            minHeight: "27px",
                            "&:not(:last-of-type)": {
                              borderBottomStyle: "solid",
                              borderBottomWidth: "1px",
                              borderBottomColor: "#E2E8F0", // stroke
                            },
                            backgroundColor: "#FFFFFF", // Light mode row background
                            color: "#1C243F", // Light mode row text
                          },
                          highlightOnHoverStyle: {
                            backgroundColor: "#F7F9FC", // gray-2
                            color: "#1C243F",
                            cursor: "pointer",
                          },
                        },
                      }}
                    />
                  </div>


                  {/* Custom Pagination */}
                  <CustomPagination
                    rowsPerPage={rowsPerPage}
                    currentPage={currentPage}
                    rowCount={userList?.pagination.totalCount || 0}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handleRowsPerPageChange}
                  />
                </>
              )}
            </>
          {/* )} */}
        </div>
      </div>

      {UserDrawer && (
        <CreateUserDrawer
          direction={direction}
          isDrawerOpen={UserDrawer}
          toggleDrawer={toggleUserDrawer}
        />
      )}
      {editDrawer && (
        <EditDrawer
          direction={direction}
          isDrawerOpen={editDrawer}
          toggleDrawer={toggleEditDrawer}
          selected={selected}
          setSelected={setSelected}
        />
      )}
      {deleteDrawer && (
        <DeleteDrawer
          direction={direction}
          isDrawerOpen={deleteDrawer}
          toggleDrawer={toggleDeleteDrawer}
          setDeleteDrawer={setDeleteDrawer}
          selected={selected}
          setSelected={setSelected}
        />
      )}
      {viewDrawer && (
        <ViewDrawer
          direction={direction}
          isDrawerOpen={viewDrawer}
          toggleDrawer={toggleViewDrawer}
          selected={selected}
          setSelected={setSelected}
        />
      )}
      {bulkUserDrawer && (
        <CreateBulkUserDrawer
          direction={direction}
          isDrawerOpen={bulkUserDrawer}
          toggleDrawer={toggleBulkUserDrawer}
        />
      )}
    </>
  );
};

export default UserTable;
