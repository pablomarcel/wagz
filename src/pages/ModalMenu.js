// ModalMenu.js
import React from 'react';
import { Modal, Box, MenuList, MenuItem, Button } from '@mui/material';

const ModalMenu = ({ handleOpen, handleClose, modalOpen, followHandler, currentOwner }) => (
    <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
            }}
        >
            <MenuList>
                <MenuItem onClick={() => followHandler()}>Follow</MenuItem>
            </MenuList>
            <Button onClick={handleClose}>Close</Button>
        </Box>
    </Modal>
);

export default ModalMenu;
