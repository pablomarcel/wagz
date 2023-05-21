import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Avatar, Box, Typography } from '@mui/material';

const Profile = () => {
    const { user, isAuthenticated } = useAuth0();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3 }}>
            {isAuthenticated && user && (
                <>
                    <Avatar
                        alt={user.name}
                        src={user.picture}
                        sx={{ width: 80, height: 80 }}
                    />
                    <Typography variant="h4" component="div" sx={{ mt: 2 }}>
                        {user.name}
                    </Typography>
                    <Typography variant="body1" component="div" sx={{ mt: 1 }}>
                        {user.email}
                    </Typography>
                </>
            )}
        </Box>
    );
};

export default Profile;
