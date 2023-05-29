import React, { useState, useEffect } from 'react';
import { Typography, Grid, CircularProgress, Container, Paper } from '@mui/material';
import { styled } from '@mui/system';
import Alert from '@mui/lab/Alert';
import { useParams } from 'react-router-dom'; // new

const StyledPaper = styled(Paper)({
    padding: '10px',
    margin: '10px 0',
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: '15px',
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
});

const PetOwnerProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { email } = useParams(); // new

    useEffect(() => {
        const fetchFolloweeProfile = async () => {
            try {
                const response = await fetch('/.netlify/functions/getFolloweeProfile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ followeeEmail: email }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }

                const data = await response.json();
                setProfile(data);
                setLoading(false);
            } catch (error) {
                setError(error.toString());
                setLoading(false);
            }
        };

        fetchFolloweeProfile();
    }, [email]);

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container>
            <Typography variant="h4" component="h1">{profile.name}</Typography>
            <Grid container spacing={2}>
                {profile.posts.map((post, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <StyledPaper elevation={3}>
                            <Typography variant="body1">{post.caption}</Typography>
                            {/* Here you could add more data about the post */}
                        </StyledPaper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default PetOwnerProfile;
