/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, Box, Snackbar, Alert } from '@mui/material';

const Poll = ({ poll, user }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [ownerId, setOwnerId] = useState(null);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    const handleSubmit = async () => {
        if (selectedOption) {
            try {
                const response = await fetch('/.netlify/functions/recordPollAnswer', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: user,
                        pollId: poll.id,
                        option: selectedOption,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }

                setMessage('Answer recorded successfully!');
                setOpen(true);
            } catch (error) {
                console.error('Error submitting answer:', error);
                setMessage('Error recording answer');
                setOpen(true);
            }
        }
    };

    return (
        <Card
            sx={{
                maxWidth: '100%',
                height: '440px',
                boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
                backgroundColor: '#f5f5f5',
                borderRadius: '15px',
            }}
        >
            <CardContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%'
                }}
            >
                <Box>
                    <Typography variant="subtitle1" color="text.secondary" align="left">
                        {poll.question}
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start'
                        }}
                    >
                        {poll.options.map((option, index) => (
                            <Button
                                variant={selectedOption === option ? "contained" : "outlined"}
                                onClick={() => handleOptionClick(option)}
                                key={index}
                                sx={{ margin: '5px' }}
                            >
                                {option}
                            </Button>
                        ))}
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'left'
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </Box>
            </CardContent>
            <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
                <Alert onClose={() => setOpen(false)} severity="success">
                    {message}
                </Alert>
            </Snackbar>
        </Card>
    );
};

export default Poll;
