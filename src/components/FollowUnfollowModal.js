import React from 'react';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const FollowUnfollowModal = ({ open, onClose, followAction, unfollowAction, isFollowing }) => {
    return (
        <Dialog onClose={onClose} open={open}>
            <List>
                <ListItem button onClick={isFollowing ? unfollowAction : followAction}>
                    <ListItemText primary={isFollowing ? 'Unfollow' : 'Follow'} />
                </ListItem>
            </List>
        </Dialog>
    );
};

export default FollowUnfollowModal;
