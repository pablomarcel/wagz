/* eslint-disable no-unused-vars */
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/system';
import React, {useEffect, useState} from 'react';
import { useAuth0 } from "@auth0/auth0-react";

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
    const { user, isAuthenticated } = useAuth0();
    const [petOwnerProfile, setPetOwnerProfile] = useState({
        name: '',
        bio: '',
        fileUrl: '',
    });
    const [selectedOwner, setSelectedOwner] = useState(''); // This is the owner's name to be displayed
    const [ownerEmail, setOwnerEmail] = useState(''); // This is the actual owner's email to be used when sharing the post
    const [followingOwners, setFollowingOwners] = useState([]);

    const handleChange = (event) => {
        const owner = followingOwners.find(owner => owner.email === event.target.value);
        setSelectedOwner(owner ? owner.name : '');
        setOwnerEmail(event.target.value);
    };

    const handleShare = () => {
        onShare(ownerEmail);
        setSelectedOwner('');
        setOwnerEmail('');
        onClose();
    };

    useEffect(() => {
        const fetchPetOwnerProfile = async () => {
            if (isAuthenticated && user) {
                try {
                    const response = await fetch('/.netlify/functions/getPetOwnerProfile', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userEmail: user.email }),
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error ${response.status}`);
                    }

                    const petOwnerProfileData = await response.json();

                    setPetOwnerProfile(petOwnerProfileData);
                } catch (error) {
                    console.error('Error fetching pet owner profile:', error);
                }
            }
        };

        const fetchFollowingOwners = async () => {
            if (isAuthenticated && user) {
                try {
                    const response = await fetch('/.netlify/functions/getFollowingOwners', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userEmail: user.email }),
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error ${response.status}`);
                    }

                    const followingOwnersData = await response.json();

                    setFollowingOwners(followingOwnersData);
                } catch (error) {
                    console.error('Error fetching following owners:', error);
                }
            }
        };

        fetchPetOwnerProfile();
        fetchFollowingOwners();
    }, [user, isAuthenticated]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth='sm'>
            <StyledDialogTitle>Share Post</StyledDialogTitle>
            <DialogContent>
                {/*<TextField*/}
                {/*    autoFocus*/}
                {/*    margin="dense"*/}
                {/*    label="Shared With"*/}
                {/*    type="text" // We change this from "email" to "text" because we're now displaying the owner's name*/}
                {/*    fullWidth*/}
                {/*    value={selectedOwner} // We now use "selectedOwner" here instead of "value"*/}
                {/*    readOnly // We set this to "readOnly" to prevent the user from editing the owner's name*/}
                {/*/>*/}
                <Select
                    label="Select Owner"
                    value={ownerEmail} // We now use "ownerEmail" here instead of "value"
                    onChange={handleChange}
                    fullWidth
                >
                    {followingOwners.map((owner, index) => (
                        <MenuItem key={index} value={owner.email}>
                            {owner.name}
                        </MenuItem>
                    ))}
                </Select>
            </DialogContent>
            <DialogActions>
                <StyledButton variant="text" onClick={onClose}>Cancel</StyledButton>
                <StyledButton variant="contained" color="primary" onClick={handleShare}>Share</StyledButton>
            </DialogActions>
        </Dialog>
    );
};

export default ShareForm;
