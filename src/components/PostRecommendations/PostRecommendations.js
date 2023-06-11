import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Box, CircularProgress } from '@mui/material';

function PostRecommendations() {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    const postId = "0b97f2f1-e57b-4248-b94c-b6363e925661"; // Hardcoded post ID

    useEffect(() => {
        // Fetch post recommendations when component mounts
        axios.post('/.netlify/functions/getPostRecommendations', { postId })
            .then(response => {
                setRecommendations(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching post recommendations:', error);
                setLoading(false);
            });
    }, [postId]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <List>
            {recommendations.map(recommendation => (
                <ListItem key={recommendation.id}>
                    <ListItemText
                        primary={<Typography variant="h6">Post ID: {recommendation.id}</Typography>}
                        secondary={<Typography variant="body2">Score: {recommendation.score.toFixed(2)}</Typography>}
                    />
                </ListItem>
            ))}
        </List>
    );
}

export default PostRecommendations;
