/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {React,useEffect,useState,useAuth0, Container,Grid,Card,CardHeader,CardContent,Typography,CircularProgress,Alert,CardMedia,IconButton,CardActions,Box,Modal,MenuItem,MenuList,Button,styled,FavoriteIcon,FavoriteBorderIcon,CommentIcon,ShareIcon,SaveIcon,MoreVertIcon,Avatar,Comments,ShareForm,AboutPet} from './imports';
import axios from 'axios';
import { StyledCard, StyledCardMedia, StyledCardVideo } from './styledComponents';
import likePostHome from './likePostHome';
import savePost from './savePost';
import likeComment from './likeComment';
import handleFollowUser from './handleFollowUser';
import { handleSharePost } from './handleSharePost';
import {PersonAdd} from "@mui/icons-material";
import { fetchSearchResults } from './searchHelperTimeline';
import { fetchPetOwnerProfileHelper } from './fetchPetOwnerProfileHelper';
import { getPetOwnerName } from './getPetOwnerNameHelper';
import fetchLikedPosts from './fetchLikedPosts';
import fetchSavedPosts from './fetchSavedPosts';
import fetchFollowedUsers from './fetchFollowedUsers';
import { Helmet } from 'react-helmet';

function Timeline({ filterPosts, searchString }) {
    const { user, isAuthenticated } = useAuth0();
    const [petOwnerName, setPetOwnerName] = useState('');
    const [petOwnerProfile, setPetOwnerProfile] = useState({
        name: '',
        bio: '',
        fileUrl: '',
    });
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);
    const [likedPosts, setLikedPosts] = useState({});
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
    const [hasFetched, setHasFetched] = useState(false);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [postsSearch, setPostsSearch] = useState([]);

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
                const petOwnerProfileData = await fetchPetOwnerProfileHelper(user.email);
                if (petOwnerProfileData) {
                    setPetOwnerProfile(petOwnerProfileData);
                }
            }
        };

        fetchPetOwnerProfile();
    }, [user, isAuthenticated]);

    useEffect(() => {
        if (searchString.trim() !== '') {
            fetchSearchResults(searchString, setPostsSearch);
        }
    }, [searchString]);

    const fetchPosts = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await axios.get(`/api/listPostsScroll?page=${page}`);
            setPosts(prevPosts => [...prevPosts, ...response.data]);
            setPage(prevPage => prevPage + 1);
        } catch (error) {
            console.error(`Failed to fetch posts: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // When the user scrolls down 80% of the view height, load more posts.
    useEffect(() => {
        const handleScroll = () => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight * 0.8) {
                fetchPosts();
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [fetchPosts]);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {

                // fetch the liked posts only if the user is authenticated
                if (isAuthenticated && user) {

                    try {
                        const petOwnerNameData = await getPetOwnerName(user.email);
                        setPetOwnerName(petOwnerNameData);
                    } catch (error) {
                        console.error(error);
                    }

                    fetchLikedPosts(user.email, setLikedPosts);

                    fetchSavedPosts(user.email, setSavedPosts);

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
                    fetchFollowedUsers(user.email, setFollowedUsers);

                }
            } catch (error) {
                console.error('Error fetching posts:', error);
                setError(error.message);
                setLoading(false);
                setHasFetched(true);
            }
        };

        fetchUserData();
    }, [isAuthenticated, user]);


    return (
        <Container maxWidth="md">

            <Helmet>
                <title>Wagzters - Home</title>
                <meta property="og:title" content="Wagzters - Pet Social Network" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://i.imgur.com/jrbqoWp.png" />
                <meta property="og:url" content="https://wagzters.com" />
                <meta property="og:description" content="Wagzters - the dedicated social network for pet lovers - share, cherish, and explore memories of your furry friends, making them the stars of the show." />
            </Helmet>

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
                        {petOwnerProfile.name}
                    </Typography>
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {`Error fetching data: ${error}`}
                </Alert>
            )}
            <Grid container spacing={2} justifyContent="center">
                {(searchString.trim() !== '' ? postsSearch : posts).map((post, index) => (
                    <Grid item xs={12} key={index}>
                        <StyledCard>
                            <CardHeader
                                action={
                                    <IconButton onClick={() => handleAboutPet(post.pet, post.id)}>
                                        <MoreVertIcon style={{ color: '#e91e63' }}/>
                                    </IconButton>
                                }
                                title={`${post.pet ? post.pet.name : 'Unknown'}`}
                                // subheader={`by: ${post.owner ? post.owner.name : 'Unknown'}`}
                            />
                            {post.fileUrl && post.fileUrl.endsWith('.mp4') ? (
                                <StyledCardVideo controls>
                                    <source src={post.fileUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </StyledCardVideo>
                            ) : (
                                <StyledCardMedia
                                    image={post.fileUrl ? post.fileUrl : "https://via.placeholder.com/640x360"}
                                    title="Post image"
                                />
                            )}
                            <CardContent>
                                <Typography variant="body1">{post.caption}</Typography>
                                <Typography variant="subheader"
                                            sx={{
                                                color:'grey'
                                            }}
                                >{`by: ${post.owner ? post.owner.name : 'Unknown'}`}</Typography>
                            </CardContent>
                            <CardActions disableSpacing>
                                <IconButton aria-label="add to favorites" onClick={() => likePostHome(user, post.id, likedPosts[post.id], setLikedPosts, setLikeCounts)}>
                                    {likedPosts[post.id] ? <FavoriteIcon style={{ color: '#e91e63'}}/> : <FavoriteBorderIcon style={{ color: '#607d8b'}}/>}
                                </IconButton>
                                <IconButton aria-label="comment" onClick={() => openComments(post.id)}>
                                    <CommentIcon style={{ color: '#607d8b'}}/>
                                </IconButton>
                                <IconButton aria-label="share" onClick={() => {
                                    setCurrentPostToShare(post.id);
                                    setShareFormOpen(true);
                                }}>
                                    <ShareIcon style={{ color: '#607d8b'}}/>
                                </IconButton>
                                <IconButton aria-label="save" onClick={() => savePost(user, post.id, savedPosts[post.id], setSavedPosts)}>
                                    {savedPosts[post.id] ? <SaveIcon style={{ color: '#1976d2'}}/> : <SaveIcon style={{ color: '#607d8b'}}/>}
                                </IconButton>
                                <IconButton aria-label="follow" onClick={() => handleFollowUser(post.owner.hashEmail, user, followedUsers, setFollowedUsers)}>
                                    {followedUsers[post.owner.hashEmail] ? <PersonAdd style={{ color: '#1976d2'}}/> : <PersonAdd style={{ color: '#607d8b'}}/>}
                                </IconButton>
                                {/*<Typography variant="body2">*/}
                                {/*    {likeCounts[id] || 0} Likes*/}
                                {/*</Typography>*/}
                            </CardActions>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>
            {loading &&
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Grid>
            }

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

}

export default Timeline;
