// Post.js

import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';

const StyledCardMedia = styled(CardMedia)({
    paddingTop: '56.25%', // 16:9
});

const StyledCardVideo = styled('video')({
    width: '100%',
    height: 'auto',
});

const TruncatedTypography = styled(Typography)({
    display: "-webkit-box",
    boxOrient: "vertical",
    lineClamp: 2,
    wordBreak: "break-all",
    overflow: "hidden",
});

const StyledLink = styled(Link)({
    textDecoration: 'none',
    color: 'inherit',
    display: 'block', // This is important to make the link occupy the full space of the Card
});

const Post = ({ post }) => (
    <StyledLink to={`/petpost/${post.id}`}>
        <Card
            sx={{
                maxWidth: '100%',
                height: '360px',
                boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
                backgroundColor: '#f5f5f5',
                borderRadius: '15px',
            }}>
            {post.fileUrl && post.fileUrl.endsWith('.mp4') ? (
                <StyledCardVideo controls>
                    <source src={post.fileUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </StyledCardVideo>
            ) : (
                <StyledCardMedia
                    image={post.fileUrl ? post.fileUrl : "https://via.placeholder.com/640x360"}
                    title="Post image"
                />
            )}
            <CardContent>
                <TruncatedTypography variant="body2" color="text.secondary">
                    {post.caption}
                </TruncatedTypography>
            </CardContent>
        </Card>
    </StyledLink>
);

export default Post;
