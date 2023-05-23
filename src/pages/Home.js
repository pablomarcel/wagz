import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
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
    Box
} from '@mui/material';
import { styled } from '@mui/system';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import SaveIcon from '@mui/icons-material/Save';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Avatar from '@mui/material/Avatar';
import Comments from '../components/Comments/Comments';

const StyledCard = styled(Card)(({ theme }) => ({
    width: '100%',
    marginBottom: theme.spacing(2),
}));

const StyledCardMedia = styled(CardMedia)({
    height: 0,
    paddingTop: '56.25%', // 16:9 aspect ratio
});

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

    const likePost = (postId) => {
        fetch('/.netlify/functions/likesPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userEmail: user.email, postId }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Post liked:', data);
                setLikedPosts(prevState => ({...prevState, [postId]: true})); // update the liked state
            })
            .catch((error) => {
                console.error('Error liking post:', error);
            });
    };

    const savePost = (postId) => {
        fetch('/.netlify/functions/savePost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userEmail: user.email, postId }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Post saved:', data);
                setSavedPosts(prevState => ({...prevState, [postId]: true}));
            })
            .catch((error) => {
                console.error('Error saving post:', error);
            });
    };

    const openComments = (postId) => {
        setCurrentPostId(postId);
        setCommentsOpen(true);
    };

    const closeComments = () => {
        setCurrentPostId(null);
        setCommentsOpen(false);
    };

    const likeComment = (postId, commentId) => {
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
                console.log('Comment liked:', data);
                setLikedComments(prevState => ({...prevState, [commentId]: true})); // update the liked state
            })
            .catch((error) => {
                console.error('Error liking comment:', error);
            });
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
                    posts.map(({ id, caption, pet, owner }) => (
                        <Grid item xs={12} key={id}>
                            <StyledCard>
                                <CardHeader
                                    action={
                                        <IconButton>
                                            <MoreVertIcon />
                                        </IconButton>
                                    }
                                    title={`${pet ? pet.name : 'Unknown'}`}
                                    subheader={`by: ${owner ? owner.name : 'Unknown'}`}
                                />
                                <StyledCardMedia image="https://via.placeholder.com/640x360" title="Post image" />
                                <CardContent>
                                    <Typography variant="body1">{caption}</Typography>
                                </CardContent>
                                <CardActions disableSpacing>
                                    <IconButton aria-label="add to favorites" onClick={() => likePost(id)}>
                                        {likedPosts[id] ? <FavoriteIcon color="primary"/> : <FavoriteBorderIcon />}
                                    </IconButton>
                                    <IconButton aria-label="comment" onClick={() => openComments(id)}>
                                        <CommentIcon />
                                    </IconButton>
                                    <IconButton aria-label="share">
                                        <ShareIcon />
                                    </IconButton>
                                    <IconButton aria-label="save" onClick={() => savePost(id)}>
                                        {savedPosts[id] ? <SaveIcon color="primary"/> : <SaveIcon />}
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
                    likeComment={likeComment}
                    likedComments={likedComments}
                    commentsOpen={commentsOpen}
                    handleClose={closeComments}
                />
            )}


        </Container>
    );
};

export default Home;
