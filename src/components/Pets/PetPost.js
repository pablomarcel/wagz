/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Container,
    CircularProgress,
    Box,
    CardHeader,
    IconButton,
    Grid,
    CardActionArea,
    Link
} from '@mui/material';
import { styled } from '@mui/system';
import MoreVertIcon from "@mui/icons-material/MoreVert";

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

const RecommendationCard = styled(Card)({
    maxWidth: '100%',
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#f5f5f5',
    borderRadius: '15px',
    margin: '1em',
});

function PetPost() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [pet, setPet] = useState(null);
    const [petOwner, setPetOwner] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.post('/.netlify/functions/getPostProfile', { postId })
            .then(response => {
                setPost(response.data);
                return axios.post('/.netlify/functions/getPetByPostId', { postId });
            })
            .then(response => {
                setPet(response.data);
                return axios.post('/.netlify/functions/getPetOwnerByPostId', { postId });
            })
            .then(response => {
                setPetOwner(response.data);
                return axios.post('/.netlify/functions/getPetRecommendations', { petId: pet.id });
            })
            .then(response => {
                setRecommendations(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching post, pet, pet owner profile, and recommendations:', error);
                setIsLoading(false);
            });
    }, [postId]);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!post) {
        return <p>No post found for this id.</p>;
    }

    return (
        <Container maxWidth="md">
            <StyledCard>
                <CardHeader
                    action={
                        <IconButton onClick={() => {}}>
                            <MoreVertIcon style={{ color: '#e91e63' }}/>
                        </IconButton>
                    }
                    title={`${pet ? pet.name : 'Unknown'}`}
                    subheader={`by: ${petOwner ? petOwner.name : 'Unknown'}`}

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
                    <TruncatedTypography variant="body2" color="text.secondary">
                        {post.caption}
                    </TruncatedTypography>
                </CardContent>
            </StyledCard>
            <Typography variant="h5" component="div" style={{marginTop: '1em'}}>
                Recommended Pets
            </Typography>
            <Grid container spacing={2}>
                {recommendations && recommendations.map((rec, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Link to={`/petprofile/${rec.id}`} style={{ textDecoration: 'none' }}>
                            <RecommendationCard>
                                <CardActionArea>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={rec.fileUrl ? rec.fileUrl : "https://via.placeholder.com/640x360"}
                                        alt={rec.name}
                                    />
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            {rec.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Age: {rec.age}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Breed: {rec.breed}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </RecommendationCard>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default PetPost;
