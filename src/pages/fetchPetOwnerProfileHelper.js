export const fetchPetOwnerProfileHelper = async (userEmail) => {
    try {
        const response = await fetch('/.netlify/functions/getPetOwnerProfile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userEmail: userEmail }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const petOwnerProfileData = await response.json();

        return petOwnerProfileData;

    } catch (error) {
        console.error('Error fetching pet owner profile:', error);
        return null;
    }
};
