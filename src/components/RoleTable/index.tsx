'use client';
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
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { MdDeleteOutline } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';

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
  const [rows, setRows] = React.useState<Data[]>([
    { id: 1, role: 'Admin', Permission: 'Manage all users and settings' },
    { id: 2, role: 'Manager', Permission: 'Oversee team projects and tasks' },
    { id: 3, role: 'Developer', Permission: 'Develop and maintain software applications' },
    { id: 4, role: 'Designer', Permission: 'Create user interface designs' },
    { id: 5, role: 'QA Engineer', Permission: 'Test software applications' },
  ]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [open, setOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<Data | null>(null);

  const [newRole, setNewRole] = React.useState('');
  const [newPermission, setNewPermission] = React.useState('');

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

  const handleAdd = () => {
    if (newRole.trim() && newPermission.trim()) {
      if (editMode && selectedRow) {
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === selectedRow.id ? { ...row, role: newRole, Permission: newPermission } : row
          )
        );
      } else {
        const newRow = {
          id: rows.length + 1,
          role: newRole,
          Permission: newPermission,
        };
        setRows((prevRows) => [...prevRows, newRow]);
      }

      setNewRole('');
      setNewPermission('');
      setOpen(false);
      setEditMode(false);
      setSelectedRow(null);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setEditMode(false);
    setNewRole('');
    setNewPermission('');
  };

  const handleEdit = (row: Data) => {
    setSelectedRow(row);
    setNewRole(row.role);
    setNewPermission(row.Permission);
    setEditMode(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedRow(null);
    setNewRole('');
    setNewPermission('');
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <div className="flex justify-end">
        <button
          onClick={handleOpen}
          className="m-4 text-end text-white font-medium bg-red rounded-xl p-2"
        >
          Add Role
        </button>
      </div>
      <Modal open={open} onClose={handleClose}>

        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2 className="text-xl font-bold text-center mb-4">Manage Role and Permissions</h2>
          <TextField
            fullWidth
            label="Role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Permission"
            value={newPermission}
            onChange={(e) => setNewPermission(e.target.value)}
            margin="normal"
          />
          <button onClick={handleAdd} className="mt-4 text-white bg-blue-500 rounded p-2">
            {editMode ? 'Update' : 'Add'}
          </button>
        </Box>
      </Modal>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table" className='p-4'>
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
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>{row.Permission}</TableCell>
                  <TableCell>
                    <button onClick={() => handleEdit(row)}>
                      <CiEdit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(row.id)}>
                      <MdDeleteOutline className="w-5 h-5 ml-2" />
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
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
