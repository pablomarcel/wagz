const savePost = (user, postId, alreadySaved, setSavedPosts) => {
    const endpoint = alreadySaved
        ? '/.netlify/functions/unsavePost'
        : '/.netlify/functions/savePost';

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
            setSavedPosts(prevState => ({...prevState, [postId]: !alreadySaved}));
        })
        .catch((error) => {
            console.error('Error updating save status:', error);
        });
};

export default savePost;
