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
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PeopleIcon from '@mui/icons-material/People';
import ShareIcon from '@mui/icons-material/Share';
import FeedbackIcon from '@mui/icons-material/Feedback';
import StorefrontIcon from '@mui/icons-material/Storefront';
import EventIcon from '@mui/icons-material/Event';
import PortraitIcon from '@mui/icons-material/Portrait';
import ForumIcon from '@mui/icons-material/Forum';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AddIcon from '@mui/icons-material/Add';
import GroupsIcon from '@mui/icons-material/Groups';
import FormatListNumberedRtlIcon from '@mui/icons-material/FormatListNumberedRtl';
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
            icon: <HomeIcon style={{ color: '#1976d2'}}/>,
            route: '/',
        },
        ...(isAuthenticated
            ? [
                {
                    text: 'Profile',
                    icon: <AccountCircleIcon style={{ color: '#1976d2'}}/>, // import AccountCircleIcon from '@mui/icons-material/AccountCircle'
                    route: '/profile',
                },
                {
                    text: 'My Pets',
                    icon: <FormatListNumberedRtlIcon style={{ color: '#1976d2'}}/>,
                    route: '/mypets',
                },
                {
                    text: 'Owners',
                    icon: <PersonIcon style={{ color: '#1976d2'}}/>,
                    route: '/createPetOwner',
                },
                {
                    text: 'Pets',
                    icon: <PetsIcon style={{ color: '#1976d2'}}/>,
                    route: '/createPet',
                },
                {
                    text: 'Post',
                    icon: <PostAddIcon style={{ color: '#1976d2'}}/>,
                    route: '/post',
                },
                {
                    text: 'Liked',
                    icon: <FavoriteIcon style={{ color: '#1976d2'}}/>, // import FavoriteIcon from '@mui/icons-material/Favorite';
                    route: '/favorites',
                },
                {
                    text: 'Saved',
                    icon: <BookmarkIcon style={{ color: '#1976d2'}}/>, // import BookmarkIcon from '@mui/icons-material/Bookmark';
                    route: '/saved',
                },
                {
                    text: 'Following',
                    icon: <PeopleIcon style={{ color: '#1976d2'}}/>, // import BookmarkIcon from '@mui/icons-material/Bookmark';
                    route: '/following',
                },
                {
                    text: 'Shared With Me',
                    icon: <ShareIcon style={{ color: '#1976d2'}}/>, // import BookmarkIcon from '@mui/icons-material/Bookmark';
                    route: '/sharedwithme',
                },
                {
                    text: 'Community',
                    icon: <ForumIcon style={{ color: '#1976d2'}}/>,
                    route: '/createCommunity',
                },
                {
                    text: 'Community Post',
                    icon: <AddBoxIcon style={{ color: '#1976d2'}}/>,
                    route: '/communityPost',
                },
                {
                    text: 'Communities',
                    icon: <GroupsIcon style={{ color: '#1976d2'}}/>, // import BookmarkIcon from '@mui/icons-material/Bookmark';
                    route: '/communities',
                },
                {
                    text: 'Shopping',
                    icon: <StorefrontIcon style={{ color: '#1976d2'}}/>, // import BookmarkIcon from '@mui/icons-material/Bookmark';
                    route: '/shop',
                },
                {
                    text: 'Events',
                    icon: <EventIcon style={{ color: '#1976d2'}}/>, // import BookmarkIcon from '@mui/icons-material/Bookmark';
                    route: '/events',
                },
                {
                    text: 'People',
                    icon: <PortraitIcon style={{ color: '#1976d2'}}/>, // import BookmarkIcon from '@mui/icons-material/Bookmark';
                    route: '/publicfigures',
                },
                {
                    text: 'Feedback',
                    icon: <FeedbackIcon style={{ color: '#1976d2'}}/>, // import BookmarkIcon from '@mui/icons-material/Bookmark';
                    route: '/feedback',
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
                        <MenuIcon style={{ color: '#ed6c02'}}/>
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
                                    <LockOpenIcon style={{ color: '#ed6c02'}}/>
                                </ListItemIcon>
                                <ListItemText primary="Login" />
                            </ListItem>
                        ) : (
                            <ListItem button onClick={() => logout({ returnTo: window.location.origin })}>
                                <ListItemIcon>
                                    <ExitToAppIcon style={{ color: '#ed6c02'}}/>
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
