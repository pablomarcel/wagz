/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {Card, CardMedia, CardContent, Typography, Container, Grid, Link, CardActionArea} from '@mui/material';
import { styled } from '@mui/system';
import Post from '../Posts/Post';
import axios from 'axios';


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


const PetProfile = () => {
    const [petDetails, setPetDetails] = useState(null);
    const [posts, setPosts] = useState([]);
    const { petId } = useParams(); // Extract the petId from the route params
    const [recommendations, setRecommendations] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPetDetails = async () => {
            const response = await fetch('/.netlify/functions/getPet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    petId: petId,
                }),
            });
            const data = await response.json();
            setPetDetails(data);
        };

        fetchPetDetails();

        const fetchPosts = async () => {
            const response = await fetch('/.netlify/functions/getPostsByPet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    petId: petId,
                }),
            });
            const data = await response.json();

            setPosts(data);
        };

        fetchPosts();

        axios.post('/.netlify/functions/getPetRecommendations', { petId: petId })
            .then(response => {
                setRecommendations(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching pet recommendations:', error);
                setIsLoading(false);
            });

    }, [petId]);

    if (!petDetails) {
        return <div>Loading...</div>; // or a loading indicator
    }

    return (
        <Container maxWidth="md">
            <StyledCard>
                {petDetails.fileUrl && petDetails.fileUrl.endsWith('.mp4') ? (
                    <StyledCardVideo controls>
                        <source src={petDetails.fileUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </StyledCardVideo>
                ) : (
                    <StyledCardMedia
                        image={petDetails.fileUrl ? petDetails.fileUrl : "https://via.placeholder.com/640x360"}
                        title="Pet image"
                    />
                )}
                <CardContent>
                    <Typography variant="h4">{petDetails.name}</Typography>
                    <TruncatedTypography variant="body2" color="text.secondary">
                        <strong>Age: </strong> {petDetails.age}
                    </TruncatedTypography>
                    <TruncatedTypography variant="body2" color="text.secondary">
                        <strong>Breed: </strong> {petDetails.breed}
                    </TruncatedTypography>
                    <TruncatedTypography variant="body2" color="text.secondary">
                        <strong>Bio: </strong> {petDetails.bio}
                    </TruncatedTypography>
                    {/* Add more pet attributes if you have them */}
                </CardContent>
            </StyledCard>

            <Typography variant="h6" component="div" style={{marginTop: '1em'}}>
                Posts by this Pet
            </Typography>

            <Grid container spacing={2}>
                {posts.map(post => (
                    <Grid item xs={12} sm={6} md={4} key={post.id} style={{ minHeight: '500px' }}>
                        <StyledCard>
                            <Post post={post} />
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>

            <Typography variant="h6" component="div" style={{marginTop: '1em'}}>
                Suggested Pets
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
};

export default PetProfile;
