
import { Drawer } from '@mui/material';
import React from 'react'
import ModalHeader from '../common/ModalHeader'

interface CreateLeaveInferFace {
    open: boolean;
    toggleDrawer: (open: boolean) => void;
}

const CreateLeave = ({ open, toggleDrawer }: CreateLeaveInferFace) => {
    const handleClose = () => {
        toggleDrawer(false);
    }
    return (
        <Drawer open={open} onClose={handleClose} anchor="right">
            <ModalHeader text={"Create Leave"} toggleDrawer={toggleDrawer} />
            <div>
                Create Leave
            </div>
        </Drawer>
    )
}

export default CreateLeave