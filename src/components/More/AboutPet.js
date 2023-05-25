// src/components/AboutPet.js
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { styled } from '@mui/system';
import React, { useState, useEffect } from 'react';

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

const AboutPet = ({ open, onClose, pet }) => {
    const [petDetails, setPetDetails] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        const fetchPetDetails = async () => {
            const response = await fetch('/.netlify/functions/getPet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    petId: pet.id,
                }),
            });
            const data = await response.json();
            setPetDetails(data);
        };

        if (pet) {
            fetchPetDetails();
        }

        // Reset state when dialog is closed or pet changes
        return () => {
            setShowDetails(false);
            setPetDetails(null);
        };
    }, [pet, open]);

    if (!petDetails) {
        return null; // or a loading indicator
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth='sm'>
            {showDetails ? (
                <>
                    <StyledDialogTitle>
                        About This Pet
                    </StyledDialogTitle>
                    <DialogContent>
                        <Typography variant="subtitle1">
                            <strong>Name:</strong> {petDetails.name}
                        </Typography>
                        <Typography variant="subtitle1">
                            <strong>Age:</strong> {petDetails.age}
                        </Typography>
                        <Typography variant="subtitle1">
                            <strong>Breed:</strong> {petDetails.breed}
                        </Typography>
                        {/* Add more pet attributes if you have them */}
                    </DialogContent>
                </>
            ) : (
                <>
                    <DialogTitle></DialogTitle>
                    <DialogContent>
                        <StyledButton variant="text" onClick={() => setShowDetails(true)}>
                            About This Pet
                        </StyledButton>
                    </DialogContent>
                </>
            )}
            <DialogActions>
                <StyledButton variant="text" onClick={onClose}>Close</StyledButton>
            </DialogActions>
        </Dialog>
    );
};

export default AboutPet;
