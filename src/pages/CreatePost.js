/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import '../bootstrap-5.2.3-dist/css/bootstrap.min.css';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Box, Container, TextField, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import UploadComponent from './UploadComponent'; // Remember to import UploadComponent here

const CreatePost = () => {
    const { user } = useAuth0();
    const currentUserEmail = user.email;
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';
    const [owners, setOwners] = useState([]);
    const [pets, setPets] = useState([]);
    const [selectedOwner, setSelectedOwner] = useState('');
    const [selectedPet, setSelectedPet] = useState('');
    const [caption, setCaption] = useState('');
    const [fileUrl, setFileUrl] = useState(null);  // Add a state for the file URL
    const [isUploading, setIsUploading] = useState(false);  // Add this line



    useEffect(() => {
        fetchOwners();
    }, []);

    const fetchOwners = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/.netlify/functions/listPetOwners`);
            const filteredOwners = response.data.filter(owner => owner.email === currentUserEmail);
            setOwners(filteredOwners);
        } catch (error) {
            console.error('Error fetching pet owners', error);
        }
    };

    const fetchPets = async (ownerId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/.netlify/functions/listPetsByOwner/${ownerId}`);
            setPets(response.data);
        } catch (error) {
            console.error('Error fetching pets by owner', error.response.data);
        }
    };

    const handleOwnerChange = (e) => {
        setSelectedOwner(e.target.value);
        if (e.target.value) {
            fetchPets(e.target.value);
        } else {
            setPets([]);
        }
    };

    const handleCreatePost = async () => {
        if (!selectedOwner || !selectedPet) {
            alert('Please select a pet owner and a pet first');
            return;
        }

        console.log('Sending fileUrl:', fileUrl);

        try {
            const response = await axios.post(`${API_BASE_URL}/.netlify/functions/createPost`, {
                petOwnerId: selectedOwner,
                petId: selectedPet,
                caption,
                fileUrl,  // Add the fileUrl to the post data
            });

            setSelectedPet('');
            setCaption('');
            setFileUrl(null);  // Reset the file URL
        } catch (error) {
            console.error('Error creating post', error);
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
                        <h2>Create Post</h2>
                        <form>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="petOwner-label">Pet Owner</InputLabel>
                                <Select
                                    labelId="petOwner-label"
                                    id="petOwner"
                                    value={selectedOwner}
                                    onChange={handleOwnerChange}
                                    label="Pet Owner"
                                >
                                    <MenuItem value="">
                                        <em>Select a pet owner</em>
                                    </MenuItem>
                                    {owners.map((owner) => (
                                        <MenuItem key={owner.id} value={owner.id}>
                                            {owner.name} ({owner.email})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth margin="normal">
                                <InputLabel id="pet-label">Pet</InputLabel>
                                <Select
                                    labelId="pet-label"
                                    id="pet"
                                    value={selectedPet}
                                    onChange={(e) => setSelectedPet(e.target.value)}
                                    label="Pet"
                                >
                                    <MenuItem value="">
                                        <em>Select a pet</em>
                                    </MenuItem>
                                    {pets.map((pet) => (
                                        <MenuItem key={pet.id} value={pet.id}>
                                            {pet.name} ({pet.breed}, {pet.age} years old)
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="caption"
                                    label="Caption"
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    multiline
                                    rows={4}
                                />
                            </FormControl>

                            {/* Include the UploadComponent here */}
                            <FormControl fullWidth margin="normal">
                                <UploadComponent setFileUrl={setFileUrl} setIsUploading={setIsUploading}/>
                            </FormControl>

                            <Button
                                fullWidth
                                type="button"
                                color="primary"
                                variant="contained"
                                onClick={handleCreatePost}
                                sx={{ mt: 2 }}
                                disabled={isUploading}  // Add this line
                            >
                                Create Post
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default withAuthenticationRequired(CreatePost, {
    onRedirecting: () => <div>Loading...</div>,
});
