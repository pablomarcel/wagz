/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Container, Grid, IconButton, Box } from '@mui/material';
import { styled } from '@mui/system';
import PostByPublicFigure from '../PublicFigures/PostByPublicFigure';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useAuth0 } from "@auth0/auth0-react";
import {CardHeader, MoreVertIcon} from "../../pages/imports";
import AboutPublicFigure from '../MorePublicFigure/AboutPublicFigure';

const StyledCardMedia = styled(CardMedia)({
    paddingTop: '56.25%', // 16:9
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

const PublicFigureProfile = () => {
    const [publicFigureDetails, setPublicFigureDetails] = useState(null);
    const [posts, setPosts] = useState([]);
    const { publicFigureId } = useParams();
    const { user } = useAuth0();
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [currentPublicFigure, setCurrentPublicFigure] = useState(null);
    const [aboutPublicFigureOpen, setAboutPublicFigureOpen] = useState(false);

    useEffect(() => {

        const fetchPublicFigureDetails = async () => {
            const response = await fetch('/.netlify/functions/getPublicFigure', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    publicFigureId: publicFigureId,
                }),
            });
            const data = await response.json();
            setPublicFigureDetails(data);
        };

        fetchPublicFigureDetails();

        const fetchPosts = async () => {
            const response = await fetch('/.netlify/functions/getPostsByPublicFigure', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    publicFigureId: publicFigureId,
                }),
            });
            const data = await response.json();
            setPosts(data);
        };

        fetchPosts();

        const checkSubscription = async () => {
            const response = await fetch('/.netlify/functions/checkSubscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail: user.email,
                    publicFigureId: publicFigureId,
                }),
            });
            const data = await response.json();
            setIsSubscribed(data.isMember);
        };

        checkSubscription();

    }, [publicFigureId, user]);

    const handleBookmarkClick = async () => {
        if (user) {
            const response = await fetch(`/.netlify/functions/${isSubscribed ? 'unsubscribe' : 'subscribe'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail: user.email,
                    publicFigureId: publicFigureId,
                }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            setIsSubscribed(!isSubscribed);
        } else {
            console.log('No user is authenticated');
        }
    };

    const handleAboutPublicFigure = (publicFigureDetails) => {
        setCurrentPublicFigure(publicFigureDetails);
        setAboutPublicFigureOpen(true);
    };

    if (!publicFigureDetails) {
        return <div>Loading...</div>;
    }

    return (
        <Container maxWidth="md">
            <StyledCard>
                <CardHeader
                    action={
                        <IconButton onClick={() => handleAboutPublicFigure(publicFigureDetails)}>
                            <MoreVertIcon style={{ color: '#e91e63' }}/>
                        </IconButton>
                    }
                    title={publicFigureDetails.name}
                    subheader={`Occupation: ${publicFigureDetails.occupation}`}
                />
                <StyledCardMedia
                    image={publicFigureDetails.imageUrl ? publicFigureDetails.imageUrl : "https://via.placeholder.com/640x360"}
                    title="Public Figure image"
                />
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <div>
                            <Typography variant="h6">{publicFigureDetails.bio}</Typography>
                            {/* Rest of your profile details */}
                        </div>
                        <IconButton onClick={handleBookmarkClick} color="primary" aria-label="add to bookmarks" sx={{ fontSize: 40 }}>
                            {isSubscribed ? <BookmarkIcon sx={{ fontSize: 30 }} /> : <BookmarkBorderIcon sx={{ fontSize: 30 }} />}
                        </IconButton>
                    </Box>
                </CardContent>
            </StyledCard>

            <Grid container spacing={2}>
                {posts.map(post => (
                    <Grid item xs={12} sm={6} md={4} key={post.id}>
                        <StyledCard>
                            <PostByPublicFigure post={post} />
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>

            {aboutPublicFigureOpen && currentPublicFigure && (
                <AboutPublicFigure
                    open={aboutPublicFigureOpen}
                    onClose={() => setAboutPublicFigureOpen(false)}
                    publicFigure={currentPublicFigure}
                />
            )}

        </Container>
    );
};

export default PublicFigureProfile;
