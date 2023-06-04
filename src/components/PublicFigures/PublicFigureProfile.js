/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Container, Grid } from '@mui/material';
import { styled } from '@mui/system';
import PostByPublicFigure from '../PublicFigures/PostByPublicFigure';

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

const PublicFigureProfile = () => {
    const [publicFigureDetails, setPublicFigureDetails] = useState(null);
    const [posts, setPosts] = useState([]);
    const { publicFigureId } = useParams();

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

    }, [publicFigureId]);

    if (!publicFigureDetails) {
        return <div>Loading...</div>;
    }

    return (
        <Container maxWidth="md">
            <StyledCard>
                <StyledCardMedia
                    image={publicFigureDetails.imageUrl ? publicFigureDetails.imageUrl : "https://via.placeholder.com/640x360"}
                    title="Public Figure image"
                />
                <CardContent>
                    <Typography variant="h4">{publicFigureDetails.name}</Typography>
                    <TruncatedTypography variant="body2" color="text.secondary">
                        <strong>Occupation: </strong> {publicFigureDetails.occupation}
                    </TruncatedTypography>
                    <TruncatedTypography variant="body2" color="text.secondary">
                        <strong>BirthDate: </strong> {publicFigureDetails.birthDate}
                    </TruncatedTypography>
                    <TruncatedTypography variant="body2" color="text.secondary">
                        <strong>BirthPlace: </strong> {publicFigureDetails.birthPlace}
                    </TruncatedTypography>
                    <TruncatedTypography variant="body2" color="text.secondary">
                        <strong>Nationality: </strong> {publicFigureDetails.nationality}
                    </TruncatedTypography>
                    <TruncatedTypography variant="body2" color="text.secondary">
                        <strong>Known for: </strong> {publicFigureDetails.knownFor}
                    </TruncatedTypography>
                    <TruncatedTypography variant="body2" color="text.secondary">
                        <strong>Bio: </strong> {publicFigureDetails.bio}
                    </TruncatedTypography>
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

        </Container>
    );
};

export default PublicFigureProfile;
