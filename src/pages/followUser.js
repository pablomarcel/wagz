/* eslint-disable no-unused-vars */
const followUser = async (followerEmail, followeeEmail) => {
    try {
        const response = await fetch('/.netlify/functions/follow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ followerEmail, followeeEmail }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();

    } catch (error) {
        console.error(error);
    }
};

export default followUser;
