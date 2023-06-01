import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardMedia, CardContent, Typography, Container } from '@mui/material';
import { styled } from '@mui/system';

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

function ItemPost() {
    const { itemId } = useParams();
    const [item, setItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.post('/.netlify/functions/getItem', { itemId })
            .then(response => {
                setItem(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching item:', error);
                setIsLoading(false);
            });
    }, [itemId]);

    if (isLoading) {
        return <p>Loading item...</p>;
    }

    if (!item) {
        return <p>No item found for this id.</p>;
    }

    return (
        <Container maxWidth="md">
            <StyledCard>
                {item.imageUrl && item.imageUrl.endsWith('.mp4') ? (
                    <StyledCardVideo controls>
                        <source src={item.imageUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </StyledCardVideo>
                ) : (
                    <StyledCardMedia
                        image={item.imageUrl ? item.imageUrl : "https://via.placeholder.com/640x360"}
                        title="Item image"
                    />
                )}
                <CardContent>
                    <Typography variant="h5">
                        {item.name}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        {`$${item.price}`}
                    </Typography>
                    <TruncatedTypography variant="body2" color="text.secondary">
                        {item.description}
                    </TruncatedTypography>
                </CardContent>
            </StyledCard>
        </Container>
    );
}

export default ItemPost;
