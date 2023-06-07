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

const AboutPet = ({ open, onClose, pet }) => {
    const { user, isAuthenticated } = useAuth0();
    const [petOwnerProfile, setPetOwnerProfile] = useState({
        name: '',
        bio: '',
        fileUrl: '',
    });
    const [petDetails, setPetDetails] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [followStatus, setFollowStatus] = useState(false);
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
            setFollowStatus(false);
        };
    }, [pet, open]);

    useEffect(() => {
        const fetchFollowStatus = async () => {
            if (petDetails && user) {
                const response = await fetch('/.netlify/functions/getFollowPetStatus', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        petId: petDetails.id,
                        followerEmail: user.email,
                    }),
                });
                const data = await response.json();
                setFollowStatus(data.isFollowing);
            }
        };

        fetchFollowStatus();
    }, [petDetails, user]);

    const followPet = async () => {
        const response = await fetch('/.netlify/functions/followPet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                petId: petDetails.id,
                followerEmail: user.email,
            }),
        });

        if (response.ok) {
            setFollowStatus(true);
        }
    };

    const unfollowPet = async () => {
        const response = await fetch('/.netlify/functions/unfollowPet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                petId: petDetails.id,
                followerEmail: user.email,
            }),
        });

        if (response.ok) {
            setFollowStatus(false);
        }
    };

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
                        <Typography variant="subtitle1">
                            <strong>Bio:</strong> {petDetails.bio}
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
                        <StyledButton variant="text" onClick={() => navigate(`/petprofile/${petDetails.id}`)}>
                            Pet Profile
                        </StyledButton>
                        <StyledButton variant="text" onClick={followStatus ? unfollowPet : followPet}>
                            {followStatus ? 'Unfollow Pet' : 'Follow Pet'}
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
