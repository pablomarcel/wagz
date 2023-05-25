// src/components/Sharing/ShareForm.js
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import React, { useState } from 'react';

const ShareForm = ({ open, onClose, onShare }) => {
    const [value, setValue] = useState('');

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    const handleShare = () => {
        onShare(value);
        setValue('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Share Post</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Enter User Email"
                    type="email"
                    fullWidth
                    value={value}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleShare}>Share</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShareForm;
