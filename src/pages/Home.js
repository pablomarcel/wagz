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

const StyledCard = styled(Card)(({ theme }) => ({
    width: '100%',
    marginBottom: theme.spacing(2),
}));

const StyledCardMedia = styled(CardMedia)({
    height: 0,
    paddingTop: '56.25%', // 16:9 aspect ratio
});

const Home = () => {
    const { user, isAuthenticated } = useAuth0();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likedPosts, setLikedPosts] = useState({}); // new state to keep track of liked posts

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

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('/.netlify/functions/listPosts');
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }

                const data = await response.json();
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
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchPosts();
    }, [isAuthenticated, user]);



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
                                    <IconButton aria-label="comment">
                                        <CommentIcon />
                                    </IconButton>
                                    <IconButton aria-label="share">
                                        <ShareIcon />
                                    </IconButton>
                                    <IconButton aria-label="save">
                                        <SaveIcon />
                                    </IconButton>
                                </CardActions>
                            </StyledCard>
                        </Grid>
                    ))
                )}
            </Grid>
        </Container>
    );
};

export default Home;
