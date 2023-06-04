import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardMedia, CardContent, Typography, Container } from '@mui/material';
import { styled } from '@mui/system';

const StyledCardMedia = styled(CardMedia)({
    paddingTop: '56.25%', // 16:9
});

const StyledCard = styled(Card)({
    maxWidth: '100%',
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#f5f5f5',
    borderRadius: '15px',
    margin: '1em auto', // for centering and spacing
});

function PublicFigurePost() {
    const { publicFigurePostId } = useParams();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.post('/.netlify/functions/getPublicFigurePost', { postId: publicFigurePostId })
            .then(response => {
                setPost(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching public figure post:', error);
                setIsLoading(false);
            });
    }, [publicFigurePostId]);

    if (isLoading) {
        return <p>Loading post...</p>;
    }

    if (!post) {
        return <p>No post found for this id.</p>;
    }

    return (
        <Container maxWidth="md">
            <StyledCard>
                <StyledCardMedia
                    image={post.fileUrl ? post.fileUrl : "https://via.placeholder.com/640x360"}
                    title={post.title}
                />
                <CardContent>
                    <Typography variant="h5">
                        {post.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {post.content}
                    </Typography>
                </CardContent>
            </StyledCard>
        </Container>
    );
}

export default PublicFigurePost;
