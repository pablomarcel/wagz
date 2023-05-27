import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { styled } from '@mui/system';
import React, { useState } from 'react';

const StyledDialogTitle = styled(DialogTitle)({
    textAlign: 'center',
    '& .MuiTypography-root': {
        fontSize: '1.2rem',
        fontWeight: '600',
    },
});

const StyledButton = styled(Button)({
    display: 'block',
    width: '100%',
    margin: '10px 0',
    textTransform: 'none',
    fontSize: '1rem',
});

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
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth='sm'>
            <StyledDialogTitle>Share Post</StyledDialogTitle>
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
                <StyledButton variant="text" onClick={onClose}>Cancel</StyledButton>
                <StyledButton variant="contained" color="primary" onClick={handleShare}>Share</StyledButton>
            </DialogActions>
        </Dialog>
    );
};

export default ShareForm;
