/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import '../bootstrap-5.2.3-dist/css/bootstrap.min.css';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { Box, Container, TextField, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select } from '@mui/material';


const Create = () => {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

    const [owners, setOwners] = useState([]);
    const [pets, setPets] = useState([]);
    const [selectedOwner, setSelectedOwner] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [ownerEmail, setOwnerEmail] = useState('');
    const [petName, setPetName] = useState('');
    const [petBreed, setPetBreed] = useState('');
    const [petAge, setPetAge] = useState('');

    useEffect(() => {
        fetchOwners();
    }, []);

    const fetchOwners = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/.netlify/functions/listPetOwners`);
            setOwners(response.data);
        } catch (error) {
            console.error('Error fetching pet owners', error);
        }
    };

    const handleCreateOwner = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/.netlify/functions/createPetOwner`, {
                name: ownerName,
                email: ownerEmail,
            });
            console.log(response.data);
            setOwnerName('');
            setOwnerEmail('');
            fetchOwners();
        } catch (error) {
            console.error('Error creating pet owner', error);
        }
    };

    const handleAddPet = async () => {
        if (!selectedOwner) {
            alert('Please select a pet owner first');
            return;
        }
        try {
            const response = await axios.post(`${API_BASE_URL}/.netlify/functions/addPet/${selectedOwner}`, {
                name: petName,
                breed: petBreed,
                age: petAge,
            });
            console.log(response.data);
            setPetName('');
            setPetBreed('');
            setPetAge('');
        } catch (error) {
            console.error('Error adding pet', error);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Card>
                    <CardContent>
                        <h2>Select Pet Owner and Create Pet</h2>
                        <form>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="petOwner-label">Pet Owner</InputLabel>
                                <Select
                                    labelId="petOwner-label"
                                    id="petOwner"
                                    value={selectedOwner}
                                    onChange={(e) => setSelectedOwner(e.target.value)}
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
                            <TextField
                                fullWidth
                                margin="normal"
                                id="petName"
                                label="Pet Name"
                                value={petName}
                                onChange={(e) => setPetName(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                id="petBreed"
                                label="Pet Breed"
                                value={petBreed}
                                onChange={(e) => setPetBreed(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                id="petAge"
                                label="Pet Age"
                                type="number"
                                value={petAge}
                                onChange={(e) => setPetAge(e.target.value)}
                            />
                            <Button
                                fullWidth
                                type="button"
                                color="primary"
                                variant="contained"
                                onClick={handleAddPet}
                                sx={{ mt: 2 }}
                            >
                                Create Pet
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default withAuthenticationRequired(Create, {
    onRedirecting: () => <div>Loading...</div>,
});

