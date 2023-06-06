/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardMedia, CardContent, Typography, Container, IconButton, Box } from '@mui/material';
import { styled } from '@mui/system';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useAuth0 } from "@auth0/auth0-react";

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
    const { user } = useAuth0();
    const [isJoined, setIsJoined] = useState(false);

    useEffect(() => {
        axios.post('/.netlify/functions/getEvent', { eventId })
            .then(response => {
                setEvent(response.data);
            })
            .catch(error => {
                console.error('Error fetching event:', error);
            });

        const checkEventMembership = async () => {
            const response = await fetch('/.netlify/functions/checkEventMembership', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail: user.email,
                    eventId: eventId,
                }),
            });
            const data = await response.json();
            setIsJoined(data.isMember);
        };

        checkEventMembership();

    }, [eventId, user]);

    const handleBookmarkClick = async () => {
        if (user) {
            const response = await fetch(`/.netlify/functions/${isJoined ? 'unjoinEvent' : 'joinEvent'}`, { // use the appropriate backend function based on the user's join status
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail: user.email,
                    eventId: eventId,
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

    if (!event) {
        return <p>Loading event...</p>;
    }

    return (
        <Container maxWidth="md">
            <StyledCard>
                <StyledCardMedia
                    image={event.imageUrl ? event.imageUrl : "https://via.placeholder.com/640x360"}
                    title="Event image"
                />
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <div>
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
                        </div>
                        <IconButton onClick={handleBookmarkClick} color="primary" aria-label="add to bookmarks" sx={{ fontSize: 40 }}>
                            {isJoined ? <BookmarkIcon sx={{ fontSize: 30 }} /> : <BookmarkBorderIcon sx={{ fontSize: 30 }} />}
                        </IconButton>
                    </Box>
                </CardContent>
            </StyledCard>
        </Container>
    );
}

export default EventPost;
