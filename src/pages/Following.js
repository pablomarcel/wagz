/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, List, ListItem, CircularProgress, Container, Grid, Paper, Button, Avatar } from '@mui/material';
import { styled } from '@mui/system';
import Alert from '@mui/lab/Alert';
import { useNavigate } from 'react-router-dom';
import {Helmet} from "react-helmet";

const StyledTypography = styled(Typography)({
    marginBottom: '10px',
});

const StyledPaper = styled(Paper)({
    padding: '10px',
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: '15px',
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
});

const Following = () => {
    const { user, isAuthenticated } = useAuth0();
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleProfileClick = async (hashedEmail) => {
        try {
            const response = await fetch('/.netlify/functions/getPetOwnerByEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ hashedEmail }), // renamed variable here
            });

            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }

            const ownerData = await response.json();

            if (ownerData && ownerData.length > 0) {
                navigate(`/petownerprofile/${ownerData[0].id}`);
            } else {
                throw new Error('No user found with this email');
            }
        } catch (error) {
            setError(error.toString());
        }
    }


    const handleFollow = async (owner) => {
        const response = await fetch('/.netlify/functions/follow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ followerEmail: user.email, followeeEmail: owner.email }),
        });
        if (response.ok) {
            setOwners(owners.map(o => o.email === owner.email ? { ...o, isFollowing: true } : o));
        }
    }

    const handleUnfollow = async (owner) => {
        const response = await fetch('/.netlify/functions/unfollow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ followerEmail: user.email, unfolloweeEmail: owner.email }),
        });
        if (response.ok) {
            setOwners(owners.map(o => o.email === owner.email ? { ...o, isFollowing: false } : o));
        }
    }

    useEffect(() => {
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

                    const data = await response.json();

                    for (let owner of data) {
                        const followStatusResponse = await fetch('/.netlify/functions/getFollowStatus', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ followerEmail: user.email, followeeEmail: owner.email }),
                        });
                        if (followStatusResponse.ok) {
                            const followStatusData = await followStatusResponse.json();
                            owner.isFollowing = followStatusData.isFollowing;
                        }
                    }

                    setOwners(data);
                    setLoading(false);
                } catch (error) {
                    setError(error.toString());
                    setLoading(false);
                }
            }
        };

        fetchFollowingOwners();
    }, [isAuthenticated, user]);

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container>

            <Helmet>
                <title>Wagzters - Following</title>
                <meta name="description" content="View the pet owners you're following on Wagzters. Stay updated with your fellow pet lovers and their furry friends."/>
                <meta property="og:title" content="Wagzters - Following" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://i.imgur.com/jrbqoWp.png" />
                <meta property="og:url" content="https://wagzters.com/following" />
                <meta property="og:description" content="View the pet owners you're following on Wagzters. Stay updated with your fellow pet lovers and their furry friends." />
            </Helmet>

            <StyledTypography variant="h4" component="h1">Following</StyledTypography>
            {owners.length > 0 ? (
                <List>
                    {owners.map((owner, index) => (
                        <ListItem key={index}>
                            <Grid container justifyContent="center">
                                <Grid item xs={12} sm={8} md={6}>
                                    <StyledPaper elevation={3}>
                                        <Grid container alignItems="center">
                                            <Grid item xs={2}>
                                                <Avatar alt={owner.name} src={owner.fileUrl} />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Button onClick={() => handleProfileClick(owner.email)}>
                                                    <Typography variant="body1">{owner.name}</Typography>
                                                </Button>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Button
                                                    variant="contained"
                                                    sx={{
                                                        backgroundColor: owner.isFollowing ? '#607d8b' : '#1976d2',
                                                        color: '#ffffff',
                                                        marginLeft: '10px',
                                                        marginRight: '5px',
                                                    }}
                                                    onClick={() => owner.isFollowing ? handleUnfollow(owner) : handleFollow(owner)}
                                                >
                                                    {owner.isFollowing ? 'Unfollow' : 'Follow'}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </StyledPaper>
                                </Grid>
                            </Grid>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography variant="body1">You are not following anyone.</Typography>
            )}
        </Container>
    );
};

export default Following;
