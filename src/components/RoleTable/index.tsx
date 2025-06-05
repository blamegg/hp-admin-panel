'use client'
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@/components/common/Button';
import { MdDelete, MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { Typography } from '@mui/material';
import { apiClient, ApiEndpoints } from '@/utility/api';
import {
  rolesFn,
  permissionsFn,
  createRoleFn,
  updateRoleFn,
  deleteRoleFn,
  menuListFn,
} from '@/utility/queryFetcher';
import { useDirection } from '@/context/DirectionContext';
import AddRoleDrawer from './AddRoleDrawer';
import EditRoleDrawer from './EditRoleDrawer';
import DeleteRolePopup from './DeleteRolePopup';
import ViewRoleDrawer from './ViewRoleDrawer';
import PermissionDrawer from './PermissionDrawer';
import { FaEye } from 'react-icons/fa';
import { toast } from 'sonner';

interface Column {
  id: 'Role' | 'Actions';
  label: string;
  minWidth?: number;
  align?: 'right';
}

const columns: readonly Column[] = [
  { id: 'Role', label: 'Role', minWidth: 170 },
  { id: 'Actions', label: 'Actions', minWidth: 100 },
];

export interface Data {
  _id: string;
  name: string;
  permissions: { _id: string; name: string }[];
}

interface RolesApiResponse {
  success: boolean;
  message: string;
  totalPages: number;
  totalDocument: number;
  pageNumber: number;
  limit: number;
  hasNext: boolean;
  data: Data[];
}

export default function Roles() {
  const [pageNumber, setPageNumber] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [currentRole, setCurrentRole] = React.useState<Data | null>(null);
  const [roles, setRoles] = React.useState<RolesApiResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [permissionsMenuList, setPermissionsMenuList] = React.useState<{ _id: string; name: string }[]>([]);
  const [totalDocument, setTotalDocument] = React.useState(0);

  const [isAddDrawerOpen, setIsAddDrawerOpen] = React.useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = React.useState(false);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = React.useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = React.useState(false);
  const [isPermissiondrawerOpen, setIsPermissionDrawerOpen] = React.useState(false);
  const [permissionDrawerRole, setPermissionDrawerRole] = React.useState<string | null>(null);

  const { direction } = useDirection();

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await rolesFn(pageNumber, limit);
      setRoles(response);
      setTotalDocument(response.totalDocument);
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

  console.log(permissionsMenuList)

  React.useEffect(() => {
    fetchRoles();
    fetchPermissionMenus();
  }, [pageNumber, limit]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPageNumber(newPage + 1);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(+event.target.value);
    setPageNumber(1);
  };

  const handleCreateRole = async (role: string): Promise<boolean> => {
    try {
      await createRoleFn({name: role});
      fetchRoles();
      toast.success("New Role created successfully");
      togglePermissionDrawer(true, role);
      return true;
    } catch (err: any) {
      console.error('Failed to add role:', err);
      toast.error(err.response.data.message)
      return false;
    }
  };

  const handleEditRole = async (role: string): Promise<boolean> => {
    if (!currentRole) {
      console.error('currentRole is null or undefined.');
      return false;
    }
    try {
      await updateRoleFn({name: role},currentRole._id);
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

  const togglePermissionDrawer = (value:boolean, role: string)=>{
    setIsPermissionDrawerOpen(value);
    if(role) setPermissionDrawerRole(role)
  }

  if (loading) return <Typography>Loading roles...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <div className='flex flex-col gap-3'>
      <div>
        <button
          onClick={() => togglePermissionDrawer(true)}
          // onClick={() => toggleAddDrawer(true)}
          className='px-2 py-1 rounded-md'
          style={{ backgroundColor: '#3b82f6', color: 'white' }}
        >Create Role</button>
      </div>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table sx={{ paddingX: "20px", paddingTop:"5px" }} stickyHeader aria-label="sticky table">
            <TableHead >
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{ minWidth: column.minWidth }}
                    sx={{ fontWeight: 'bold', color: '#333', fontSize: "12px" }}
                    align={column.align}
                    className='font-[12px]'
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {(roles?.data || []).map((row: Data) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row._id} sx={{ fontSize: "5px" }}>
                    <TableCell sx={{ fontSize: "10px" }}>{row.name}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => {
                          console.log('Edit button clicked. Row ID:', row._id);
                          setCurrentRole(row);
                          toggleEditDrawer(true);
                        }}
                        className='text-[#7747ff] p-1 rounded-md hover:bg-gray-100'
                      >
                        <CiEdit className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentRole(row);
                          toggleDeleteDrawer(true);
                        }}
                        className='text-red-500 p-1 rounded-md hover:bg-gray-100'
                      >
                        <MdDeleteOutline className='w-4 h-4 ml-2' />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentRole(row);
                          toggleViewDrawer(true);
                        }}
                        className="text-gray-500 p-1 rounded-md hover:bg-gray-100"
                      >
                        <FaEye className="w-4 h-4 ml-2" />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={totalDocument}
          rowsPerPage={limit}
          page={pageNumber - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <AddRoleDrawer
          direction={direction}
          isDrawerOpen={isAddDrawerOpen}
          toggleDrawer={toggleAddDrawer}
          onSave={handleCreateRole}
        />
        <EditRoleDrawer
          direction={direction}
          isDrawerOpen={isEditDrawerOpen}
          toggleDrawer={toggleEditDrawer}
          onSave={handleEditRole}
          currentRole={currentRole}
          permissionsList={permissionsMenuList}
        />
        <DeleteRolePopup
          isDrawerOpen={isDeleteDrawerOpen}
          toggleDrawer={toggleDeleteDrawer}
          onDelete={handleDeleteRole}
          selected={currentRole}
        />
        <ViewRoleDrawer
          direction={direction}
          isDrawerOpen={isViewDrawerOpen}
          toggleDrawer={toggleViewDrawer}
          selected={currentRole}
        />
        <PermissionDrawer
          isDrawerOpen={isPermissiondrawerOpen}
          toggleDrawer={togglePermissionDrawer}
          permissionsMenuList={permissionsMenuList}
          role={permissionDrawerRole}
        />
      </Paper>
    </div>
  );
}