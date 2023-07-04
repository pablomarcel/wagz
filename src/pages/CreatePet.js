/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Box, Container, TextField, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, Chip } from '@mui/material';
import UploadComponent from './UploadComponent';
import {Helmet} from "react-helmet";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

const Create = () => {
    const { user } = useAuth0();
    const currentUserEmail = user.email;

    const [owners, setOwners] = useState([]);
    const [selectedOwner, setSelectedOwner] = useState('');
    const [petName, setPetName] = useState('');
    const [petBreed, setPetBreed] = useState('');
    const [petAge, setPetAge] = useState('');
    const [petBio, setPetBio] = useState('');
    const [fileUrl, setFileUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [chipData, setChipData] = useState([]);
    const chipColors = ['primary', 'secondary', 'success', 'error', 'warning', 'info'];

    useEffect(() => {
        fetchOwners();
    }, []);

    const handleDelete = (chipToDelete) => () => {
        setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
    };

    const handleAddChip = (event) => {
        if (event.key === 'Enter') {
            setChipData([...chipData, { key: chipData.length, label: event.target.value, color: chipColors[chipData.length % chipColors.length] }]);
            event.target.value = '';
        }
    };

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
        if (!selectedOwner || !petName) {
            alert('Please select a pet owner and enter a pet name');
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/.netlify/functions/addPet/${selectedOwner}`, {
                name: petName,
                breed: petBreed,
                age: petAge,
                fileUrl,
                bio: petBio,
                tags: chipData.map(chip => chip.label),
            });

            setSelectedOwner('');
            setPetName('');
            setPetBreed('');
            setPetAge('');
            setPetBio('');
            setFileUrl(null);
            setChipData([]);
        } catch (error) {
            console.error('Error adding pet', error);
        }
    };

    return (
        <Container maxWidth="xs">
            <Helmet>
                <title>Wagzters - Create Pet</title>
                <meta name="description" content="Create a new pet profile on Wagzters - the dedicated social network for pet lovers. Connect your pet with the pet owner first to get started."/>
                <meta property="og:title" content="Wagzters - Create Pet" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://i.imgur.com/jrbqoWp.png" />
                <meta property="og:url" content="https://wagzters.com/createPet" />
                <meta property="og:description" content="Create a new pet profile on Wagzters - the dedicated social network for pet lovers. Connect your pet with the pet owner first to get started." />
            </Helmet>

            <Box sx={{display: 'flex',justifyContent: 'center'}}>
                <Card sx={{boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',backgroundColor: '#f5f5f5',borderRadius: '15px'}}>
                    <CardContent>
                        <h2>Create Pet</h2>
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
                                    <MenuItem value=""><em>Select a pet owner</em></MenuItem>
                                    {owners.map((owner) => (
                                        <MenuItem key={owner.id} value={owner.id}>{owner.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="petName"
                                    label="Pet Name"
                                    value={petName}
                                    onChange={(e) => setPetName(e.target.value)}
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="petBreed"
                                    label="Pet Breed"
                                    value={petBreed}
                                    onChange={(e) => setPetBreed(e.target.value)}
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="petAge"
                                    label="Pet Age"
                                    value={petAge}
                                    onChange={(e) => setPetAge(e.target.value)}
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="petBio"
                                    label="Pet Bio"
                                    value={petBio}
                                    onChange={(e) => setPetBio(e.target.value)}
                                    multiline
                                    rows={4}
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <Box component="span">
                                    <TextField
                                        id="standard-basic"
                                        label="Add a tag"
                                        onKeyDown={handleAddChip}
                                    />
                                </Box>
                                <Box component="span">
                                    {chipData.map((data, index) => (
                                        <Chip
                                            key={data.key}
                                            label={data.label}
                                            onDelete={handleDelete(data)}
                                            style={{ margin: '5px' }}
                                            color={data.color}
                                        />
                                    ))}
                                </Box>
                            </FormControl>
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

