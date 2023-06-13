/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import Poll from "./Poll";
import { useAuth0 } from "@auth0/auth0-react";

const PollList = () => {
    const { user, isAuthenticated } = useAuth0();
    const [polls, setPolls] = useState([]);
    const [ownerId, setOwnerId] = useState(null);

    useEffect(() => {
        const fetchOwnerId = async () => {
            try {
                const response = await fetch('/.netlify/functions/getPetOwnerByEmail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: user.email }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }

                const ownerData = await response.json();
                if (ownerData && ownerData.length > 0) {
                    setOwnerId(ownerData[0].id);
                }

            } catch (error) {
                console.error('Error fetching owner id:', error);
            }
        };

        fetchOwnerId();
    }, []);

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
                    <Poll
                        poll={poll}
                        user={ownerId}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default PollList;
