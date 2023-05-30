import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Avatar, Typography, Box, Card, CardContent } from '@mui/material';
import { styled } from '@mui/system';
import { Container } from '@mui/material';
import PostList from '../components/Posts/PostList';

const StyledTypography = styled(Typography)({
    textAlign: 'center',
    fontSize: '1.2rem',
    fontWeight: '600',
    marginTop: '1rem',
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

const Profile = () => {
    const { user, isAuthenticated } = useAuth0();
    const [petOwnerName, setPetOwnerName] = useState('');

    useEffect(() => {
        const fetchPetOwnerName = async () => {
            if (isAuthenticated && user) {
                try {
                    const response = await fetch('/.netlify/functions/getPetOwnerName', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userEmail: user.email }),
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error ${response.status}`);
                    }

                    const petOwnerNameData = await response.json();

                    setPetOwnerName(petOwnerNameData);
                } catch (error) {
                    console.error('Error fetching pet owner name:', error);
                }
            }
        };

        fetchPetOwnerName();
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
                        <Avatar
                            alt={user.name}
                            src={user.picture}
                            sx={{ width: 80, height: 80, marginTop: '1rem' }}
                        />
                        <CardContent>
                            <StyledTypography variant="h5">
                                {petOwnerName}
                            </StyledTypography>
                        </CardContent>
                    </StyledCard>
                )}
                <PostList />
            </Box>
        </Container>
    );
};

export default Profile;
