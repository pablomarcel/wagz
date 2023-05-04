/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
    Link,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import PetsIcon from '@mui/icons-material/Pets';
import PostAddIcon from '@mui/icons-material/PostAdd';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useAuth0 } from '@auth0/auth0-react';

const NavBar = () => {
    const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
    const [drawerOpen, setDrawerOpen] = useState(false);

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

            <Drawer variant="permanent" open={drawerOpen}>
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
        </>
    );
};

export default NavBar;
