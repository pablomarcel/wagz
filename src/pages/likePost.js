// likePost.js
const likePost = (user, postId, setLikedPosts) => {
    fetch('/.netlify/functions/likesPost', {
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
            setLikedPosts(prevState => ({...prevState, [postId]: true})); // update the liked state
        })
        .catch((error) => {
            console.error('Error liking post:', error);
        });
};

export default likePost;
