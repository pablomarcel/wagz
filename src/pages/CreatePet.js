/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import '../bootstrap-5.2.3-dist/css/bootstrap.min.css';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Box, Container, TextField, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import UploadComponent from './UploadComponent';

const Create = () => {
    const { user } = useAuth0();
    const currentUserEmail = user.email;
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';
    const [owners, setOwners] = useState([]);
    const [pets, setPets] = useState([]);
    const [selectedOwner, setSelectedOwner] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [ownerEmail, setOwnerEmail] = useState('');
    const [petName, setPetName] = useState('');
    const [petBreed, setPetBreed] = useState('');
    const [petAge, setPetAge] = useState('');
    const [petBio, setPetBio] = useState('');
    const [fileUrl, setFileUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);


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
                bio: petBio,
                fileUrl,
            });

            setPetName('');
            setPetBreed('');
            setPetAge('');
            setPetBio('');
            setFileUrl(null);
        } catch (error) {
            console.error('Error creating pet', error);
        }
    };


    return (
        <Container maxWidth="xs">
            <Box sx={{ display: 'flex', justifyContent: 'center'}}>
                <Card sx={{
                    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '15px',
                }}>
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
                                            {owner.name}
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
                            <TextField
                                fullWidth
                                margin="normal"
                                id="petBio"
                                label="Pet Bio"
                                value={petBio}
                                onChange={(e) => setPetBio(e.target.value)}
                            />
                            <FormControl fullWidth margin="normal">
                                <UploadComponent setFileUrl={setFileUrl} setIsUploading={setIsUploading}/>
                            </FormControl>
                            <Button
                                fullWidth
                                type="button"
                                color="primary"
                                variant="contained"
                                onClick={handleAddPet}
                                sx={{ mt: 2 }}
                                disabled={isUploading}
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

