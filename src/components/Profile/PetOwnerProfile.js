import React, { useState, useEffect } from 'react';
import { Typography, Grid, CircularProgress, Container, Avatar, Card, CardContent, Box} from '@mui/material';
import { styled } from '@mui/system';
import Alert from '@mui/lab/Alert';
import { useParams } from 'react-router-dom';
import Post from '../Posts/Post';

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

const PetOwnerProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { followeeId } = useParams();

    useEffect(() => {
        const fetchFolloweeProfile = async () => {
            try {
                const response = await fetch('/.netlify/functions/getFolloweeProfile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ followeeId: followeeId }),
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
    }, [followeeId]);

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 0
                }}>
                {profile && (
                    <StyledCard>
                        <Avatar
                            alt={profile.name || ''}
                            src={profile.fileUrl || ''}
                            sx={{ width: 80, height: 80, marginTop: '1rem' }}
                        />
                        <CardContent>
                            <StyledTypography variant="h5">
                                {profile.name}
                            </StyledTypography>
                            <StyledTypographyBio variant="body2" color="text.secondary">
                                {profile.bio}
                            </StyledTypographyBio>
                        </CardContent>
                    </StyledCard>
                )}
                <Typography variant="h6" component="div"
                            style={{
                                marginBottom: '1em'
                            }}>
                    Posts by {profile.name}
                </Typography>
                <Grid container spacing={2}>
                    {profile.posts.map((post, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index} style={{ minHeight: '500px' }}>
                            <Post post={post} />
                        </Grid>
                    ))}
                </Grid>

            </Box>
        </Container>
    );
};

export default PetOwnerProfile;
