'use client'
import * as React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { setSelectedRole, clearSelectedRole, fetchRoleFn } from "@/redux/slice/roleSlice";

import DataTable from "react-data-table-component";
import { Typography } from '@mui/material';
import {
  updateRoleFn,
  deleteRoleFn,
  menuListFn,
  RolesInterFace,
  CurrentRoleDataInterFace,
  RolesInterFace2,
} from '@/utility/queryFetcher';
import { useDirection } from '@/context/DirectionContext';
import EditRoleDrawer from './EditRoleDrawer';
import ViewRoleDrawer from './ViewRoleDrawer';
import { FaEye, FaEdit, FaTrash, FaRegQuestionCircle } from 'react-icons/fa';
import { toast } from 'sonner';
import { Tooltip } from "@mui/material";
import Button from "@/components/common/Button";
import CreateRole from './CreateRole';
import DeleteRole from './DeleteRole';
import CustomPagination from '../CustomPagination';
import { usePathname } from 'next/navigation';

export default function Roles() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const dispatch = useDispatch<AppDispatch>();
  const selectedRole = useSelector((state: RootState) => state.role.selectedRole);
  const allRoles = useSelector((state: RootState) => state.role.allRoles);
  const totalDocuments = useSelector((state: RootState) => state.role.totalDocuments);
  const pathname = usePathname();
  const isOnRolesPage = pathname.toLowerCase().includes('/roles');

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [permissionsMenuList, setPermissionsMenuList] = React.useState<RolesInterFace2 | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchBasis, setSearchBasis] = React.useState("name");

  const [isAddDrawerOpen, setIsAddDrawerOpen] = React.useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = React.useState(false);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = React.useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = React.useState(false);
  const [isPermissiondrawerOpen, setIsPermissionDrawerOpen] = React.useState(false);

  const { direction } = useDirection();
  const permissions = useSelector((state: RootState) => state?.authReducer.permissions);

  
  const hasPermission = (permissionKey: string): boolean => {
    return permissions.includes(permissionKey);
  };

  const hasAnyActionPermission = ()=>{
    return hasPermission('View Role Details') || hasPermission('Delete Role') || hasPermission('Edit Role')
  }

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      dispatch(fetchRoleFn({ page: currentPage, limit: rowsPerPage }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const fetchPermissionMenus = async () => {
    setError(null);
    try {
      const response = await menuListFn();
      setPermissionsMenuList(response);
    } catch (err: any) {
      console.error('Failed to fetch permissions:', err);
    }
  };

  React.useEffect(() => {
    if (isOnRolesPage) {
      fetchRoles();
    }
  }, [currentPage, rowsPerPage, isOnRolesPage]);

  // Cleanup when leaving roles page
  React.useEffect(() => {
    if (!isOnRolesPage) {
      setLoading(false);
      setError(null);
    }
  }, [isOnRolesPage]);

  React.useEffect(() => {
    const totalPages = Math.ceil(totalDocuments / rowsPerPage);
    if (currentPage > totalPages) {
      setCurrentPage(totalPages > 0 ? totalPages : 1);
    }
  }, [totalDocuments, rowsPerPage, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const handleEditRole = async (role: string): Promise<boolean> => {
    if (!selectedRole) {
      console.error('selectedRole is null or undefined.');
      return false;
    }
    try {
      await updateRoleFn({ name: role }, selectedRole._id);
      fetchRoles();
      toast.success("Role updated successfully")
      return true;
    } catch (err: any) {
      console.error('Failed to edit role:', err);
      toast.error(err.response.data.message);
      return false;
    }
  };


  const handleDeleteRole = async (id: string) => {
    try {
      await deleteRoleFn(id);
      toast.success("Role Deleted Successfully")
      fetchRoles();
    } catch (err: any) {
      console.error('Failed to delete role:', err);
      toast.error("Failed to Delete Role")
      setError(err.message);
    }
  };

  const toggleAddDrawer = (value: boolean) => {
    setIsAddDrawerOpen(value);
    if (!value) dispatch(clearSelectedRole());
  };

  const toggleEditDrawer = (value: boolean) => {
    setIsEditDrawerOpen(value);
    if (value) {
      // Fetch permission menus only when edit drawer is opened
      fetchPermissionMenus();
    }
    if (!value) dispatch(clearSelectedRole());
  };

  const toggleDeleteDrawer = (value: boolean) => {
    setIsDeleteDrawerOpen(value);
    if (!value) dispatch(clearSelectedRole());
  };

  const toggleViewDrawer = (value: boolean) => {
    setIsViewDrawerOpen(value);
    if (!value) dispatch(clearSelectedRole());
  };

  const togglePermissionDrawer = (value: boolean, role?: CurrentRoleDataInterFace | RolesInterFace | null) => {
    setIsPermissionDrawerOpen(value);
    if (value && role) {
      dispatch(setSelectedRole(role as CurrentRoleDataInterFace));
    } else if (!value) {
      dispatch(clearSelectedRole());
    }
  };

  const handleDeleteClick = (row: CurrentRoleDataInterFace) => {
    dispatch(setSelectedRole(row));
    setIsDeleteDrawerOpen(true);
  };

  const handleViewClick = (row: CurrentRoleDataInterFace) => {
    dispatch(setSelectedRole(row));
    setIsViewDrawerOpen(true);
  };


  const columns = [
    {
      name: "S No",
      selector: (row: CurrentRoleDataInterFace) =>
        (currentPage - 1) * rowsPerPage + ((allRoles?.indexOf(row) ?? -1) + 1),
      sortable: true,
      width: "80px",
    },
    {
      name: "Role",
      selector: (row: CurrentRoleDataInterFace) => row.name || "",
      sortable: true,
      width: "200px",
    },
    {
      name: "Rank",
      selector: (row: CurrentRoleDataInterFace) => row.rank || "",
      sortable: true,
      width: "200px",
    },
    ...(hasAnyActionPermission() ? [
         {
      name: "Actions",
      cell: (row: CurrentRoleDataInterFace) => (
        <div className="flex gap-3">
          {hasPermission('Edit Role') && (
            <button
              onClick={() => {
                dispatch(setSelectedRole(row));
                toggleEditDrawer(true);
              }}
              className="text-blue-500 hover:text-blue-700"
            >
              <FaEdit />
            </button>
          )}
          {hasPermission('Delete Role') && (
            <button
              onClick={() => handleDeleteClick(row)}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
          )}
          {hasPermission('View Role Details') && (
            <button
              onClick={() => {
                handleViewClick(row);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaEye />
            </button>
          )}
         
        </div>
      ),
      width: "160px",
    },
    ]: [])
  ];


  if (loading) return <Typography>Loading roles...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <div className="custom_tbl_container h-[90vh]">
      <div className="flex items-center gap-4">
        <select
          value={searchBasis}
          onChange={(e) => setSearchBasis(e.target.value)}
          className="rounded bg-[#eff4fb] border px-1 py-2 text-[12px] text-black outline-none dark:bg-boxdark dark:text-bodydark"
        >
          <option value="name">Role Name</option>
        </select>
        <input
          type="text"
          placeholder={`Search by ${searchBasis}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded bg-[#eff4fb] border  p-1 text-[12px] text-black outline-none dark:bg-boxdark dark:text-bodydark"
        />
        {hasPermission('Create Role') && (
          <Button
          name="Create Role"
          type="submit"
          onClick={() => toggleAddDrawer(true)}
          className='bg-primary'
          />
         )} 
        <Tooltip
          title="Roles define what users can do and see within the system."
          arrow
        >
          <button>
            <FaRegQuestionCircle />
          </button>
        </Tooltip>
      </div>


      <div className="mt-5 overflow-x-auto ">
        <DataTable
          columns={columns}
          data={allRoles?.filter((role: CurrentRoleDataInterFace) =>
            role.name.toLowerCase().includes(searchQuery.toLowerCase())
          ) || []}
          pagination
          paginationPerPage={rowsPerPage}
          paginationTotalRows={totalDocuments}
          paginationComponent={() => (
            <CustomPagination
              rowsPerPage={rowsPerPage}
              currentPage={currentPage}
              rowCount={totalDocuments}
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
                backgroundColor: "#F9FAFB",
                color: "#1C243F", 
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

      <CreateRole
        isDrawerOpen={isAddDrawerOpen}
        toggleDrawer={toggleAddDrawer}
        fetchRoles={fetchRoles}
        togglePermissionDrawer={togglePermissionDrawer}
        direction={direction}
      />

      <EditRoleDrawer
        isDrawerOpen={isEditDrawerOpen}
        toggleDrawer={toggleEditDrawer}
        onSave={handleEditRole}
        selectedRole={selectedRole}
        direction={direction}
        permissionsMenuList={permissionsMenuList}
        fetchRoles={fetchRoles}
      />

      <DeleteRole
        isDrawerOpen={isDeleteDrawerOpen}
        toggleDrawer={toggleDeleteDrawer}
        onDelete={handleDeleteRole}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        direction={direction}
        fetchRoles={fetchRoles}
      />

      <ViewRoleDrawer
        isDrawerOpen={isViewDrawerOpen}
        toggleDrawer={toggleViewDrawer}
        selectedRole={selectedRole}
        direction={direction}
      />
    </div>
  );
}