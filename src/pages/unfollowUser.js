/* eslint-disable no-unused-vars */
const unfollowUser = async (followerEmail, unfolloweeEmail) => {
    try {
        const response = await fetch('/.netlify/functions/unfollow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ followerEmail, unfolloweeEmail }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();

    } catch (error) {
        console.error(error);
    }
};

export default unfollowUser;
