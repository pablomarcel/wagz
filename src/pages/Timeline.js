/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {React,useEffect,useState,useAuth0, Container,Grid,Card,CardHeader,CardContent,Typography,CircularProgress,Alert,CardMedia,IconButton,CardActions,Box,Modal,MenuItem,MenuList,Button,styled,FavoriteIcon,FavoriteBorderIcon,CommentIcon,ShareIcon,SaveIcon,MoreVertIcon,Avatar,Comments,ShareForm,AboutPet} from './imports';
import axios from 'axios';
import { StyledCard, StyledCardMedia, StyledCardVideo } from './styledComponents';
import likePostHome from './likePostHome';
import savePost from './savePost';
import likeComment from './likeComment';
import followUser from './followUser';
import unfollowUser from './unfollowUser';
import handleFollowUser from './handleFollowUser';
import { handleSharePost } from './handleSharePost';
import {PersonAdd} from "@mui/icons-material";
import { fetchSearchResults } from './searchHelper';
import { fetchPetOwnerProfileHelper } from './fetchPetOwnerProfileHelper';

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
        fetchSearchResults(searchString, setSearchResults);
    }, [searchString]);

    useEffect(() => {
        //console.log(searchResults);
    }, [searchResults]);


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
                {posts.map((post, index) => (
                    <Grid item xs={12} key={index}>
                        <StyledCard>
                            <CardHeader
                                action={
                                    <IconButton>
                                        <MoreVertIcon />
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
                                {/* Here would be your CardActions, similar to those in the Home component. */}
                                {/* These are just placeholders and you should replace them with your actual components and functions. */}
                                <IconButton>
                                    {/* Replace with your favorite icon */}
                                </IconButton>
                                <IconButton>
                                    {/* Replace with your comment icon */}
                                </IconButton>
                                <IconButton>
                                    {/* Replace with your share icon */}
                                </IconButton>
                                <IconButton>
                                    {/* Replace with your save icon */}
                                </IconButton>
                                <IconButton>
                                    {/* Replace with your follow icon */}
                                </IconButton>
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
        </Container>
    );

}

export default Timeline;


