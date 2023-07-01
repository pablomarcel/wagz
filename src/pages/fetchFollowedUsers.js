const fetchFollowedUsers = async (userEmail, setFollowedUsers) => {
    const followResponse = await fetch('/.netlify/functions/getFollowingOwners', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail: userEmail }),
    });

    if (!followResponse.ok) {
        throw new Error(`HTTP error ${followResponse.status}`);
    }

    const followData = await followResponse.json();

    // set the followed users state
    let followObj = {};
    followData.forEach(user => {
        followObj[user.email] = true;
    });
    setFollowedUsers(followObj);
}

export default fetchFollowedUsers;
