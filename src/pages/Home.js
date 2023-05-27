/* eslint-disable no-unused-vars */
import {
    React,
    useEffect,
    useState,
    useAuth0,
    Container,
    Grid,
    Card,
    CardHeader,
    CardContent,
    Typography,
    CircularProgress,
    Alert,
    CardMedia,
    IconButton,
    CardActions,
    Box,
    Modal,
    MenuItem,
    MenuList,
    Button,
    styled,
    FavoriteIcon,
    FavoriteBorderIcon,
    CommentIcon,
    ShareIcon,
    SaveIcon,
    MoreVertIcon,
    Avatar,
    Comments,
    ShareForm,
    AboutPet
} from './imports';
import { StyledCard, StyledCardMedia } from './styledComponents';
import likePost from './likePost';
import savePost from './savePost';
import likeComment from './likeComment';
import followUser from './followUser';
import unfollowUser from './unfollowUser';
import {PersonAdd} from "@mui/icons-material";

const Home = ({ filterPosts }) => {
    const { user, isAuthenticated } = useAuth0();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likedPosts, setLikedPosts] = useState({}); // new state to keep track of liked posts
    const [savedPosts, setSavedPosts] = useState({});
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [currentPostId, setCurrentPostId] = useState(null);
    const [likedComments, setLikedComments] = useState({});
    const [followedUsers, setFollowedUsers] = useState({});
    const [shareFormOpen, setShareFormOpen] = useState(false);
    const [currentPostToShare, setCurrentPostToShare] = useState(null);
    const [aboutPetOpen, setAboutPetOpen] = useState(false);
    const [currentPet, setCurrentPet] = useState(null);


    const openComments = (postId) => {
        setCurrentPostId(postId);
        setCommentsOpen(true);
    };

    const closeComments = () => {
        setCurrentPostId(null);
        setCommentsOpen(false);
    };

    const handleLikeComment = (postId, commentId) => {
        likeComment(user.email, postId, commentId, setLikedComments);
    };

    const handleFollowUser = async (postAuthorEmail) => {
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

    const handleSharePost = async (shareToEmail) => {
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

    const handleAboutPet = (pet) => {
        setCurrentPet(pet);
        setAboutPetOpen(true);
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('/.netlify/functions/listPosts');
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }

                let data = await response.json();

                // Filter posts if filterPosts is provided and not empty
                if(filterPosts && filterPosts.length > 0){
                    data = data.filter(post => filterPosts.includes(post.id));
                }

                setPosts(data);
                setLoading(false);

                // fetch the liked posts only if the user is authenticated
                if (isAuthenticated && user) {
                    const likedResponse = await fetch('/.netlify/functions/getLikedPosts', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userEmail: user.email }),
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

                    const savedResponse = await fetch('/.netlify/functions/getSavedPosts', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userEmail: user.email }),
                    });

                    if (!savedResponse.ok) {
                        throw new Error(`HTTP error ${savedResponse.status}`);
                    }

                    const savedData = await savedResponse.json();

                    let savedPostsObj = {};
                    savedData.forEach(postId => {
                        savedPostsObj[postId] = true;
                    });
                    setSavedPosts(savedPostsObj);

                    // fetch the liked comments
                    const likedCommentsResponse = await fetch('/.netlify/functions/getLikedComments', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userEmail: user.email }),
                    });

                    if (!likedCommentsResponse.ok) {
                        throw new Error(`HTTP error ${likedCommentsResponse.status}`);
                    }

                    const likedCommentsData = await likedCommentsResponse.json();

                    // set the liked comments state
                    let likedCommentsObj = {};
                    likedCommentsData.forEach(commentId => {
                        likedCommentsObj[commentId] = true;
                    });
                    setLikedComments(likedCommentsObj);

                    // Fetch the followed owners
                    const followResponse = await fetch('/.netlify/functions/getFollowingOwners', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userEmail: user.email }),
                    });

                    if (!followResponse.ok) {
                        throw new Error(`HTTP error ${followResponse.status}`);
                    }

                    const followData = await followResponse.json();

                    // set the followed users state
                    let followObj = {};
                    followData.forEach(userEmail => {
                        followObj[userEmail] = true;
                    });
                    setFollowedUsers(followObj);

                }
            } catch (error) {
                console.error('Error fetching posts:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchPosts();
    }, [isAuthenticated, user, filterPosts]);

    return (
        <Container maxWidth="md">
            {isAuthenticated && user && (
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mt: 2, mb: 4 }}>
                    <Avatar
                        alt={user.name}
                        src={user.picture}
                        sx={{ width: 40, height: 40, marginRight: 1 }}
                    />
                    <Typography variant="h6">
                        {user.email}
                    </Typography>
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {`Error fetching data: ${error}`}
                </Alert>
            )}
            <Grid container spacing={2} justifyContent="center">
                {loading ? (
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Grid>
                ) : (
                    posts.map(({ id, caption, pet, owner, fileUrl }) => (
                        <Grid item xs={12} key={id}>
                            <StyledCard>
                                <CardHeader
                                    action={
                                        <IconButton onClick={() => handleAboutPet(pet)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    }
                                    title={`${pet ? pet.name : 'Unknown'}`}
                                    subheader={`by: ${owner ? owner.name : 'Unknown'}`}
                                />

                                <StyledCardMedia
                                    image={fileUrl ? fileUrl : "https://via.placeholder.com/640x360"}
                                    title="Post image"
                                />

                                <CardContent>
                                    <Typography variant="body1">{caption}</Typography>
                                </CardContent>
                                <CardActions disableSpacing>
                                    <IconButton aria-label="add to favorites" onClick={() => likePost(user, id, likedPosts[id], setLikedPosts)}>
                                        {likedPosts[id] ? <FavoriteIcon color="primary"/> : <FavoriteBorderIcon />}
                                    </IconButton>

                                    <IconButton aria-label="comment" onClick={() => openComments(id)}>
                                        <CommentIcon />
                                    </IconButton>
                                    <IconButton aria-label="share" onClick={() => {
                                        setCurrentPostToShare(id);
                                        setShareFormOpen(true);
                                    }}>
                                        <ShareIcon />
                                    </IconButton>
                                    <IconButton aria-label="save" onClick={() => savePost(user, id, setSavedPosts)}>
                                        {savedPosts[id] ? <SaveIcon color="primary"/> : <SaveIcon />}
                                    </IconButton>
                                    <IconButton aria-label="follow" onClick={() => handleFollowUser(owner.email)}>
                                        {followedUsers[owner.email] ? <PersonAdd color="primary"/> : <PersonAdd />}
                                    </IconButton>

                                </CardActions>
                            </StyledCard>
                        </Grid>
                    ))
                )}
            </Grid>

            {commentsOpen && user && (
                <Comments
                    postId={currentPostId}
                    userEmail={user.email}
                    userPicture={user.picture}
                    closeComments={closeComments}
                    likeComment={handleLikeComment}
                    likedComments={likedComments}
                    commentsOpen={commentsOpen}
                    handleClose={closeComments}
                />
            )}

            {user && (
                <ShareForm
                    open={shareFormOpen}
                    onClose={() => setShareFormOpen(false)}
                    onShare={handleSharePost}
                />
            )}

            {aboutPetOpen && currentPet && (
                <AboutPet
                    open={aboutPetOpen}
                    onClose={() => setAboutPetOpen(false)}
                    pet={currentPet}
                />
            )}




        </Container>
    );
};

export default Home;
