/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import '../../App.css';
import '../../bootstrap-5.2.3-dist/css/bootstrap.min.css';
import { Box, Container, TextField, Button, Card, CardContent, FormControl } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const PublicFigureForm = () => {
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [profession, setProfession] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [birthPlace, setBirthPlace] = useState('');
    const [nationality, setNationality] = useState('');
    const [knownFor, setKnownFor] = useState('');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const publicFigure = {
            name,
            bio,
            imageUrl,
            occupation: profession,
            birthDate,
            birthPlace,
            nationality,
            knownFor
        };

        try {
            const response = await axios.post('/.netlify/functions/createPublicFigure', publicFigure);

            // Clear the form fields
            setName('');
            setBio('');
            setImageUrl('');
            setProfession('');
            setBirthDate('');
            setBirthPlace('');
            setNationality('');
            setKnownFor('');

            // Set the Snackbar message and open it
            setMessage('Public figure created successfully!');
            setOpen(true);
        } catch (error) {
            console.error('Error creating public figure', error);

            // Set the Snackbar message and open it
            setMessage('Error creating public figure');
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
                        <h2>Create Public Figure</h2>
                        <form onSubmit={handleSubmit}>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="name"
                                    label="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="bio"
                                    label="Biography"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    multiline
                                    rows={4}
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
                                    id="profession"
                                    label="Profession"
                                    value={profession}
                                    onChange={(e) => setProfession(e.target.value)}
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="birthDate"
                                    label="Birth Date"
                                    type="date"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="birthPlace"
                                    label="Birth Place"
                                    value={birthPlace}
                                    onChange={(e) => setBirthPlace(e.target.value)}
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="nationality"
                                    label="Nationality"
                                    value={nationality}
                                    onChange={(e) => setNationality(e.target.value)}
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="knownFor"
                                    label="Known For"
                                    value={knownFor}
                                    onChange={(e) => setKnownFor(e.target.value)}
                                />
                            </FormControl>
                            <Button
                                fullWidth
                                type="submit"
                                color="primary"
                                variant="contained"
                                sx={{ mt: 2 }}
                            >
                                Create Public Figure
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

export default PublicFigureForm;
