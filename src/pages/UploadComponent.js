import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

const UploadComponent = ({ setFileUrl, setIsUploading }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        setIsUploading(true);  // Add this line
        if (!selectedFile) {
            alert('Please select a file first');
            return;
        }

        try {
            // Step 1: Request a signed URL

            const response = await axios.post(`${API_BASE_URL}/.netlify/functions/generateSignedUrl`, {
                fileName: selectedFile.name,
                contentType: selectedFile.type  // Pass the file's actual content type
            });


            const signedUrl = response.data.signedUrl;
            //console.log('Received signed URL:', signedUrl);  // Add this log

            // Step 2: Upload the file to S3
            await axios.put(signedUrl, selectedFile, {
                headers: {
                    'Content-Type': selectedFile.type,  // Make sure this matches the signed URL's ContentType
                },
            }).catch((error) => {
                console.error('Error response:', error.response);  // Add this log
                throw error;
            });


            // Step 3: Save the file URL to be used when creating the post
            const fileUrl = signedUrl.split('?')[0];
            setFileUrl(fileUrl);
            setIsUploading(false);  // Add this line

        } catch (error) {
            console.error('Error uploading file', error);
        }
    };



    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <Button variant="contained" color="primary" onClick={handleUpload}>
                Upload
            </Button>
        </div>
    );
};

export default UploadComponent;
