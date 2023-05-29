// PetPost.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardMedia, CardContent, Typography, Container } from '@mui/material';
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

const StyledCard = styled(Card)({
    maxWidth: '100%',
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#f5f5f5',
    borderRadius: '15px',
    margin: '1em auto', // for centering and spacing
});

function PetPost() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.post('/.netlify/functions/getPostProfile', { postId })
            .then(response => {
                setPost(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching post profile:', error);
                setIsLoading(false);
            });
    }, [postId]);

    if (isLoading) {
        return <p>Loading post...</p>;
    }

    if (!post) {
        return <p>No post found for this id.</p>;
    }

    return (
        <Container maxWidth="md">
            <StyledCard>
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
            </StyledCard>
        </Container>
    );
}

export default PetPost;
