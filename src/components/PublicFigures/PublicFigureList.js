import React, { useEffect, useState } from 'react';
import PublicFigure from './PublicFigure';
import { Grid } from '@mui/material';

const PublicFigureList = () => {
    const [publicFigures, setPublicFigures] = useState([]);

    useEffect(() => {
        const fetchPublicFigures = async () => {
            try {
                const response = await fetch('/.netlify/functions/getPublicFigures', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }

                const publicFigureData = await response.json();
                setPublicFigures(publicFigureData);
            } catch (error) {
                console.error('Error fetching public figures:', error);
            }
        };

        fetchPublicFigures();
    }, []);

    return (
        <Grid container spacing={3}>
            {publicFigures.map((publicFigure) => (
                <Grid item xs={12} md={4} key={publicFigure.id} style={{ minHeight: '500px' }}>
                    <PublicFigure publicFigure={publicFigure} />
                </Grid>
            ))}
        </Grid>
    );
};

export default PublicFigureList;
