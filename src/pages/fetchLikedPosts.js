const fetchLikedPosts = async (userEmail, setLikedPosts) => {
    const likedResponse = await fetch('/.netlify/functions/getLikedPosts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail: userEmail }),
    });

    if (!likedResponse.ok) {
        throw new Error(`HTTP error ${likedResponse.status}`);
    }

    const likedData = await likedResponse.json();

    // set the liked posts state
    let likedPostsObj = {};
    likedData.forEach(postId => {
        likedPostsObj[postId] = true;
    });
    setLikedPosts(likedPostsObj);
}

export default fetchLikedPosts;
