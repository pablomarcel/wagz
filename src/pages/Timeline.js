/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Container, Grid, Card, CardHeader, CardContent, Typography, Avatar, IconButton, CircularProgress, CardMedia } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { StyledCard, StyledCardMedia, StyledCardVideo } from './styledComponents';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import SaveIcon from '@mui/icons-material/Save';
import PersonAdd from '@mui/icons-material/PersonAdd';

function Timeline() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/listPostsScroll?page=${page}`);
                setPosts(prevPosts => [...prevPosts, ...response.data]);
                setLoading(false);
            } catch (error) {
                setError(`Failed to fetch posts: ${error}`);
                setLoading(false);
            }
        };

        fetchPosts();
    }, [page]);

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <Container maxWidth="md">
            {loading && (
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Grid>
            )}

            {!loading && (
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
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <button onClick={() => setPage(prevPage => prevPage + 1)}>Load more</button>
            </Box>
        </Container>
    );
}

export default Timeline;
