import React, { useState } from 'react';
import { usePetOwner } from '../PetOwnerContext';
import PetList from './PetList';
import '../bootstrap-5.2.3-dist/css/bootstrap.css'

const PostForm = () => {
    const { petOwner } = usePetOwner();
    const [selectedPet, setSelectedPet] = useState(null);
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!petOwner || !selectedPet) {
            return;
        }

        const response = await fetch('/.netlify/functions/createPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content,
                petId: selectedPet.id,
                petOwnerId: petOwner.id,
            }),
        });

        if (response.ok) {
            setContent('');
            alert('Post created successfully');
        } else {
            console.error('Failed to create post');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="content">Content:</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="pet">Pet:</label>
                <PetList onChange={(selectedPet) => setSelectedPet(selectedPet)} />
            </div>
            <button type="submit">Create Post</button>
        </form>
    );
};

export default PostForm;
