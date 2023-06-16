/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { Typography, Box, Card, CardContent, CircularProgress } from '@mui/material';
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

const Subscriptions = () => {
    const { user, isAuthenticated } = useAuth0();
    const [loading, setLoading] = useState(true);
    const [petOwnerProfile, setPetOwnerProfile] = useState({
        name: '',
        bio: '',
        fileUrl: '',
        id: ''
    });
    const [subscriptions, setSubscriptions] = useState([]);

    useEffect(() => {
        const fetchPetOwnerProfileAndSubscriptions = async () => {
            if (isAuthenticated && user) {
                try {
                    const response = await fetch('/.netlify/functions/getPetOwnerProfile', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userEmail: user.email }),
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error ${response.status}`);
                    }

                    const petOwnerProfileData = await response.json();

                    setPetOwnerProfile(petOwnerProfileData);

                    const subscriptionsResponse = await fetch('/.netlify/functions/getSubscriptionsByUser', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userId: petOwnerProfileData.id }),
                    });

                    if (!subscriptionsResponse.ok) {
                        throw new Error(`HTTP error ${subscriptionsResponse.status}`);
                    }

                    const subscriptionsData = await subscriptionsResponse.json();

                    setSubscriptions(subscriptionsData);
                } catch (error) {
                    console.error('Error fetching pet owner profile or subscriptions:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchPetOwnerProfileAndSubscriptions();
    }, [user, isAuthenticated]);

    return (
        <Box>
            <Typography
                variant="h6"
                component="h1"
                sx={{
                    marginBottom: '1em'
                }}
            >Subscriptions</Typography>
            {loading ? (
                <CircularProgress />
            ) : (
                subscriptions.map((subscription, index) => (
                    <Card
                        key={index}
                        sx={{
                            marginBottom:'1em'
                        }}
                    >
                        <CardContent>
                            <Typography
                                variant="subtitle1"
                                align="left"
                            >
                                {subscription.properties.name}
                            </Typography>
                            {/*<Typography variant="body1">{subscription.properties.bio}</Typography>*/}
                            {/*<Typography variant="body2">{subscription.properties.occupation}</Typography>*/}
                        </CardContent>
                    </Card>
                ))
            )}
        </Box>
    );
};

export default Subscriptions;
