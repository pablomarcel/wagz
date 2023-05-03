import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const PetOwnerContext = createContext();

export const usePetOwner = () => useContext(PetOwnerContext);

export const PetOwnerProvider = ({ children }) => {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [petOwner, setPetOwner] = useState(null);

    useEffect(() => {
        const fetchPetOwner = async () => {
            if (!isAuthenticated) {
                setPetOwner(null);
                return;
            }

            const token = await getAccessTokenSilently();
            const response = await fetch('/.netlify/functions/getPetOwner', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const petOwnerData = await response.json();
                setPetOwner(petOwnerData);
            } else {
                console.error('Failed to fetch pet owner');
            }
        };

        fetchPetOwner();
    }, [isAuthenticated, user, getAccessTokenSilently]);

    const value = {
        petOwner,
        setPetOwner,
    };

    return <PetOwnerContext.Provider value={value}>{children}</PetOwnerContext.Provider>;
};
