/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import PetsIcon from '@mui/icons-material/Pets';
import PostAddIcon from '@mui/icons-material/PostAdd';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useAuth0 } from '@auth0/auth0-react';

const drawerWidth = 240;

const NavBar = () => {
    const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
    const [drawerOpen, setDrawerOpen] = useState(true);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const drawerItems = [
        {
            text: 'Home',
            icon: <HomeIcon />,
            route: '/',
        },
        ...(isAuthenticated
            ? [
                {
                    text: 'Profile',
                    icon: <AccountCircleIcon />, // import AccountCircleIcon from '@mui/icons-material/AccountCircle'
                    route: '/profile',
                },
                {
                    text: 'Owner',
                    icon: <PersonIcon />,
                    route: '/createPetOwner',
                },
                {
                    text: 'Pets',
                    icon: <PetsIcon />,
                    route: '/createPet',
                },
                {
                    text: 'Post',
                    icon: <PostAddIcon />,
                    route: '/post',
                },
            ]
            : []),
    ];

    return (
        <>
            <AppBar
                position="fixed"
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#b8dfe6' }}
            >
                <Toolbar
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <IconButton
                        edge="start"
                        color="gray"
                        aria-label="menu"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Avatar
                        alt="Wagzters Logo"
                        src="/wagzter-002.png"
                        sx={{
                            width: 56,
                            height: 56,
                        }}
                    />
                    <Box sx={{ width: '56px' }} /> {/* Add an empty box to balance the IconButton space */}
                </Toolbar>

            </AppBar>
            <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
                <Drawer
                    variant="persistent"
                    open={drawerOpen}
                    sx={{
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            top: '64px', // AppBar height on desktop devices
                            height: 'calc(100% - 64px)',
                        },
                    }}
                >
                    <List>
                        {drawerItems.map((item, index) => (
                            <ListItem button key={index} component={RouterLink} to={item.route}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                        {!isAuthenticated ? (
                            <ListItem button onClick={loginWithRedirect}>
                                <ListItemIcon>
                                    <LockOpenIcon />
                                </ListItemIcon>
                                <ListItemText primary="Login" />
                            </ListItem>
                        ) : (
                            <ListItem button onClick={() => logout({ returnTo: window.location.origin })}>
                                <ListItemIcon>
                                    <ExitToAppIcon />
                                </ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItem>
                        )}
                    </List>
                </Drawer>
            </Box>
            <Box component="main"
                 sx={{ flexGrow: 1, p: 3, ml: { md: drawerWidth }, mt: { xs: '56px', sm: '64px' } }}
            >
                {/* your main content goes here */}
            </Box>
        </>
    );
};

export default NavBar;
