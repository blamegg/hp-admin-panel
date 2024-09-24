"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const data = [
  {
    id: 1,
    name: "Item 1",
    value: 10,
    description: "Description 1",
    category: "A",
    status: "Available",
  },
  {
    id: 2,
    name: "Item 2",
    value: 20,
    description: "Description 2",
    category: "B",
    status: "Unavailable",
  },
  {
    id: 3,
    name: "Item 3",
    value: 30,
    description: "Description 3",
    category: "A",
    status: "Available",
  },
  {
    id: 4,
    name: "Item 4",
    value: 40,
    description: "Description 4",
    category: "C",
    status: "Available",
  },
  {
    id: 5,
    name: "Item 5",
    value: 50,
    description: "Description 5",
    category: "B",
    status: "Unavailable",
  },
  {
    id: 6,
    name: "Item 6",
    value: 60,
    description: "Description 6",
    category: "A",
    status: "Available",
  },
  {
    id: 7,
    name: "Item 7",
    value: 70,
    description: "Description 7",
    category: "C",
    status: "Available",
  },
  {
    id: 8,
    name: "Item 8",
    value: 80,
    description: "Description 8",
    category: "B",
    status: "Unavailable",
  },
  {
    id: 9,
    name: "Item 9",
    value: 90,
    description: "Description 9",
    category: "A",
    status: "Available",
  },
  {
    id: 10,
    name: "Item 10",
    value: 100,
    description: "Description 10",
    category: "C",
    status: "Available",
  },
];

const DataTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State to control the drawer

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = data.filter((row) =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      setIsDrawerOpen(open);
    };

  return (
    <div>
      {/* Button to open sidebar */}
      <Button variant="contained" size="small" onClick={toggleDrawer(true)}>
        Open Side Bar
      </Button>

      {/* Search input */}
      <div className="w-[200px]">
        <TextField
          label="Search by Name"
          variant="standard"
          fullWidth
          size="small"
          margin="normal"
          onChange={handleSearch}
        />
      </div>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.value}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Sidebar (Drawer component) */}
      <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <div
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
          className="h-full w-[800px]"
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between bg-blue-600 p-4 text-white">
            <h2 className="text-xl font-bold">Drawer Title</h2>
            <Button
              variant="contained"
              color="error"
              onClick={toggleDrawer(false)}
            >
              Close
            </Button>
          </div>

          {/* Drawer Content */}
          <div className="bg-gray-100 h-full overflow-y-auto p-6">
            {/* You can display some data here in a table or list */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded bg-white p-4 shadow">
                <h3 className="text-lg font-semibold">Item 1</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
              <div className="rounded bg-white p-4 shadow">
                <h3 className="text-lg font-semibold">Item 2</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
              <div className="rounded bg-white p-4 shadow">
                <h3 className="text-lg font-semibold">Item 3</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
              <div className="rounded bg-white p-4 shadow">
                <h3 className="text-lg font-semibold">Item 4</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            </div>

            {/* Additional content */}
            <div className="mt-6">
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Voluptatem nostrum alias nesciunt numquam aperiam ipsam aut
                voluptates omnis veritatis id non tempora porro sit deserunt
                ipsum quisquam neque, suscipit fuga.
              </p>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default DataTable;
