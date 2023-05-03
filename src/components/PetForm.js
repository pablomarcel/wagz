import React, { useState } from 'react';
import { usePetOwner } from '../PetOwnerContext';
import '../bootstrap-5.2.3-dist/css/bootstrap.css'

const PetForm = () => {
    const { petOwner } = usePetOwner();
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!petOwner) {
            return;
        }

        const response = await fetch('/.netlify/functions/createPet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                petOwnerId: petOwner.id,
            }),
        });

        if (response.ok) {
            setName('');
            alert('Pet added successfully');
        } else {
            console.error('Failed to add pet');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Pet Name:</label>
                <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Add Pet</button>
        </form>
    );
};

export default PetForm;
