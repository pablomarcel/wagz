import unfollowUser from './unfollowUser';
import followUser from './followUser';

const handleFollowUser = async (postAuthorEmail, user, followedUsers, setFollowedUsers) => {
    //console.log('postAuthorEmail:', postAuthorEmail, 'user:', user);
    try {
        if (followedUsers[postAuthorEmail]) {
            await unfollowUser(user.email, postAuthorEmail);
            setFollowedUsers((prev) => ({
                ...prev,
                [postAuthorEmail]: false
            }));
        } else {
            await followUser(user.email, postAuthorEmail);
            setFollowedUsers((prev) => ({
                ...prev,
                [postAuthorEmail]: true
            }));
        }
    } catch (error) {
        console.error('Error updating follow status:', error);
    }
};

export default handleFollowUser;
