/* eslint-disable no-unused-vars */
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { useAuth0 } from "@auth0/auth0-react";
import { styled } from '@mui/system';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BuyButtonComponent from '../StripePayments/BuyButtonComponent';

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

const AboutPublicFigure = ({ open, onClose, publicFigure }) => {
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
    const [buyDialogOpen, setBuyDialogOpen] = useState(false);

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
        const fetchPublicFigureDetails = async () => {
            const response = await fetch('/.netlify/functions/getPublicFigure', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    publicFigureId: publicFigure.id,
                }),
            });
            const data = await response.json();
            setPublicFigureDetails(data);
        };

        if (publicFigure) {
            fetchPublicFigureDetails();
        }

        // Reset state when dialog is closed or pet changes
        return () => {
            setShowDetails(false);
            setPublicFigureDetails(null);
            setSubscribeStatus(false);
        };
    }, [publicFigure, open]);

    useEffect(() => {
        const fetchSubscribeStatus = async () => {
            if (publicFigureDetails && user) {
                const response = await fetch('/.netlify/functions/getSubscribePublicFigureStatus', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        publicFigureId: publicFigure.id,
                        followerEmail: user.email,
                    }),
                });
                const data = await response.json();
                setSubscribeStatus(data.isSubscribed);
            }
        };

        fetchSubscribeStatus();
    }, [publicFigure.id, publicFigureDetails, user]);

    const subscribePublicFigure = async () => {
        const response = await fetch('/.netlify/functions/subscribePublicFigure', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                publicFigureId: publicFigure.id,
                followerEmail: user.email,
            }),
        });

        if (response.ok) {
            setSubscribeStatus(true);
        }
    };

    const unsubscribePublicFigure = async () => {
        const response = await fetch('/.netlify/functions/unsubscribePublicFigure', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                publicFigureId: publicFigure.id,
                followerEmail: user.email,
            }),
        });

        if (response.ok) {
            setSubscribeStatus(false);
        }
    };

    if (!publicFigureDetails) {
        return null; // or a loading indicator
    }
    const handleSubscribeClick = () => {
        if (!subscribeStatus) {
            setBuyDialogOpen(true);
        } else {
            unsubscribePublicFigure();
        }
    };

    const handleBuyDialogClose = () => {
        setBuyDialogOpen(false);
    };

    return (
        <>
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
                            <StyledButton variant="text" onClick={() => setShowDetails(true)}>
                                About This Public Figure
                            </StyledButton>
                            <StyledButton variant="text" onClick={handleSubscribeClick}>
                                {subscribeStatus ? 'Unsubscribe' : 'Subscribe ($0.00)'}
                            </StyledButton>
                        </DialogContent>
                    </>
                )}
                <DialogActions>
                    <StyledButton variant="text" onClick={onClose}>Close</StyledButton>
                </DialogActions>
            </Dialog>

            <Dialog open={buyDialogOpen} onClose={handleBuyDialogClose} fullWidth={true} maxWidth='sm'>
                <StyledDialogTitle>
                    Purchase Subscription
                </StyledDialogTitle>
                <DialogContent>
                    <BuyButtonComponent userEmail={user.email} publicFigureId={publicFigureDetails.id}/>
                </DialogContent>
                <DialogActions>
                    <StyledButton variant="text" onClick={handleBuyDialogClose}>Close</StyledButton>
                </DialogActions>
            </Dialog>
        </>
    );

};

export default AboutPublicFigure;
