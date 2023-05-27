const likePost = (user, postId, alreadyLiked, setLikedPosts, setLikeCounts) => {
    const endpoint = alreadyLiked
        ? '/.netlify/functions/unlikePost'
        : '/.netlify/functions/likesPost';

    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail: user.email, postId }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            setLikedPosts(prevState => ({...prevState, [postId]: !alreadyLiked})); // update the liked state

            // Call your backend function to get the new likes count
            return fetch('/.netlify/functions/countLikes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId }),
            });
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Update the likes count
            setLikeCounts((prev) => ({
                ...prev,
                [postId]: data.likesCount,
            }));
        })
        .catch((error) => {
            console.error('Error updating like status:', error);
        });
};

export default likePost;
