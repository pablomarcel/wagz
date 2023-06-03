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
    const { publicFigureId } = useParams();
    const [publicFigure, setPublicFigure] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.post('/.netlify/functions/getPublicFigure', { publicFigureId })
            .then(response => {
                setPublicFigure(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching public figure:', error);
                setIsLoading(false);
            });
    }, [publicFigureId]);

    if (isLoading) {
        return <p>Loading public figure...</p>;
    }

    if (!publicFigure) {
        return <p>No public figure found for this id.</p>;
    }

    return (
        <Container maxWidth="md">
            <StyledCard>
                <StyledCardMedia
                    image={publicFigure.imageUrl ? publicFigure.imageUrl : "https://via.placeholder.com/640x360"}
                    title="Public figure image"
                />
                <CardContent>
                    <Typography variant="h5">
                        {publicFigure.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Occupation: {publicFigure.occupation}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Birth Date: {publicFigure.birthDate}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Birth Place: {publicFigure.birthPlace}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Nationality: {publicFigure.nationality}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Known For: {publicFigure.knownFor}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {publicFigure.bio}
                    </Typography>
                </CardContent>
            </StyledCard>
        </Container>
    );
}

export default PublicFigurePost;
