import { Drawer, Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, OutlinedInput } from '@mui/material'
import React from 'react'

interface PermissionDrawerProps {
  isDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
  permissionsMenuList: { _id: string; name: string }[];
  role?:string | null;
  
}

const PermissionDrawer: React.FC<PermissionDrawerProps> = ({
  isDrawerOpen,
  toggleDrawer,
  permissionsMenuList,
  role
}) => {
  return (
    <Drawer
      anchor="right"
      open={isDrawerOpen}
      onClose={() => toggleDrawer(false)}
    >
      <Box sx={{ width: 350, padding: 2 }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Assign Permissions
        </Typography>
        <Typography>
          Role: {role || 'N/A'}
        </Typography>
        <FormControl fullWidth sx={{ mb: 2, display:"grid", gridTemplateColumns:"2fr" }}>
          <Box>
             {permissionsMenuList?.data?.map((permission) => (
              <Box key={permission._id} value={permission._id}>
                <input type="checkbox" id={permission._id} />
                <label htmlFor={permission.name} className='ms-1'>{permission.name}</label>
                <ul className='ms-5'>
                  {permission.subMenus.map((subMenu)=>(
                    <li key={subMenu._id}>
                      <input type="checkbox" id={subMenu._id} />
                       <label htmlFor={subMenu._id} className='ms-1'>{subMenu.name}</label>
                    </li>
                  ))}
                </ul>
              </Box>
            ))}
          </Box>
        </FormControl>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button onClick={() => toggleDrawer(false)} sx={{ mr: 1 ,backgroundColor:"gray", color:"white" }}>
            Close
          </Button>
          <Button sx={{backgroundColor:"#3b82f6", color:"white"}}>
            Update
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}

export default PermissionDrawer