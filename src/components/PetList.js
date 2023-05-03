import React, { useState, useEffect } from 'react';
import { usePetOwner } from '../PetOwnerContext';
import '../bootstrap-5.2.3-dist/css/bootstrap.css'

const PetList = () => {
    const { petOwner } = usePetOwner();
    const [pets, setPets] = useState([]);

    useEffect(() => {
        const fetchPets = async () => {
            if (!petOwner) {
                setPets([]);
                return;
            }

            const response = await fetch('/.netlify/functions/getPets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    petOwnerId: petOwner.id,
                }),
            });

            if (response.ok) {
                const petData = await response.json();
                setPets(petData);
            } else {
                console.error('Failed to fetch pets');
            }
        };

        fetchPets();
    }, [petOwner]);

    return (
        <div>
            <h3>Pets</h3>
            {pets.length === 0 ? (
                <p>No pets found.</p>
            ) : (
                <ul>
                    {pets.map((pet) => (
                        <li key={pet.id}>{pet.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PetList;
