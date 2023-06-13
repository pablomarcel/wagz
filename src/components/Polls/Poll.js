import React, { useState } from 'react';
import { Button, Card, CardContent, Typography, Box } from '@mui/material';

const Poll = ({ poll }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    const handleSubmit = () => {
        if (selectedOption) {
            console.log(`Submitted option: ${selectedOption}`);
            // Here you would usually call an API to save the answer.
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
        </Card>
    );
};

export default Poll;
