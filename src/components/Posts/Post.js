import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/system';

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

const Post = ({ post }) => (
    <Card sx={{ maxWidth: '100%', height: '360px' }}>
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
            <TruncatedTypography variant="body2" component="div">
                {post.caption}
            </TruncatedTypography>
        </CardContent>
    </Card>
);

export default Post;
