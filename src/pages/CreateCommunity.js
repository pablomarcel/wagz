/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import '../bootstrap-5.2.3-dist/css/bootstrap.min.css';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Box, Container, TextField, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import UploadComponent from './UploadComponent';

const CreateCommunity = () => {
    const { user } = useAuth0();
    const currentUserEmail = user.email;
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';
    const [owners, setOwners] = useState([]);
    const [selectedOwner, setSelectedOwner] = useState('');
    const [communityName, setCommunityName] = useState('');
    const [communityAbout, setCommunityAbout] = useState('');
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



    const handleAddCommunity = async () => {
        if (!selectedOwner) {
            alert('Please select an owner first');
            return;
        }

        console.log('Sending fileUrl:', fileUrl);

        try {
            const response = await axios.post(`${API_BASE_URL}/.netlify/functions/addCommunity/${selectedOwner}`, {
                name: communityName,
                about: communityAbout,
                fileUrl,
            });

            setCommunityName('');
            setCommunityAbout('');
            setFileUrl(null);
        } catch (error) {
            console.error('Error creating community', error);
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
                        <h2>Select Owner and Create Community</h2>
                        <form>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="owner-label">Owner</InputLabel>
                                <Select
                                    labelId="owner-label"
                                    id="owner"
                                    value={selectedOwner}
                                    onChange={(e) => setSelectedOwner(e.target.value)}
                                    label="Owner"
                                >
                                    <MenuItem value="">
                                        <em>Select an owner</em>
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
                                id="communityName"
                                label="Community Name"
                                value={communityName}
                                onChange={(e) => setCommunityName(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                id="communityAbout"
                                label="Community About"
                                value={communityAbout}
                                onChange={(e) => setCommunityAbout(e.target.value)}
                            />
                            <FormControl fullWidth margin="normal">
                                <UploadComponent setFileUrl={setFileUrl} setIsUploading={setIsUploading}/>
                            </FormControl>
                            <Button
                                fullWidth
                                type="button"
                                color="primary"
                                variant="contained"
                                onClick={handleAddCommunity}
                                sx={{ mt: 2 }}
                                disabled={isUploading}
                            >
                                Create Community
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );

};

export default withAuthenticationRequired(CreateCommunity, {
    onRedirecting: () => <div>Loading...</div>,
});
