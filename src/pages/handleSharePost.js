export const handleSharePost = async (shareToEmail, user, currentPostToShare) => {
    try {
        const response = await fetch('/.netlify/functions/sharePost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sharerEmail: user.email, postId: currentPostToShare, receiverEmail: shareToEmail }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        alert("Post shared successfully!");
    } catch (error) {
        console.error('Error sharing post:', error);
    }
};
