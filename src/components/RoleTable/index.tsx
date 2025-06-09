'use client'
import * as React from 'react';
import DataTable from "react-data-table-component";
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { Typography } from '@mui/material';
import {
  rolesFn,
  createRoleFn,
  updateRoleFn,
  deleteRoleFn,
  menuListFn,
  mainMenuInterface,
  RolesInterFace,
  CurrentRoleDataInterFace,
  menuDataInterface,
  RolesInterFace2,
} from '@/utility/queryFetcher';
import { useDirection } from '@/context/DirectionContext';
import AddRoleDrawer from './CreateRole';
import EditRoleDrawer from './EditRoleDrawer';
import DeleteRolePopup from './DeleteRolePopup';
import ViewRoleDrawer from './ViewRoleDrawer';
import PermissionDrawer from './PermissionDrawer';
import { FaEye, FaEdit, FaTrash, FaRegQuestionCircle } from 'react-icons/fa';
import { toast } from 'sonner';
import { Tooltip } from "@mui/material";
import Button from "@/components/common/Button";
import CustomPagination from '../CustomPagination';
import CreateRole from './CreateRole';
import EditRole from './EditRoleDrawer';

interface Column {
  id: 'Role' | 'Actions';
  label: string;
  minWidth?: number;
  align?: 'right';
}

// const columns: readonly Column[] = [
//   { id: 'Role', label: 'Role' },
//   { id: 'Actions', label: 'Actions' },
// ];



export default function Roles() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedRole, setSelectedRole] = React.useState<CurrentRoleDataInterFace | null>(null);
  const [roles, setRoles] = React.useState<RolesInterFace | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [permissionsMenuList, setPermissionsMenuList] = React.useState<menuDataInterface[]>([]);
  const [totalDocument, setTotalDocument] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchBasis, setSearchBasis] = React.useState("name");

  const [isAddDrawerOpen, setIsAddDrawerOpen] = React.useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = React.useState(false);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = React.useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = React.useState(false);
  const [isPermissiondrawerOpen, setIsPermissionDrawerOpen] = React.useState(false);
  const [permissionDrawerRole, setPermissionDrawerRole] = React.useState<CurrentRoleDataInterFace | null>(null);

  const { direction } = useDirection();


  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await rolesFn(currentPage, rowsPerPage);
      setRoles(response);
      setTotalDocument(response.pagination.total);
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
    fetchRoles();
    fetchPermissionMenus();
  }, [currentPage, rowsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const handleCreateRole = async (role: string): Promise<boolean> => {
    try {
      const currentRoleData = await createRoleFn({ name: role });
      fetchRoles();
      toast.success("New Role created successfully");
      togglePermissionDrawer(true, currentRoleData);
      return true;
    } catch (err: any) {
      console.error('Failed to add role:', err);
      toast.error(err.response.data.message)
      return false;
    }
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
  };

  const toggleEditDrawer = (value: boolean) => {
    setIsEditDrawerOpen(value);
  };

  const toggleDeleteDrawer = (value: boolean) => {
    setIsDeleteDrawerOpen(value);
  };

  const toggleViewDrawer = (value: boolean) => {
    setIsViewDrawerOpen(value);
  };

  const togglePermissionDrawer = (value: boolean, role?: CurrentRoleDataInterFace | RolesInterFace2 | null) => {
    setIsPermissionDrawerOpen(value);
    if (role) setPermissionDrawerRole(role)
  }

  const handleDeleteClick = (row: CurrentRoleDataInterFace) => {
    setIsDeleteDrawerOpen(true);
    setSelectedRole(row);
  };

  const handleViewClick = (row: CurrentRoleDataInterFace) => {
    setIsViewDrawerOpen(true);
    setSelectedRole(row);
  };


  const columns = [
    {
      name: "S No",
      selector: (row: CurrentRoleDataInterFace) =>
        (currentPage - 1) * rowsPerPage + (roles?.data.indexOf(row) + 1),
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
      name: "Actions",
      cell: (row: CurrentRoleDataInterFace) => (
        <div className="flex gap-3">
          <button
            onClick={() => {
              setSelectedRole(row);
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
          <button
            onClick={() => {
              handleViewClick(row);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaEye />
          </button>
        </div>
      ),
      width: "160px",
    },
  ];


  console.log(roles)

  if (loading) return <Typography>Loading roles...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <div className="custom_tbl_container h-[90vh]">
        <div className="flex items-center gap-4">
          <select
            value={searchBasis}
            onChange={(e) => setSearchBasis(e.target.value)}
            className="rounded border px-1 py-2 text-[12px] text-black outline-none dark:bg-boxdark dark:text-bodydark"
          >
            <option value="name">Role Name</option>
          </select>
          <input
            type="text"
            placeholder={`Search by ${searchBasis}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded border p-1 text-[12px] text-black outline-none dark:bg-boxdark dark:text-bodydark"
          />
          <Button
            name="Create Role"
            type="submit"
            onClick={() => toggleAddDrawer(true)}
          />
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
            data={roles?.data.filter((role: CurrentRoleDataInterFace) =>
              role.name.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            pagination
            paginationPerPage={rowsPerPage}
            paginationTotalRows={totalDocument}
            paginationComponent={() => (
              <CustomPagination
                rowsPerPage={rowsPerPage}
                currentPage={currentPage}
                rowCount={totalDocument} // totalDocument holds the total count of roles
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
                backgroundColor: "#F9FAFB", // Light mode header background
                color: "#1C243F", // Light mode header text
              },
            },
            headRow: {
              style: {
                fontSize: "12px",
                minHeight: "30px",
                backgroundColor: "#F9FAFB",
                borderBottomWidth: "1px",
                borderBottomColor: "#E2E8F0",
              },
            },
            headCells: {
              style: {
                fontWeight: 700,
                color: "#1C243F",
                backgroundColor: "#F9FAFB",
              },
            },
            cells: {
              style: {
                fontSize: "11px",
                fontWeight: 500,
                wordBreak: "break-word",
                overflowWrap: "break-word",
                height: "27px",
                color: "#1C243F",
                backgroundColor: "#FFFFFF",
              },
            },
            rows: {
              style: {
                fontSize: "11px",
                minHeight: "27px",
                "&:not(:last-of-type)": {
                  borderBottomStyle: "solid",
                  borderBottomWidth: "1px",
                  borderBottomColor: "#E2E8F0",
                },
                backgroundColor: "#FFFFFF",
                color: "#1C243F",
              },
              highlightOnHoverStyle: {
                backgroundColor: "#F7F9FC",
                color: "#1C243F",
                cursor: "pointer",
              },
            },
          }}
          />
        </div>

        <CreateRole
          direction={direction}
          isDrawerOpen={isAddDrawerOpen}
          toggleDrawer={toggleAddDrawer}
          handleCreateRole={handleCreateRole}
          fetchRoles={fetchRoles}
          togglePermissionDrawer={togglePermissionDrawer}
        />

        <EditRole
          direction={direction}
          isDrawerOpen={isEditDrawerOpen}
          toggleDrawer={toggleEditDrawer}
          handleEditRole={handleEditRole}
          selectedRole={selectedRole}
          permissionsMenuList={permissionsMenuList}
        />

        <DeleteRolePopup
          isDrawerOpen={isDeleteDrawerOpen}
          toggleDrawer={toggleDeleteDrawer}
          onDelete={handleDeleteRole}
          selectedRole={selectedRole}
        />

        <ViewRoleDrawer
          direction={direction}
          isDrawerOpen={isViewDrawerOpen}
          toggleDrawer={toggleViewDrawer}
          selectedRole={selectedRole}
          />

       

    </div>
  );
}