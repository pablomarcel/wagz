import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import Poll from "./Poll";

const PollList = () => {
    const [polls, setPolls] = useState([]);

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const response = await fetch('/.netlify/functions/getPollItems', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }

                const pollData = await response.json();
                setPolls(pollData);
            } catch (error) {
                console.error('Error fetching polls:', error);
            }
        };

        fetchPolls();
    }, []);

    return (
        <Grid container spacing={3}>
            {polls.map((poll) => (
                <Grid item xs={12} md={4} key={poll.id} style={{ minHeight: '500px' }}>
                    <Poll poll={poll} />
                </Grid>
            ))}
        </Grid>
    );
};

export default PollList;
