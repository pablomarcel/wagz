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

function EventPost() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.post('/.netlify/functions/getEvent', { eventId })
            .then(response => {
                setEvent(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching event:', error);
                setIsLoading(false);
            });
    }, [eventId]);

    if (isLoading) {
        return <p>Loading event...</p>;
    }

    if (!event) {
        return <p>No event found for this id.</p>;
    }

    return (
        <Container maxWidth="md">
            <StyledCard>
                <StyledCardMedia
                    image={event.imageUrl ? event.imageUrl : "https://via.placeholder.com/640x360"}
                    title="Event image"
                />
                <CardContent>
                    <Typography variant="h5">
                        {event.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Date: {event.date}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Location: {event.location}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Organizer: {event.organizer}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {event.description}
                    </Typography>
                </CardContent>
            </StyledCard>
        </Container>
    );
}

export default EventPost;
