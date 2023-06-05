/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Avatar, Typography, Box, Card, CardContent } from '@mui/material';
import { styled } from '@mui/system';
import { Container } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import CommunityList from '../Communities/CommunityList';
import PortraitIcon from "@mui/icons-material/Portrait";
import ForumIcon from '@mui/icons-material/Forum';
import GroupsIcon from '@mui/icons-material/Groups';


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

const Communities = () => {
    const { user, isAuthenticated } = useAuth0();
    const [petOwnerProfile, setPetOwnerProfile] = useState({
        name: '',
        bio: '',
        fileUrl: '',
    });

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
                        <GroupsIcon
                            sx={{ fontSize: 80, marginTop: '1rem' }}
                            color="primary"
                        />

                        <CardContent>
                            <StyledTypography variant="h5">
                                {'Communities' || ''}
                            </StyledTypography>
                            <StyledTypographyBio variant="body2" color="text.secondary">
                                {'Browse Communities'}
                            </StyledTypographyBio>
                        </CardContent>
                    </StyledCard>
                )}
                <CommunityList />
            </Box>
        </Container>
    );
};

export default Communities;

