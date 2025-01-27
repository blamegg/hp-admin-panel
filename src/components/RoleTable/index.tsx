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

const rows = [
  { id: 1, role: 'Admin', Permission: 'Manage all users and settings' },
  { id: 2, role: 'Manager', Permission: 'Oversee team projects and tasks' },
  { id: 3, role: 'Developer', Permission: 'Develop and maintain software applications' },
  { id: 4, role: 'Designer', Permission: 'Create user interface designs' },
  { id: 5, role: 'QA Engineer', Permission: 'Test software applications' },
  { id: 6, role: 'DevOps Engineer', Permission: 'Manage infrastructure and deployment' },
  { id: 7, role: 'Project Manager', Permission: 'Manage project timelines and resources' },
  { id: 8, role: 'UX Researcher', Permission: 'Conduct user research and analyze data' },
  { id: 9, role: 'Technical Writer', Permission: 'Create technical documentation' },
  { id: 10, role: 'Data Analyst', Permission: 'Analyze and interpret data' },
];

export default function RoleResponsibility() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table sx={{ padding: "20px" }} stickyHeader aria-label="sticky table">
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
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    <TableCell>{row.role}</TableCell>
                    <TableCell>{row.Permission}</TableCell>
                    <TableCell>
                      <button
                      >
                        <CiEdit className='w-5 h-5' />
                      </button>
                      <button
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
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}