/* eslint-disable no-unused-vars */
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { useAuth0 } from "@auth0/auth0-react";
import { styled } from '@mui/system';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

const AboutPolls = ({ open, onClose}) => {
    const { user, isAuthenticated } = useAuth0();
    const [petOwnerProfile, setPetOwnerProfile] = useState({
        name: '',
        bio: '',
        fileUrl: '',
    });
    //const [petDetails, setPetDetails] = useState(null);
    const [publicFigureDetails, setPublicFigureDetails] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [subscribeStatus, setSubscribeStatus] = useState(false);
    const navigate = useNavigate();

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

        fetchPetOwnerProfile();
    }, [user, isAuthenticated]);


    return (
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth='sm'>
            {showDetails ? (
                <>
                    <StyledDialogTitle>
                        About This Public Figure
                    </StyledDialogTitle>
                    <DialogContent>
                        <Typography variant="subtitle1">
                            <strong>Name:</strong> {publicFigureDetails.name}
                        </Typography>
                        <Typography variant="subtitle1">
                            <strong>Occupation:</strong> {publicFigureDetails.occupation}
                        </Typography>
                        <Typography variant="subtitle1">
                            <strong>Known for:</strong> {publicFigureDetails.knownFor}
                        </Typography>
                        <Typography variant="subtitle1">
                            <strong>Bio:</strong> {publicFigureDetails.bio}
                        </Typography>
                        <Typography variant="subtitle1">
                            <strong>Nationality:</strong> {publicFigureDetails.nationality}
                        </Typography>
                        <Typography variant="subtitle1">
                            <strong>Birth Place:</strong> {publicFigureDetails.birthPlace}
                        </Typography>
                        <Typography variant="subtitle1">
                            <strong>Birth Date:</strong> {publicFigureDetails.birthDate}
                        </Typography>
                        {/* Add more pet attributes if you have them */}
                    </DialogContent>
                </>
            ) : (
                <>
                    <DialogTitle></DialogTitle>
                    <DialogContent>
                        <StyledButton variant="text" onClick={() => navigate(`/eventform/`)}>
                            Polls Placeholder
                        </StyledButton>
                        {/*<StyledButton variant="text" onClick={() => navigate(`/publicfigureprofile/${publicFigureDetails.id}`)}>*/}
                        {/*    Public Figure Profile*/}
                        {/*</StyledButton>*/}

                    </DialogContent>
                </>
            )}
            <DialogActions>
                <StyledButton variant="text" onClick={onClose}>Close</StyledButton>
            </DialogActions>
        </Dialog>
    );
};

export default AboutPolls;
