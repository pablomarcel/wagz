import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Avatar, Typography, Box, Card, CardContent } from '@mui/material';
import { styled } from '@mui/system';
import { Container } from '@mui/material';

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
});

const Profile = () => {
    const { user, isAuthenticated } = useAuth0();

    return (
        <Container maxWidth="xs">
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
                                {user.name}
                            </StyledTypography>
                            <StyledTypography variant="subtitle1">
                                {user.email}
                            </StyledTypography>
                        </CardContent>
                    </StyledCard>
                )}
            </Box>
        </Container>
    );
};

export default Profile;
