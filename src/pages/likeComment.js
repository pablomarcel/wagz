const likeComment = (user, postId, commentId, setLikedComments) => {
    fetch('/.netlify/functions/likeComment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail: user.email, postId, commentId }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {

            setLikedComments(prevState => ({...prevState, [commentId]: true})); // update the liked state
        })
        .catch((error) => {
            console.error('Error liking comment:', error);
        });
};

export default likeComment;
