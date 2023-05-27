import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, List, ListItem, CircularProgress, Container, Grid, Paper } from '@mui/material';
import { styled } from '@mui/system';
import Alert from '@mui/lab/Alert';

const StyledTypography = styled(Typography)({
    marginBottom: '10px',
});

const StyledPaper = styled(Paper)({
    padding: '10px',
    margin: '10px 0',
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
            <StyledTypography variant="h4" component="h1">Following</StyledTypography>
            {owners.length > 0 ? (
                <List>
                    {owners.map((owner, index) => (
                        <ListItem key={index}>
                            <Grid container justifyContent="center">
                                <Grid item xs={12} sm={8} md={6}>
                                    <StyledPaper elevation={3}>
                                        <Typography variant="body1">{owner}</Typography>
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
