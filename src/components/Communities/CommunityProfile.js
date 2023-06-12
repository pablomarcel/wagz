/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Container, Grid, IconButton, Box } from '@mui/material';
import { styled } from '@mui/system';
import PostByCommunity from '../Communities/PostByCommunity';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useAuth0 } from "@auth0/auth0-react";

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

const CommunityProfile = () => {
    const [communityDetails, setCommunityDetails] = useState(null);
    const [posts, setPosts] = useState([]);
    const { communityId } = useParams();
    const { user } = useAuth0();
    const [isJoined, setIsJoined] = useState(false);

    useEffect(() => {

        const fetchCommunityDetails = async () => {
            const response = await fetch('/.netlify/functions/getCommunity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    communityId: communityId,
                }),
            });
            const data = await response.json();
            setCommunityDetails(data);
        };

        fetchCommunityDetails();

        const fetchPosts = async () => {
            const response = await fetch('/.netlify/functions/getPostsByCommunity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    communityId: communityId,
                }),
            });
            const data = await response.json();
            setPosts(data);
        };

        fetchPosts();

        const checkMembership = async () => {
            const response = await fetch('/.netlify/functions/checkMembership', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail: user.email,
                    communityId: communityId,
                }),
            });
            const data = await response.json();
            setIsJoined(data.isMember);
        };

        checkMembership();

    }, [communityId, user]);

    const handleBookmarkClick = async () => {
        if (user) {
            const response = await fetch(`/.netlify/functions/${isJoined ? 'unjoin' : 'join'}`, { // use the appropriate backend function based on the user's join status
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail: user.email,
                    communityId: communityId,
                }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            setIsJoined(!isJoined); // update the user's join status
        } else {
            console.log('No user is authenticated');
        }
    };

    if (!communityDetails) {
        return <div>Loading...</div>;
    }

    return (
        <Container maxWidth="md">
            <StyledCard>
                <StyledCardMedia
                    image={communityDetails.fileUrl ? communityDetails.fileUrl : "https://via.placeholder.com/640x360"}
                    title="Community image"
                />
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <div>
                            <Typography variant="h4">{communityDetails.name}</Typography>
                            <TruncatedTypography variant="body2" color="text.secondary">
                                <strong>About: </strong> {communityDetails.about}
                            </TruncatedTypography>
                        </div>
                        <IconButton onClick={handleBookmarkClick} color="primary" aria-label="add to bookmarks" sx={{ fontSize: 40 }}>
                            {isJoined ? <BookmarkIcon sx={{ fontSize: 30 }} /> : <BookmarkBorderIcon sx={{ fontSize: 30 }} />}
                        </IconButton>
                    </Box>
                </CardContent>
            </StyledCard>

            <Typography variant="h6" component="div"
                        style={{
                            marginTop: '1em',
                            marginBottom: '1em'
                        }}>
                Posts in this Community
            </Typography>

            <Grid container spacing={2}>
                {posts.map(post => (
                    <Grid item xs={12} sm={6} md={4} key={post.id}>
                        <StyledCard>
                            <PostByCommunity post={post} />
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );

};

export default CommunityProfile;
