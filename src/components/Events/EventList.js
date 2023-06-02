import React, { useEffect, useState } from 'react';
import Event from './Event';
import { Grid } from '@mui/material';

const EventList = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('/.netlify/functions/getEventItems', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }

                const eventData = await response.json();
                setEvents(eventData);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    return (
        <Grid container spacing={3}>
            {events.map((event) => (
                <Grid item xs={12} md={4} key={event.id} style={{ minHeight: '500px' }}>
                    <Event event={event} />
                </Grid>
            ))}
        </Grid>
    );
};

export default EventList;
