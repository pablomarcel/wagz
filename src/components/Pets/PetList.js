import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Pet from './Pet';
import { Grid } from '@mui/material';

const PetList = () => {
    const { user, isAuthenticated } = useAuth0();
    const [pets, setPets] = useState([]);

    useEffect(() => {
        const fetchPetsByOwner = async () => {
            if (isAuthenticated && user) {
                try {
                    const response = await fetch('/.netlify/functions/getPetsByOwner', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userEmail: user.email }),
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error ${response.status}`);
                    }

                    const petData = await response.json();
                    setPets(petData);
                } catch (error) {
                    console.error('Error fetching pets:', error);
                }
            }
        };

        fetchPetsByOwner();
    }, [user, isAuthenticated]);

    return (
        <Grid container spacing={3}>
            {pets.map((pet) => (
                <Grid item xs={12} md={4} key={pet.id} style={{ minHeight: '500px' }}>
                    <Pet pet={pet} />
                </Grid>
            ))}
        </Grid>
    );
};

export default PetList;
