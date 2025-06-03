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
import { MdDelete, MdDeleteOutline, MdClose } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createRoleFn, fetchPermissionsFn, fetchPaginatedRolesFn, deleteRoleFn, updateRoleFn } from "@/utility/queryFetcher";
import { toast } from "react-toastify";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

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

interface Data {
  id: number;
  role: string;
  Permission: string;
}

export default function RoleResponsibility() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [roleToDelete, setRoleToDelete] = React.useState<string | null>(null);
  const [openUpdateDialog, setOpenUpdateDialog] = React.useState(false);
  const [roleToUpdate, setRoleToUpdate] = React.useState<{ _id: string; name: string; permissions: any[] } | null>(null);

  const { register, handleSubmit, reset, control } = useForm<{ name: string, permission_id: string[] }>();
  const queryClient = useQueryClient();

  const createRoleMutation = useMutation({
    mutationFn: (payload: { name: string, permission_id: string[] }) => createRoleFn(payload),
    onSuccess: () => {
      toast.success("Role created successfully!");
      handleClose();
      reset();
      queryClient.invalidateQueries({ queryKey: ['roles'] }); // Invalidate roles query to refetch data
      queryClient.invalidateQueries({ queryKey: ['paginatedRoles'] }); // Invalidate paginated roles query to refetch data
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create role.");
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (id: string) => deleteRoleFn(id),
    onSuccess: () => {
      toast.success("Role deleted successfully!");
      handleCloseDeleteDialog();
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["paginatedRoles"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete role.");
    },
  });

  const { data: permissionsData, error: permissionsError, isError: isPermissionsError } = useQuery({
    queryKey: ['permissions'],
    queryFn: fetchPermissionsFn,
  });

  const { data: paginatedRolesData, isLoading: isPaginatedRolesLoading, isError: isPaginatedRolesError, error: paginatedRolesError } = useQuery({
    queryKey: ['paginatedRoles', page, rowsPerPage],
    queryFn: () => fetchPaginatedRolesFn(page + 1, rowsPerPage), // page is 0-indexed, API expects 1-indexed
    placeholderData: (previousData) => previousData,
  });

  React.useEffect(() => {
    if (isPermissionsError) {
      console.error("Error fetching permissions:", permissionsError);
      toast.error("Failed to fetch permissions.");
    }
  }, [isPermissionsError, permissionsError]);

  React.useEffect(() => {
    if (isPaginatedRolesError) {
      console.error("Error fetching paginated roles:", paginatedRolesError);
      toast.error("Failed to fetch roles.");
    }
  }, [isPaginatedRolesError, paginatedRolesError]);

  // console.log("Permissions data: ", permissionsData);
  console.log("Paginated roles data: ", paginatedRolesData);

  const onSubmit = (data: { name: string, permission_id: string[] }) => {
    const payload = { name: data.name, permission_id: data.permission_id };
    // console.log("Payload being sent to API: ", payload);
    createRoleMutation.mutate(payload);
    // console.log("Data being submitted: ", data);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDeleteClick = (id: string) => {
    setRoleToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setRoleToDelete(null);
  };

  const handleUpdateClick = (role: { _id: string; name: string; permissions: any[] }) => {
    setRoleToUpdate(role);
    setOpenUpdateDialog(true);
    // You might want to populate the form fields here if the update modal uses react-hook-form
    // reset({ name: role.name, permission_id: role.permissions.map(p => p._id) });
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    setRoleToUpdate(null);
    // Optionally reset the form when closing the update modal
    // reset();
  };

  const confirmDelete = () => {
    if (roleToDelete) {
      deleteRoleMutation.mutate(roleToDelete);
    }
  };

  const onUpdateSubmit = (data: { name: string, permission_id: string[] }) => {
    if (roleToUpdate) {
      const payload = { name: data.name, permission_id: data.permission_id };
      updateRoleMutation.mutate({ payload, roleId: roleToUpdate._id });
    }
  };

  React.useEffect(() => {
    if (roleToUpdate) {
      reset({
        name: roleToUpdate.name,
        permission_id: roleToUpdate.permissions.map(p => p._id) // Assuming permissions have an _id
      });
    } else {
      reset({ name: '', permission_id: [] }); // Clear form when no role is being updated
    }
  }, [roleToUpdate, reset]);

  const updateRoleMutation = useMutation({
    mutationFn: ({ payload, roleId }: { payload: { name: string, permission_id: string[] }, roleId: string }) => updateRoleFn(payload, roleId),
    onSuccess: () => {
      toast.success("Role updated successfully!");
      handleCloseUpdateDialog();
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["paginatedRoles"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update role.");
    },
  });

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <div className='flex justify-end me-10 mt-2' >
        <button className='bg-primary text-white px-4 py-1 rounded-md' onClick={handleOpen}>Add Role</button>
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white shadow-2xl p-4 rounded">
         <div className='flex justify-between items-center'>
          <h2 id="modal-modal-title" className="text-2xl font-bold">Create Role</h2>
          <button onClick={handleClose}>
            <MdClose className='w-5 h-5' />
          </button>
         </div>
         <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-5 mt-7 flex flex-col gap-2 items-center'>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Role Name"
                  variant="outlined"
                  placeholder="Role Name"
                />
              )}
            />
            <FormControl fullWidth>
              <InputLabel id="permissions-label">Permissions</InputLabel>
              <Controller
                name="permission_id"
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <Select
                    labelId="permissions-label"
                    id="permissions-select"
                    multiple
                    label="Permissions"
                    {...field}
                  >
                    {permissionsData?.data?.map((permission: { _id: string; name: string }) => (
                      <MenuItem key={permission._id} value={permission._id}>
                        {permission.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
            <button type="submit" className='bg-primary text-white px-4 py-2 rounded-md'>Create</button>
          </div>
         </form>
        </Box>
      </Modal>
      </div>
      <TableContainer sx={{maxHeight:450}} >
        <Table sx={{paddingTop:"5px", paddingX:"20px" }} stickyHeader aria-label="sticky table">
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
            {isPaginatedRolesLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  Loading roles...
                </TableCell>
              </TableRow>
            ) : isPaginatedRolesError ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  Error loading roles: {paginatedRolesError?.message}
                </TableCell>
              </TableRow>
            ) : paginatedRolesData?.results?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No roles found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedRolesData?.data?.map((row: { _id: string; name: string; permissions: any[] }) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.permissions.map(p => p.name).join(', ')}</TableCell>
                    <TableCell>
                      <button
                      onClick={()=> handleUpdateClick(row)}
                      >
                        <CiEdit className='w-5 h-5' />
                      </button>
                      <button
                      onClick={()=> handleDeleteClick(row._id)}
                      >
                        <MdDeleteOutline className='w-5 h-5 ml-2' />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={paginatedRolesData?.totalDocument || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {/* Delete section */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Delete"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this role? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button type='button' onClick={handleCloseDeleteDialog} style={{backgroundColor:"gray"}} className='bg-gray-400 px-4 py-[3px] text-[14px] text-white rounded '>Cancel</button>
          <Button type="submit" onClick={confirmDelete} name='Delete'></Button>
        </DialogActions>
      </Dialog>

      {/* Update section */}
      <Dialog
        open={openUpdateDialog}
        onClose={handleCloseUpdateDialog}
        aria-labelledby="update-dialog-title"
        aria-describedby="update-dialog-description"
      >
        <DialogTitle id="update-dialog-title">
          {"Update Role"}
        </DialogTitle>
        <DialogContent>
          <form>
            <div className='mb-5 mt-7 flex flex-col gap-2 items-center'>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Role Name"
                    variant="outlined"
                    placeholder="Role Name"
                  />
                )}
              />
              <FormControl fullWidth>
                <InputLabel id="permissions-label">Permissions</InputLabel>
                <Controller
                  name="permission_id"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <Select
                      labelId="permissions-label"
                      id="permissions-select"
                      multiple
                      label="Permissions"
                      {...field}
                    >
                      {permissionsData?.data?.map((permission: { _id: string; name: string }) => (
                        <MenuItem key={permission._id} value={permission._id}>
                          {permission.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <button type='button' onClick={handleCloseUpdateDialog} style={{backgroundColor:"gray"}} className='bg-gray-400 px-4 py-[3px] text-[14px] text-white rounded '>Cancel</button>
          <Button type="submit" onClick={handleSubmit(onUpdateSubmit)} name='Update'></Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}