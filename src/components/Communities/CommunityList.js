import React, { useEffect, useState } from 'react';
import Community from './Community';
import { Grid } from '@mui/material';

const CommunityList = () => {
    const [communities, setCommunities] = useState([]);

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const response = await fetch('/.netlify/functions/getCommunities', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }

                const communityData = await response.json();
                setCommunities(communityData);
            } catch (error) {
                console.error('Error fetching communities:', error);
            }
        };

        fetchCommunities();
    }, []);

    return (
        <Grid container spacing={3}>
            {communities.map((community) => (
                <Grid item xs={12} md={4} key={community.id} style={{ minHeight: '500px' }}>
                    <Community community={community} />
                </Grid>
            ))}
        </Grid>
    );
};

export default CommunityList;
