/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Typography, Box, Card, CardContent } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

const ActivityTransactions = () => {
    const [loading, setLoading] = useState(true);
    const { user, isAuthenticated } = useAuth0();
    const [petOwnerProfile, setPetOwnerProfile] = useState({
        name: '',
        bio: '',
        fileUrl: '',
        id: ''
    });
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchPetOwnerProfile = async () => {
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

                    if (!petOwnerProfileData.id) {
                        console.log('No pet owner profile found for this user.');
                        setLoading(false);
                        return;  // Exit the function early if no profile found
                    }

                    setPetOwnerProfile(petOwnerProfileData);

                    const transactionsResponse = await fetch('/.netlify/functions/getTransactionsByUser', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userId: petOwnerProfileData.id }),
                    });

                    if (!transactionsResponse.ok) {
                        throw new Error(`HTTP error ${transactionsResponse.status}`);
                    }

                    const transactionsData = await transactionsResponse.json();

                    // Formatting the timestamp
                    transactionsData.forEach(transaction => {
                        const timestamp = transaction.Transaction.properties.timestamp;

                        // Convert the timestamp to a JavaScript Date
                        const timestampDate = new Date(
                            timestamp.year.low,
                            timestamp.month.low - 1,
                            timestamp.day.low,
                            timestamp.hour.low,
                            timestamp.minute.low,
                            timestamp.second.low,
                            timestamp.nanosecond.low / 1000000  // Convert nanoseconds to milliseconds
                        );

                        transaction.Transaction.properties.formattedTimestamp = timestampDate.toLocaleString();
                    });

                    setTransactions(transactionsData);
                } catch (error) {
                    console.error('Error fetching pet owner profile or transactions:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchPetOwnerProfile();
    }, [user, isAuthenticated]);

    return (
        <div>
            <Typography
                variant="h6"
                component="h1"
                sx={{
                    marginBottom: '1em'
                }}
            >Activity Transactions</Typography>
            {loading ? (
                <CircularProgress />
            ) : (
                transactions.map((transaction, index) => (
                    <Card key={index}>
                        <CardContent>
                            <Typography variant="h6" align="left">Transaction #{index + 1}</Typography>
                            <Typography variant="subtitle1" align="left">Subscribed to: {transaction.PublicFigure.properties.name}</Typography>
                            <Typography variant="subtitle1" align="left">Transaction type: {transaction.Transaction.properties.type}</Typography>
                            <Typography variant="subtitle1" align="left">Transaction timestamp: {transaction.Transaction.properties.formattedTimestamp}</Typography>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
};

export default ActivityTransactions;
