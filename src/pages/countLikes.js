const countLikes = async (postId) => {
    try {
        const response = await fetch('/.netlify/functions/countLikes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postId }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();

        return data.likesCount; // Update this line

    } catch (error) {
        console.error('Error counting likes:', error);
        return 0; // Return 0 on error
    }
};

export default countLikes;
