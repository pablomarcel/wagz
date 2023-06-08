/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Avatar, Typography, Box, Card, CardHeader, CardContent, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { Container } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EventList from '../Events/EventList';
import EventIcon from '@mui/icons-material/Event';
import AboutEvents from '../MoreEvents/AboutEvents';


const StyledTypography = styled(Typography)({
    textAlign: 'center',
    fontSize: '1.2rem',
    fontWeight: '600',
    marginTop: '1rem',
});

const StyledTypographyBio = styled(Typography)({
    textAlign: 'center',
    fontSize: '1rem',
    fontWeight: '400',
    marginTop: '0.5rem',
    marginBottom: '1rem',
});

const StyledCard = styled(Card)({
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
    borderRadius: '15px',
    padding: '2rem',
    marginTop: '0rem',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    marginBottom: '2rem'
});

const Events = () => {
    const { user, isAuthenticated } = useAuth0();
    const [petOwnerProfile, setPetOwnerProfile] = useState({
        name: '',
        bio: '',
        fileUrl: '',
    });
    const [aboutEventsOpen, setAboutEventsOpen] = useState(false);

    const handleAboutEvents = () => {
        //setCurrentPublicFigure(publicFigureDetails);
        setAboutEventsOpen(true);
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

        fetchPetOwnerProfile();
    }, [user, isAuthenticated]);

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 0
                }}>
                {isAuthenticated && user && (
                    <StyledCard>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%',
                                padding: '0 1rem',
                            }}
                        >
                            <IconButton
                                style={{ visibility: 'hidden' }} // This is the "spacer" element.
                            >
                                <MoreVertIcon style={{ color: '#e91e63' }}/>
                            </IconButton>

                            <EventIcon
                                sx={{ fontSize: 80, marginTop: '1rem' }}
                                color="primary"
                            />

                            <IconButton onClick={() => handleAboutEvents()}>
                                <MoreVertIcon style={{ color: '#e91e63' }}/>
                            </IconButton>
                        </Box>

                        <CardContent>
                            <StyledTypography variant="h5">
                                {'Events' || ''}
                            </StyledTypography>
                            <StyledTypographyBio variant="body2" color="text.secondary">
                                {'Browse Events'}
                            </StyledTypographyBio>
                        </CardContent>
                    </StyledCard>
                )}
                <EventList />
            </Box>
            {aboutEventsOpen && (
                <AboutEvents
                    open={aboutEventsOpen}
                    onClose={() => setAboutEventsOpen(false)}
                />
            )}
        </Container>
    );
};

export default Events;

