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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { MdDelete, MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import AddRoleModal from "./AddRoleModal";
import EditRoleModal from "./EditRoleModal";
import { Typography } from '@mui/material';
import { apiClient, ApiEndpoints } from '@/utility/api';
import {
  rolesFn,
  permissionsFn,
  createRoleFn,
  updateRoleFn,
  deleteRoleFn,
} from '@/utility/queryFetcher';

interface Column {
  id: 'Role' | 'Permission' | 'Actions';
  label: string;
  minWidth?: number;
  align?: 'right';
}

const columns: readonly Column[] = [
  { id: 'Role', label: 'Role', minWidth: 170 },
  { id: 'Permission', label: 'Permission', minWidth: 300 },
  { id: 'Actions', label: 'Actions', minWidth: 100 },
];

export interface Data {
  id: string;
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

export default function RoleResponsibility() {
  const [pageNumber, setPageNumber] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [currentRole, setCurrentRole] = React.useState<Data | null>(null);
  const [roles, setRoles] = React.useState<RolesApiResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [permissionsList, setPermissionsList] = React.useState<{ _id: string; name: string }[]>([]);
  const [totalDocument, setTotalDocument] = React.useState(0);
  


  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching roles with page:', pageNumber, 'limit:', limit);
      const response = await rolesFn(pageNumber, limit);
      setRoles(response);
      setTotalDocument(response.totalDocument);
      console.log('Fetched roles data:', response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    setError(null);
    try {
      const response = await permissionsFn(pageNumber, limit);
      setPermissionsList(response.data);
    } catch (err: any) {
      console.error('Failed to fetch permissions:', err);
    }
  };

  React.useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, [pageNumber, limit]);
 

  const handleChangePage = (event: unknown, newPage: number) => {
    setPageNumber(newPage + 1);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(+event.target.value);
    setPageNumber(1);
  };

  const handleAddRole = async (role: string, permissions: string[]) => {
    try {
      const selectedPermissionObjects = permissionsList.filter(p => permissions.includes(p.name));
      await createRoleFn({
        name: role,
        permissions: selectedPermissionObjects,
      });
      fetchRoles();
    } catch (err: any) {
      console.error('Failed to add role:', err);
      setError(err.message);
    }
  };

  const handleEditRole = async (role: string, permissions: string[]) => {
    if (!currentRole) return;
    try {
      const selectedPermissionObjects = permissionsList.filter(p => permissions.includes(p.name));
      await updateRoleFn(
        {
          name: role,
          permissions: selectedPermissionObjects,
        },
        currentRole.id,
      );
      fetchRoles();
    } catch (err: any) {
      console.error('Failed to edit role:', err);
      setError(err.message);
    }
  };

  const handleDeleteRole = async (id: string) => {
    try {
      await deleteRoleFn(id);
      fetchRoles();
    } catch (err: any) {
      console.error('Failed to delete role:', err);
      setError(err.message);
    }
  };

  console.log(roles);
  if (loading) return <Typography>Loading roles...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <div className="text-right mt-1 px-5">
        <button onClick={() => setIsModalOpen(true)} className='bg-[#7747ff] text-white px-2 py-[2px] rounded-md'>Add Role</button>
      </div>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table sx={{ paddingX: "20px", paddingTop:"5px" }} stickyHeader aria-label="sticky table">
          <TableHead >
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{ minWidth: column.minWidth }}
                  sx={{ fontWeight: 'bold', color: '#333', backgroundColor: '#f8f2f1' }}
                  align={column.align}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(roles?.data || []).map((row: Data) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.permissions.map((permission: { name: string }) => permission.name).join(', ')}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => {
                          setCurrentRole(row);
                          setIsEditModalOpen(true);
                        }}
                        className='text-[#7747ff] p-1 rounded-md hover:bg-gray-100'
                      >
                        <CiEdit className='w-5 h-5' />
                      </button>
                      <button
                        onClick={() => handleDeleteRole(row.id)}
                        className='text-red-500 p-1 rounded-md hover:bg-gray-100'
                      >
                        <MdDeleteOutline className='w-5 h-5 ml-2' />
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

      <AddRoleModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddRole}
        permissionsList={permissionsList}
      />
      <EditRoleModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditRole}
        currentRole={currentRole}
        permissionsList={permissionsList}
      />
    </Paper>
  );
}