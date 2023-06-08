/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import '../../App.css';
import '../../bootstrap-5.2.3-dist/css/bootstrap.min.css';
import { Box, Container, TextField, Button, Card, CardContent, FormControl } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const EventForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [organizer, setOrganizer] = useState('');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const eventItem = { title, description, date, location, imageUrl, organizer };

        try {
            const response = await axios.post('/.netlify/functions/createEventItem', eventItem);

            // Clear the form fields
            setTitle('');
            setDescription('');
            setDate('');
            setLocation('');
            setImageUrl('');
            setOrganizer('');

            // Set the Snackbar message and open it
            setMessage('Event created successfully!');
            setOpen(true);
        } catch (error) {
            console.error('Error creating event', error);

            // Set the Snackbar message and open it
            setMessage('Error creating event');
            setOpen(true);
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
                        <h2>Create Event</h2>
                        <form onSubmit={handleSubmit}>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="title"
                                    label="Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="description"
                                    label="Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    multiline
                                    rows={4}
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="date"
                                    label="Date"
                                    type="datetime-local"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="location"
                                    label="Location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="imageUrl"
                                    label="Image URL"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="organizer"
                                    label="Organizer"
                                    value={organizer}
                                    onChange={(e) => setOrganizer(e.target.value)}
                                />
                            </FormControl>
                            <Button
                                fullWidth
                                type="submit"
                                color="primary"
                                variant="contained"
                                sx={{ mt: 2 }}
                            >
                                Create Event
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Box>
            <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
                <Alert onClose={() => setOpen(false)} severity="success">
                    {message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default EventForm;
