/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';
import '../../bootstrap-5.2.3-dist/css/bootstrap.min.css';
import { Box, Container, TextField, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import UploadComponent from '../../pages/UploadComponent';

const PublicFigurePostForm = () => {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';
    const [publicFigures, setPublicFigures] = useState([]);
    const [selectedPublicFigure, setSelectedPublicFigure] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [fileUrl, setFileUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        fetchPublicFigures();
    }, []);

    const fetchPublicFigures = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/.netlify/functions/listPublicFigures`);
            setPublicFigures(response.data);
        } catch (error) {
            console.error('Error fetching public figures', error);
        }
    };

    const handleCreatePost = async () => {
        if (!selectedPublicFigure || !title) {
            alert('Please select a public figure and provide a title first');
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/.netlify/functions/createPublicFigurePost`, {
                publicFigureId: selectedPublicFigure,
                title,
                content,
                fileUrl,
            });

            setSelectedPublicFigure('');
            setTitle('');
            setContent('');
            setFileUrl(null);
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
                        <h2>Create Post for Public Figure</h2>
                        <form>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="publicFigure-label">Public Figure</InputLabel>
                                <Select
                                    labelId="publicFigure-label"
                                    id="publicFigure"
                                    value={selectedPublicFigure}
                                    onChange={(e) => setSelectedPublicFigure(e.target.value)}
                                    label="Public Figure"
                                >
                                    <MenuItem value="">
                                        <em>Select a public figure</em>
                                    </MenuItem>
                                    {publicFigures.map((publicFigure) => (
                                        <MenuItem key={publicFigure.id} value={publicFigure.id}>
                                            {publicFigure.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

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
                                    id="content"
                                    label="Content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    multiline
                                    rows={4}
                                />
                            </FormControl>

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
                                disabled={isUploading}
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

export default PublicFigurePostForm;
