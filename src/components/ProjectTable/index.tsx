'use client';
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import { MdDeleteOutline } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import Button from '@mui/material/Button';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

interface Column {
    id: 'sno' | 'Project' | 'Description' | 'Members' | 'Status' | 'Actions';
    label: string;
    minWidth?: number;
}

const columns: readonly Column[] = [
    { id: 'sno', label: 'S. No', minWidth: 50 },
    { id: 'Project', label: 'Project', minWidth: 170 },
    { id: 'Description', label: 'Description', minWidth: 300 },
    { id: 'Members', label: 'Members', minWidth: 200 },
    { id: 'Status', label: 'Status', minWidth: 150 },
    { id: 'Actions', label: 'Actions', minWidth: 100 },
];

interface Data {
    id: number;
    project: string;
    description: string;
    members: string[];
    status: string;
}

export default function ProjectTable() {
    const [rows, setRows] = React.useState<Data[]>([
        { id: 1, project: 'Project A', description: 'Description for Project A', members: ['Alice'], status: 'In Progress' },
        { id: 2, project: 'Project B', description: 'Description for Project B', members: ['Charlie'], status: 'Hold' },
        { id: 3, project: 'Project C', description: 'Description for Project C', members: ['Eve'], status: 'Complete' },
        { id: 4, project: 'Project D', description: 'Description for Project D', members: ['Grace'], status: 'Pending' },
    ]);

    const projectList = ['Project A', 'Project B', 'Project C', 'Project D'];
    const membersList = ['Alice', 'Charlie', 'Eve', 'Grace', 'Bob', 'David'];

    const [openDrawer, setOpenDrawer] = React.useState(false);
    const [selectedRow, setSelectedRow] = React.useState<Data | null>(null);
    const [isEditing, setIsEditing] = React.useState(false);
    const [selectedMembers, setSelectedMembers] = React.useState<string[]>([]);
    const [searchQuery, setSearchQuery] = React.useState('');

    const { register, handleSubmit, setValue, reset, control, setError, formState: { errors } } = useForm();

    // Set form values when editing a row
    React.useEffect(() => {
        if (selectedRow) {
            setValue('project', selectedRow.project); // Set project value
            setValue('description', selectedRow.description);
            setValue('status', selectedRow.status);
            setSelectedMembers(selectedRow.members); // Ensure selected members are set when editing
            setValue('members', selectedRow.members);
        }
    }, [selectedRow, setValue]);

    const handleDelete = (id: number) => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    };

    const handleEdit = (row: Data) => {
        setSelectedRow(row);
        setIsEditing(true);
        setOpenDrawer(true);
    };

    const handleCloseDrawer = () => {
        setOpenDrawer(false);
        setSelectedRow(null);
        setIsEditing(false);
    };

    const onSubmit = (data: any) => {
        const newProject = data.project;
        const newDescription = data.description;
        const newMembers = selectedMembers;
        const newStatus = data.status;

        console.log('New Project:', newProject);
        console.log('New Description:', newDescription);
        console.log('New Members:', newMembers);
        console.log('New Status:', newStatus);

        if (newProject.trim() && newDescription.trim() && newMembers.length && newStatus.trim()) {
            if (isEditing && selectedRow) {
                setRows(prevRows =>
                    prevRows.map(row =>
                        row.id === selectedRow.id
                            ? { ...row, project: newProject, description: newDescription, members: newMembers, status: newStatus }
                            : row
                    )
                );
            } else {
                setRows(prevRows => [
                    ...prevRows,
                    {
                        id: Date.now(),
                        project: newProject,
                        description: newDescription,
                        members: newMembers,
                        status: newStatus
                    }
                ]);
            }
            handleCloseDrawer();
        } else {
            console.error('Please fill all fields before submitting');
        }
    };

    const statusOptions = [
        { value: 'Pending', label: 'Pending' },
        { value: 'Completed', label: 'Completed' },
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Hold', label: 'Hold' },
        { value: 'Gone', label: 'Gone' },
    ];

    const filteredRows = rows.filter(row => row.project.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <h1 className='text-center py-4 text-3xl font-medium text-graydark'>Project Management</h1>
            <div className='px-4 mb-4 flex justify-between'>
                <TextField
                    InputProps={{
                        style: { height: '40px' }
                    }}
                    label='Search Project' variant='outlined' value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                    variant='contained'
                    color='primary'
                    onClick={() => {
                        setOpenDrawer(true);
                        reset();
                    }}
                >
                    Add Project
                </Button>
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
                        {filteredRows.map((row, index) => (
                            <TableRow hover key={row.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{row.project}</TableCell>
                                <TableCell>{row.description}</TableCell>
                                <TableCell>{row.members.join(', ')}</TableCell>
                                <TableCell>{row.status}</TableCell>
                                <TableCell>
                                    <button onClick={() => handleEdit(row)}><CiEdit className='w-5 h-5' /></button>
                                    <button onClick={() => handleDelete(row.id)}><MdDeleteOutline className='w-5 h-5 ml-2' /></button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Drawer anchor='right' open={openDrawer} onClose={handleCloseDrawer}>
                <Box sx={{ width: 400, padding: 2 }}>
                    <h2 className='mb-4 text-lg font-medium'>{isEditing ? 'Edit Project' : 'Add Project'}</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Project</InputLabel>
                            <Select
                                sx={{ marginBottom: '10px' }}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                defaultValue={selectedRow ? selectedRow.project : ''} // Set the default value for the Select field
                                {...register('project', { required: true })}
                            >
                                {projectList.map((project) => (
                                    <MenuItem key={project} value={project}>
                                        {project}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label1">Select Members</InputLabel>
                            <Select
                                sx={{ marginBottom: '10px' }}
                                labelId="demo-simple-select-label1"
                                id="demo-simple-select"
                                {...register('members')}
                                multiple
                                value={selectedMembers}
                                onChange={(e) => setSelectedMembers(e.target.value as string[])}
                            >
                                {membersList.map((member, idx) => (
                                    <MenuItem key={idx} value={member}>
                                        {member}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label2">Status</InputLabel>
                            <Controller
                                name="status"
                                control={control}
                                defaultValue={selectedRow ? selectedRow.status : ''}
                                render={({ field }) => (
                                    <Select
                                        sx={{ marginBottom: '10px' }}
                                        labelId="demo-simple-select-label2"
                                        id="demo-simple-select"
                                        {...field}
                                    >
                                        {statusOptions.map((status) => (
                                            <MenuItem key={status.value} value={status.value}>
                                                {status.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        </FormControl>

                        <TextField
                            sx={{ marginBottom: '10px' }}
                            label='Description'
                            fullWidth
                            {...register('description', { required: true })}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                            <Button variant='outlined' onClick={handleCloseDrawer}>Cancel</Button>
                            <Button variant='contained' type="submit">Save</Button>
                        </Box>
                    </form>
                </Box>
            </Drawer>
        </Paper>
    );
}
