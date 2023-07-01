const fetchSavedPosts = async (userEmail, setSavedPosts) => {
    const savedResponse = await fetch('/.netlify/functions/getSavedPosts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail: userEmail }),
    });

    if (!savedResponse.ok) {
        throw new Error(`HTTP error ${savedResponse.status}`);
    }

    const savedData = await savedResponse.json();

    // set the saved posts state
    let savedPostsObj = {};
    savedData.forEach(postId => {
        savedPostsObj[postId] = true;
    });
    setSavedPosts(savedPostsObj);
}

export default fetchSavedPosts;
