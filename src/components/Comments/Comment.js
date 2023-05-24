import React, { useState } from 'react';
import { ListItem, ListItemAvatar, Avatar, ListItemText, Typography, IconButton } from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ReplyIcon from '@mui/icons-material/Reply';

const Comment = ({ id, ownerName, text, timestamp, isLiked: initialIsLiked, likeCount: initialLikeCount, userEmail, userPicture }) => {



    const initialIsLikedBool = initialIsLiked !== undefined ? initialIsLiked : false;
    const initialLikeCountNumber = initialLikeCount !== undefined ? initialLikeCount : 0;

    const [isLiked, setIsLiked] = useState(initialIsLikedBool);
    const [likeCount, setLikeCount] = useState(initialLikeCountNumber);



    const toggleLike = async () => {
        try {
            const response = await fetch('/.netlify/functions/likeComment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ commentId: id, userEmail }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }

            const { change } = await response.json();
            setIsLiked((prevIsLiked) => !prevIsLiked);
            setLikeCount((prevLikeCount) => prevLikeCount + change);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar src={userPicture} />  {/* Updated the Avatar source to use the userPicture prop */}
            </ListItemAvatar>
            <ListItemText
                primary={
                    <React.Fragment>
                        <Typography component="span" variant="body2" color="textPrimary">
                            {ownerName}
                        </Typography>
                        {` - ${text}`}
                    </React.Fragment>
                }
                secondary={new Date(timestamp).toLocaleString()}

            />
            <IconButton onClick={toggleLike}>
                <ThumbUpAltIcon color={isLiked ? 'primary' : 'inherit'} />
                {likeCount}
            </IconButton>
            <IconButton>
                <ReplyIcon />
            </IconButton>
        </ListItem>
    );
};

export default Comment;
