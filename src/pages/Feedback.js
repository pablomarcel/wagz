/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';
import '../bootstrap-5.2.3-dist/css/bootstrap.min.css';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Box, Container, TextField, Button, Card, CardContent } from '@mui/material';

const Feedback = () => {
    const { user } = useAuth0();
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';
    const [feedbackComment, setFeedbackComment] = useState('');
    const [feedbackRating, setFeedbackRating] = useState(0);

    const handleCreateFeedback = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/.netlify/functions/createFeedback`, {
                comment: feedbackComment,
                email: user.email,
                rating: feedbackRating
            });

            setFeedbackComment('');
            setFeedbackRating(0);
        } catch (error) {
            console.error('Error creating feedback', error);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                <Card sx={{
                    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '15px',
                }}>
                    <CardContent>
                        <h2>Feedback</h2>
                        <form>
                            <TextField
                                fullWidth
                                margin="normal"
                                id="feedbackComment"
                                label="Your feedback"
                                value={feedbackComment}
                                onChange={(e) => setFeedbackComment(e.target.value)}
                                multiline
                                rows={4}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                id="feedbackRating"
                                label="Rating (1-5)"
                                type="number"
                                InputProps={{
                                    inputProps: {
                                        max: 5,
                                        min: 1
                                    }
                                }}
                                value={feedbackRating}
                                onChange={(e) => setFeedbackRating(e.target.value)}
                            />
                            <Button
                                fullWidth
                                type="button"
                                color="primary"
                                variant="contained"
                                onClick={handleCreateFeedback}
                                sx={{ mt: 2 }}
                            >
                                Submit Feedback
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default withAuthenticationRequired(Feedback, {
    onRedirecting: () => <div>Loading...</div>,
});
