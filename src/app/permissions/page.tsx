'use client'
import React, { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from '@mui/material';
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
// You will need to implement these API functions in src/utility/queryFetcher.ts
import { permissionsFn, createPermissionFn, updatePermissionFn, deletePermissionFn, menuListFn } from '@/utility/queryFetcher';
import EditPermissionModal from "./EditPermissionModal";
import AddPermissionModal from "./AddPermissionModal";


// Define interfaces for your permission data and API response
interface Permission {
  _id: string;
  name: string;
  menuId: string;
  subMenuId: string | null;
  isActive: boolean;
}

interface PermissionsApiResponse {
  success: boolean;
  message: string;
  totalPages: number;
  totalDocument: number;
  pageNumber: number;
  limit: number;
  hasNext: boolean;
  data: Permission[];
}

const PermissionsPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPermission, setCurrentPermission] = useState<Permission | null>(null);
  const [permissions, setPermissions] = useState<PermissionsApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [limit, setLimit] = React.useState(10);
  const [totalDocument, setTotalDocument] = useState(0);
  const [menus, setMenus] = useState([])

  // Function to fetch permissions
  const fetchPermissions = async () => {
    setLoading(true);
    setError(null);
    try {
      // Assuming permissionsFn now accepts page and limit for pagination
      const response = await permissionsFn(pageNumber, limit);
      setPermissions(response);
      setTotalDocument(response.totalDocument);
    } catch (err: any) {
      console.error('Failed to fetch permissions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch permissions on component mount and when page/limit changes
  useEffect(() => {
    fetchPermissions();
  }, [pageNumber, limit]);

  // Handlers for CRUD operations (you'll implement the actual API calls)
  const handleAddPermission = async (name: string, menuId: string, subMenuId: string | null, isActive: boolean) => {
    try {
      await createPermissionFn({ name, menuId, subMenuId, isActive }); // This function needs to be implemented
      fetchPermissions(); // Refresh the list after adding
      setIsAddModalOpen(false); // Close modal
    } catch (err: any) {
      console.error('Failed to add permission:', err);
      // Handle error (e.g., show a toast notification)
    }
  };

  const handleEditPermission = async (name: string, menuId: string, subMenuId: string | null, isActive: boolean, id: string) => {
    try {
      await updatePermissionFn({ name, menuId, subMenuId, isActive }, id); // This function needs to be implemented
      fetchPermissions(); // Refresh the list after editing
      setIsEditModalOpen(false); // Close modal
    } catch (err: any) {
      console.error('Failed to edit permission:', err);
      // Handle error
    }
  };

  const handleDeletePermission = async (id: string) => {
    try {
      await deletePermissionFn(id); // This function needs to be implemented
      fetchPermissions(); // Refresh the list after deleting
    } catch (err: any) {
      console.error('Failed to delete permission:', err);
      // Handle error
    }
  };

  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPageNumber(newPage + 1);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(+event.target.value);
    setPageNumber(1); // Reset to first page when rows per page changes
  };



  if (loading) return <Typography>Loading permissions...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;


  return (
    <DefaultLayout>
      <Breadcrumb pageName="Permissions" />

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <div className="text-right mt-1 px-5">
          <button onClick={() => setIsAddModalOpen(true)} className='bg-[#7747ff] text-white px-2 py-[2px] rounded-md'>Add Permission</button>
        </div>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table sx={{paddingX:"20px", paddingTop:"10px"}} stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell style={{ minWidth: 170 }} sx={{ fontWeight: 'bold', color: '#333', backgroundColor: '#f8f2f1' }}>Permission Name</TableCell>
                <TableCell style={{ minWidth: 100 }} align="right" sx={{ fontWeight: 'bold', color: '#333', backgroundColor: '#f8f2f1' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(permissions?.data || []).map((permission: Permission) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={permission._id}>
                  <TableCell>{permission.name}</TableCell>
                  <TableCell>{permission.menuId} - {permission.subMenuId} - {permission.isActive ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell align="right">
                    <button
                      onClick={() => {
                        setCurrentPermission(permission);
                        setIsEditModalOpen(true);
                      }}
                      className='text-[#7747ff] p-1 rounded-md hover:bg-gray-100'
                    >
                      <CiEdit className='w-5 h-5' />
                    </button>
                    <button
                      onClick={() => handleDeletePermission(permission._id)}
                      className='text-red-500 p-1 rounded-md hover:bg-gray-100'
                    >
                      <MdDeleteOutline className='w-5 h-5 ml-2' />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
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
      </Paper>

      <AddPermissionModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddPermission}
      />
      <EditPermissionModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditPermission}
        currentPermission={currentPermission}
      />
    </DefaultLayout>
  );
};

export default PermissionsPage;