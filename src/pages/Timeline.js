
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Container, Grid, Card, CardHeader, CardContent, Typography, Avatar, IconButton, CircularProgress, CardMedia } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { StyledCard, StyledCardMedia, StyledCardVideo } from './styledComponents';

function Timeline() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);

    const fetchPosts = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await axios.get(`/api/listPostsScroll?page=${page}`);
            setPosts(prevPosts => [...prevPosts, ...response.data]);
            setPage(prevPage => prevPage + 1);
        } catch (error) {
            console.error(`Failed to fetch posts: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // When the user scrolls down 80% of the view height, load more posts.
    useEffect(() => {
        const handleScroll = () => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight * 0.8) {
                fetchPosts();
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [fetchPosts]);

    return (
        <Container maxWidth="md">
            <Grid container spacing={2} justifyContent="center">
                {posts.map((post, index) => (
                    <Grid item xs={12} key={index}>
                        <StyledCard>
                            <CardHeader
                                avatar={<Avatar src={post.owner ? post.owner.fileUrl : ''} />}
                                title={post.caption}
                                subheader={post.owner ? `by: ${post.owner.name}` : 'Unknown'}
                                action={
                                    <IconButton>
                                        <MoreVertIcon />
                                    </IconButton>
                                }
                            />
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
                                <Typography variant="body1">{`Pet: ${post.pet ? post.pet.name : 'Unknown'}`}</Typography>
                            </CardContent>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>
            {loading && <CircularProgress />}
        </Container>
    );
}

export default Timeline;


