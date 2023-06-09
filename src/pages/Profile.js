import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Avatar, Typography, Box, Card, CardContent } from '@mui/material';
import { styled } from '@mui/system';
import { Container } from '@mui/material';
import PostList from '../components/Posts/PostList';
import {Helmet} from "react-helmet";

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

const Profile = () => {
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

            <Helmet>
                <title>Wagzters - My Profile</title>
                <meta name="description" content="View and manage your profile and posts on Wagzters, the dedicated social network for pet lovers. Connect, share and interact with a community of pet enthusiasts."/>
                <meta property="og:title" content="Wagzters - My Profile" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://i.imgur.com/jrbqoWp.png" />
                <meta property="og:url" content="https://wagzters.com/profile" />
                <meta property="og:description" content="View and manage your profile and posts on Wagzters, the dedicated social network for pet lovers. Connect, share and interact with a community of pet enthusiasts." />
            </Helmet>


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
                            alt={petOwnerProfile.name || ''}
                            src={petOwnerProfile.fileUrl || user.picture}
                            sx={{ width: 80, height: 80, marginTop: '1rem' }}
                        />
                        <CardContent>
                            <StyledTypography variant="h5">
                                {petOwnerProfile.name || ''}
                            </StyledTypography>
                            <StyledTypographyBio variant="body2" color="text.secondary">
                                {petOwnerProfile.bio}
                            </StyledTypographyBio>
                        </CardContent>
                    </StyledCard>
                )}
                <Typography variant="h6" component="div"
                            style={{
                                marginBottom: '1em'
                }}>
                    My Posts
                </Typography>
                <PostList />
            </Box>
        </Container>
    );
};

export default Profile;
