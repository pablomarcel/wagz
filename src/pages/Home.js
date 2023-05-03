import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Home = () => {
    return (
        <Container maxWidth="xs">
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Typography variant="h3">Home Page</Typography>
            </Box>
        </Container>
    );
};

export default Home;
