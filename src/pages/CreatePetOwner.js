/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import '../bootstrap-5.2.3-dist/css/bootstrap.min.css';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Box, Container, TextField, Button, Card, CardContent } from '@mui/material';


const Create = () => {
    const { user } = useAuth0();
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';
    const [owners, setOwners] = useState([]);
    const [pets, setPets] = useState([]);
    const [selectedOwner, setSelectedOwner] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [ownerEmail, setOwnerEmail] = useState(user.email);
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
                        <h2>Create Pet Owner</h2>
                        <form>
                            <TextField
                                fullWidth
                                margin="normal"
                                id="ownerName"
                                label="Owner Name"
                                value={ownerName}
                                onChange={(e) => setOwnerName(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                id="ownerEmail"
                                label="Owner Email"
                                type="email"
                                value={ownerEmail}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <Button
                                fullWidth
                                type="button"
                                color="primary"
                                variant="contained"
                                onClick={handleCreateOwner}
                                sx={{ mt: 2 }}
                            >
                                Create Owner
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

