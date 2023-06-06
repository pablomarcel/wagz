/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import '../bootstrap-5.2.3-dist/css/bootstrap.min.css';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Box, Container, TextField, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, Chip } from '@mui/material';
import UploadComponent from './UploadComponent';

const CreateCommunityPost = () => {
    const { user } = useAuth0();
    const currentUserEmail = user.email;
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';
    const [owners, setOwners] = useState([]);
    const [communities, setCommunities] = useState([]);
    const [selectedOwner, setSelectedOwner] = useState('');
    const [selectedCommunity, setSelectedCommunity] = useState('');
    const [caption, setCaption] = useState('');
    const [fileUrl, setFileUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [tags, setTags] = useState([]);
    const [chipData, setChipData] = useState([]);

    const chipColors = ['primary', 'secondary', 'success', 'error', 'warning', 'info'];

    const handleDelete = (chipToDelete) => () => {
        setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
    };

    const handleAddChip = (event) => {
        if (event.key === 'Enter') {
            setChipData([...chipData, { key: chipData.length, label: event.target.value, color: chipColors[chipData.length % chipColors.length] }]);
            event.target.value = '';
        }
    };

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

    const fetchCommunities = async (ownerId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/.netlify/functions/listCommunitiesByOwner/${ownerId}`);
            setCommunities(response.data);
        } catch (error) {
            console.error('Error fetching communities by owner', error.response.data);
        }
    };

    const handleOwnerChange = (e) => {
        setSelectedOwner(e.target.value);
        if (e.target.value) {
            fetchCommunities(e.target.value);
        } else {
            setCommunities([]);
        }
    };

    const handleCreateCommunityPost = async () => {
        if (!selectedOwner || !selectedCommunity) {
            alert('Please select a pet owner and a community first');
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/.netlify/functions/createCommunityPost`, {
                ownerId: selectedOwner,
                communityId: selectedCommunity,
                caption,
                fileUrl,
                tags: chipData.map(chip => chip.label),
            });

            setSelectedCommunity('');
            setCaption('');
            setFileUrl(null);
            setChipData([]);
        } catch (error) {
            console.error('Error creating community post', error);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Card sx={{ boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)', backgroundColor: '#f5f5f5', borderRadius: '15px' }}>
                    <CardContent>
                        <h2>Create Community Post</h2>
                        <form>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="owner-label">Owner</InputLabel>
                                <Select labelId="owner-label" id="owner" value={selectedOwner} onChange={handleOwnerChange} label="Owner">
                                    <MenuItem value=""><em>Select an owner</em></MenuItem>
                                    {owners.map((owner) => (
                                        <MenuItem key={owner.id} value={owner.id}>{owner.name} ({owner.email})</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="community-label">Community</InputLabel>
                                <Select labelId="community-label" id="community" value={selectedCommunity} onChange={(e) => setSelectedCommunity(e.target.value)} label="Community">
                                    <MenuItem value=""><em>Select a community</em></MenuItem>
                                    {communities.map((community) => (
                                        <MenuItem key={community.id} value={community.id}>{community.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField id="caption" label="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} multiline rows={4} />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <UploadComponent setFileUrl={setFileUrl} setIsUploading={setIsUploading}/>
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <Box component="span">
                                    <TextField id="standard-basic" label="Add a tag" onKeyDown={handleAddChip} />
                                </Box>
                                <Box component="span">
                                    {chipData.map((data, index) => (
                                        <Chip key={data.key} label={data.label} onDelete={handleDelete(data)} style={{ margin: '5px' }} color={data.color} />
                                    ))}
                                </Box>
                            </FormControl>
                            <Button fullWidth type="button" color="primary" variant="contained" onClick={handleCreateCommunityPost} sx={{ mt: 2 }} disabled={isUploading}>Create Post</Button>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default withAuthenticationRequired(CreateCommunityPost, {
    onRedirecting: () => <div>Loading...</div>,
});
