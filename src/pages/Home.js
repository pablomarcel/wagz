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
import { StyledCard, StyledCardMedia, StyledCardVideo } from './styledComponents';
import likePostHome from './likePostHome';
import savePost from './savePost';
import likeComment from './likeComment';
import followUser from './followUser';
import unfollowUser from './unfollowUser';
import handleFollowUser from './handleFollowUser';
import { handleSharePost } from './handleSharePost';
import {PersonAdd} from "@mui/icons-material";

const Home = ({ filterPosts, searchString }) => {
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
    const [likeCounts, setLikeCounts] = useState({});
    const [petOwnerName, setPetOwnerName] = useState('');
    const [hasFetched, setHasFetched] = useState(false);
    const [petOwnerProfile, setPetOwnerProfile] = useState({
        name: '',
        bio: '',
        fileUrl: '',
    });

    console.log(searchString)


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

    const handlePostSharing = (shareToEmail) => {
        handleSharePost(shareToEmail, user, currentPostToShare);
    };

    const handleAboutPet = (pet, id) => {
        setCurrentPet(pet);
        setCurrentPostId(id);
        setAboutPetOpen(true);
    };

    useEffect(() => {
        const fetchPetOwnerProfile = async () => {
            if (isAuthenticated && user) {
                try {
                    const response = await fetch('/.netlify/functions/getPetOwnerProfile', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userEmail: user.email }),
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error ${response.status}`);
                    }

                    const petOwnerProfileData = await response.json();

                    setPetOwnerProfile(petOwnerProfileData);
                } catch (error) {
                    console.error('Error fetching pet owner profile:', error);
                }
            }
        };

        fetchPetOwnerProfile();
    }, [user, isAuthenticated]);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await fetch('/.netlify/functions/listPosts');
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }

                let data = await response.json();

                // Filter posts if filterPosts is provided and not empty
                if (filterPosts) {
                    if (filterPosts.length > 0) {
                        // If filterPosts is not empty, filter the posts
                        data = data.filter(post => filterPosts.includes(post.id));
                    } else {
                        // If filterPosts is empty, show no posts
                        data = [];
                    }
                }

                setPosts(data);
                setLoading(false);
                setHasFetched(true);

                // fetch the liked posts only if the user is authenticated
                if (isAuthenticated && user) {

                    const petOwnerNameResponse = await fetch('/.netlify/functions/getPetOwnerName', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userEmail: user.email }),
                    });

                    if (!petOwnerNameResponse.ok) {
                        throw new Error(`HTTP error ${petOwnerNameResponse.status}`);
                    }

                    const petOwnerNameData = await petOwnerNameResponse.json();

                    // Set the pet owner name state
                    setPetOwnerName(petOwnerNameData);

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
                    followData.forEach(user => {
                        followObj[user.email] = true;
                    });
                    setFollowedUsers(followObj);


                }
            } catch (error) {
                console.error('Error fetching posts:', error);
                setError(error.message);
                setLoading(false);
                setHasFetched(true);
            }
        };

        fetchPosts();
    }, [isAuthenticated, user, filterPosts]);

    return (
        <Container maxWidth="md">
            <Typography variant="h6" sx={{
                marginBottom: 6
            }}>
                {`Playing fetch in the park is my favorite!`}
            </Typography>

            {isAuthenticated && user && (
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mt: 2, mb: 4 }}>

                    <Avatar
                        alt={petOwnerProfile.name || ''}
                        src={petOwnerProfile.fileUrl || user.picture}
                        sx={{ width: 40, height: 40, marginRight: '1rem' }}
                    />
                    <Typography variant="h6">
                        {petOwnerName}
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
                    <>
                        {posts.length > 0 ? (
                            posts.map(({ id, caption, pet, owner, fileUrl }) => (
                                <Grid item xs={12} key={id}>
                                    <StyledCard>
                                        <CardHeader
                                            action={
                                                <IconButton onClick={() => handleAboutPet(pet, id)}>
                                                    <MoreVertIcon style={{ color: '#e91e63' }}/>
                                                </IconButton>
                                            }
                                            title={`${pet ? pet.name : 'Unknown'}`}
                                            subheader={`by: ${owner ? owner.name : 'Unknown'}`}
                                        />
                                        {fileUrl && fileUrl.endsWith('.mp4') ? (
                                            <StyledCardVideo controls>
                                                <source src={fileUrl} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </StyledCardVideo>
                                        ) : (
                                            <StyledCardMedia
                                                image={fileUrl ? fileUrl : "https://via.placeholder.com/640x360"}
                                                title="Post image"
                                            />
                                        )}
                                        <CardContent>
                                            <Typography variant="body1">{caption}</Typography>
                                        </CardContent>
                                        <CardActions disableSpacing>
                                            <IconButton aria-label="add to favorites" onClick={() => likePostHome(user, id, likedPosts[id], setLikedPosts, setLikeCounts)}>
                                                {likedPosts[id] ? <FavoriteIcon style={{ color: '#e91e63'}}/> : <FavoriteBorderIcon style={{ color: '#607d8b'}}/>}
                                            </IconButton>
                                            <IconButton aria-label="comment" onClick={() => openComments(id)}>
                                                <CommentIcon style={{ color: '#607d8b'}}/>
                                            </IconButton>
                                            <IconButton aria-label="share" onClick={() => {
                                                setCurrentPostToShare(id);
                                                setShareFormOpen(true);
                                            }}>
                                                <ShareIcon style={{ color: '#607d8b'}}/>
                                            </IconButton>
                                            <IconButton aria-label="save" onClick={() => savePost(user, id, savedPosts[id], setSavedPosts)}>
                                                {savedPosts[id] ? <SaveIcon style={{ color: '#1976d2'}}/> : <SaveIcon style={{ color: '#607d8b'}}/>}
                                            </IconButton>
                                            <IconButton aria-label="follow" onClick={() => handleFollowUser(owner.email, user, followedUsers, setFollowedUsers)}>
                                                {followedUsers[owner.email] ? <PersonAdd style={{ color: '#1976d2'}}/> : <PersonAdd style={{ color: '#607d8b'}}/>}
                                            </IconButton>
                                            {/*<Typography variant="body2">*/}
                                            {/*    {likeCounts[id] || 0} Likes*/}
                                            {/*</Typography>*/}
                                        </CardActions>
                                    </StyledCard>
                                </Grid>
                            ))
                        ) : hasFetched ? (
                            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                                <Typography variant="h6">
                                </Typography>
                            </Grid>
                        ) : null}
                    </>
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
                    onShare={handlePostSharing}
                />
            )}
            {aboutPetOpen && currentPet && (
                <AboutPet
                    open={aboutPetOpen}
                    onClose={() => setAboutPetOpen(false)}
                    pet={currentPet}
                    post={currentPostId}
                />
            )}
        </Container>
    );
};

export default Home;


