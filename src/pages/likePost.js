const likePost = (user, postId, alreadyLiked, setLikedPosts) => {
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
        })
        .catch((error) => {
            console.error('Error updating like status:', error);
        });
};

export default likePost;
