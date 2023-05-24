const savePost = (user, postId, setSavedPosts) => {
    fetch('/.netlify/functions/savePost', {
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
            setSavedPosts(prevState => ({...prevState, [postId]: true}));
        })
        .catch((error) => {
            console.error('Error saving post:', error);
        });
};

export default savePost;
