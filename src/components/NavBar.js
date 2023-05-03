/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Button, Link, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth0 } from '@auth0/auth0-react';

const NavBar = () => {
    const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

    return (
        <AppBar position="static" sx={{ backgroundColor: 'primary' }}>
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu">
                    <MenuIcon sx={{ color: 'white' }} />
                </IconButton>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button color="inherit" component={RouterLink} to="/">Home</Button>
                    {isAuthenticated && (
                        <>
                            <Button color="inherit" component={RouterLink} to="/createPetOwner">Owner</Button>
                            <Button color="inherit" component={RouterLink} to="/createPet">Pets</Button>
                            <Button color="inherit" component={RouterLink} to="/post">Post</Button>
                        </>
                    )}
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                {!isAuthenticated ? (
                    <Button color="inherit" component={RouterLink} to="/login">Login</Button>
                ) : (
                    <Button color="inherit" onClick={() => logout({ returnTo: window.location.origin })}>
                        Logout
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
