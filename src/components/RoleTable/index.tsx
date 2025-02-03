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
import TextField from '@mui/material/TextField';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import { MdDeleteOutline } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';

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
  Permission: string[];
}

export default function RoleResponsibility() {
  const [rows, setRows] = React.useState<Data[]>([
    { id: 1, role: 'Admin', Permission: ['Create', 'Read', 'Update', 'Delete'] },
    { id: 2, role: 'Manager', Permission: ['Read', 'Update'] },
    { id: 3, role: 'HR', Permission: ['Read', 'Update'] },
    { id: 4, role: 'Developer', Permission: ['Read', 'Update'] },
    { id: 5, role: 'Marketing', Permission: ['Read', 'Update'] },
  ]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<Data | null>(null);
  const [newRole, setNewRole] = React.useState('');
  const [permissions, setPermissions] = React.useState<string[]>([]);
  const [isEditing, setIsEditing] = React.useState(false);
  const permissionOptions = ['Create', 'Read', 'Update', 'Delete'];

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDelete = (id: number) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const handleEdit = (row: Data) => {
    setSelectedRow(row);
    setNewRole(row.role);
    setPermissions(row.Permission);
    setIsEditing(true);
    setOpenDrawer(true);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setSelectedRow(null);
    setNewRole('');
    setPermissions([]);
    setIsEditing(false);
  };

  const handleUpdate = () => {
    if (selectedRow) {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === selectedRow.id ? { ...row, role: newRole, Permission: permissions } : row
        )
      );
    }
    handleCloseDrawer();
  };

  const handleAddRole = () => {
    setOpenDrawer(true);
    if (newRole.trim() !== '') {
      setRows(prevRows => [
        ...prevRows,
        { id: prevRows.length + 1, role: newRole, Permission: permissions }
      ]);
      setNewRole('');
      setPermissions([]);
      setOpenDrawer(false);
      setIsEditing(false);
    }
  };


  const togglePermission = (permission: string) => {
    setPermissions((prev) =>
      prev.includes(permission) ? prev.filter((p) => p !== permission) : [...prev, permission]
    );
  };

  const filteredRows = rows.filter(row => row.role.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <h1 className='text-center py-4 text-3xl font-medium text-graydark'>Role and Responsibility</h1>
      <div className='px-4 mb-4 flex justify-between'>
        <TextField
          InputProps={{
            style: { height: '40px' }
          }}
          label='Search Role' variant='outlined' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <Button variant='contained' color='primary' onClick={handleAddRole}>Add Role</Button>
      </div>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader className='px-4'>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} sx={{ fontWeight: 'bold', backgroundColor: '#f8f2f1' }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow hover key={row.id}>
                <TableCell>{row.role}</TableCell>
                <TableCell>
                  {permissionOptions.map((permission) => (
                    <span key={permission} className={`inline-block px-2 py-1 mx-1 rounded-3xl ${row.Permission.includes(permission) ? 'bg-green-200' : 'bg-gray-200'}`}>
                      {permission}: {row.Permission.includes(permission) ? '✓ ' : '✗ '}
                    </span>
                  ))}
                </TableCell>
                <TableCell>
                  <button onClick={() => handleEdit(row)}><CiEdit className='w-5 h-5' /></button>
                  <button onClick={() => handleDelete(row.id)}><MdDeleteOutline className='w-5 h-5 ml-2' /></button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Drawer anchor="right" open={openDrawer} onClose={handleCloseDrawer}>
        <Box sx={{ width: 400, padding: 2 }}>
          <h2 className='py-4 text-lg font-medium'>{isEditing ? 'Edit Role' : 'Add Role'}</h2>
          <TextField
            label="Role"
            variant="outlined"
            fullWidth
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <div>
            {permissionOptions.map((permission) => (
              <FormControlLabel
                key={permission}
                control={
                  <Checkbox
                    checked={permissions.includes(permission)}
                    onChange={() => togglePermission(permission)}
                    name={permission}
                  />
                }
                label={permission}
              />
            ))}
          </div>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <Button variant="outlined" onClick={handleCloseDrawer}>Cancel</Button>
            <Button variant="contained" onClick={isEditing ? handleUpdate : handleAddRole}>
              {isEditing ? 'Update' : 'Add'}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Paper>
  );
}
