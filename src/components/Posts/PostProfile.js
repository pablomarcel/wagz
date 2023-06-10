import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardMedia, CardContent, CardHeader, CardActions, Typography, Container, CircularProgress, Box, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AboutPet from '../More/AboutPet'
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import SaveIcon from '@mui/icons-material/Save';
import {PersonAdd} from "@mui/icons-material";
import likePost from '../../pages/likePost';
import savePost from '../../pages/savePost';
import handleFollowUser from '../../pages/handleFollowUser';
import ShareForm from '../Sharing/ShareForm';
import { handleSharePost } from '../../pages/handleSharePost';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useAuth0 } from '@auth0/auth0-react';
import likeComment from "../../pages/likeComment";
import Comments from '../Comments/Comments';


const StyledCardMedia = styled(CardMedia)({
    paddingTop: '56.25%', // 16:9
});

const StyledCardVideo = styled('video')({
    width: '100%',
    height: 'auto',
});

const TruncatedTypography = styled(Typography)({
    display: "-webkit-box",
    boxOrient: "vertical",
    lineClamp: 2,
    wordBreak: "break-all",
    overflow: "hidden",
});

const StyledCard = styled(Card)({
    maxWidth: '100%',
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#f5f5f5',
    borderRadius: '15px',
    margin: '1em auto', // for centering and spacing
});

function PostProfile() {
    const { user, isAuthenticated } = useAuth0();
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [pet, setPet] = useState(null);
    const [petOwner, setPetOwner] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPostId, setCurrentPostId] = useState(null);
    const [currentPet, setCurrentPet] = useState(null);
    const [aboutPetOpen, setAboutPetOpen] = useState(false);
    const [likedPosts, setLikedPosts] = useState({});
    const [savedPosts, setSavedPosts] = useState({});
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [likedComments, setLikedComments] = useState({});
    const [followedUsers, setFollowedUsers] = useState({});
    const [shareFormOpen, setShareFormOpen] = useState(false);
    const [currentPostToShare, setCurrentPostToShare] = useState(null);
    const [likeCounts, setLikeCounts] = useState({});

    const handleAboutPet = (pet, id) => {
        setCurrentPet(pet);
        setCurrentPostId(id);
        setAboutPetOpen(true);
    };

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

    useEffect(() => {
        const fetchPostPetOwnerAndLikeStatus = async () => {
            try {
                const postResponse = await axios.post('/.netlify/functions/getPostProfile', { postId });
                setPost(postResponse.data);

                const petResponse = await axios.post('/.netlify/functions/getPetByPostId', { postId });
                setPet(petResponse.data);

                const petOwnerResponse = await axios.post('/.netlify/functions/getPetOwnerByPostId', { postId });
                setPetOwner(petOwnerResponse.data);

                if (isAuthenticated) {
                    const likedPostsResponse = await axios.post('/.netlify/functions/getLikedPosts', { userEmail: user.email });
                    const likedPostIds = new Set(likedPostsResponse.data);
                    setLikedPosts(prevState => ({ ...prevState, [postId]: likedPostIds.has(postId) }));

                    const savedPostsResponse = await axios.post('/.netlify/functions/getSavedPosts', { userEmail: user.email });
                    const savedPostIds = new Set(savedPostsResponse.data);
                    setSavedPosts(prevState => ({ ...prevState, [postId]: savedPostIds.has(postId) }));

                    const followResponse = await axios.post('/.netlify/functions/getFollowingOwners', { userEmail: user.email });
                    let followObj = {};
                    followResponse.data.forEach(user => {
                        followObj[user.email] = true;
                    });
                    setFollowedUsers(followObj);
                }

                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching post profile:', error);
                setIsLoading(false);
            }
        };

        fetchPostPetOwnerAndLikeStatus();
    }, [postId, isAuthenticated, user]);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!post) {
        return <p>No post found for this id.</p>;
    }

    return (
        <Container maxWidth="md">
            <StyledCard>
                <CardHeader
                    action={
                        <IconButton onClick={() => handleAboutPet(pet, postId)}>
                            <MoreVertIcon style={{ color: '#e91e63' }}/>
                        </IconButton>
                    }
                    title={`${pet ? pet.name : 'Unknown'}`}
                    subheader={`by: ${petOwner ? petOwner.name : 'Unknown'}`}
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
                    <TruncatedTypography variant="body2" color="text.secondary" align="center">
                        {post.caption}
                    </TruncatedTypography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites" onClick={() => likePost(user, postId, likedPosts[postId], setLikedPosts, setLikeCounts)}>
                        {likedPosts[postId] ? <FavoriteIcon style={{ color: '#e91e63'}}/> : <FavoriteBorderIcon style={{ color: '#607d8b'}}/>}
                    </IconButton>
                    <IconButton aria-label="comment" onClick={() => openComments(postId)}>
                        <CommentIcon style={{ color: '#607d8b'}}/>
                    </IconButton>
                    <IconButton aria-label="share" onClick={() => {
                        setCurrentPostToShare(postId);
                        setShareFormOpen(true);
                    }}>
                        <ShareIcon style={{ color: '#607d8b'}}/>
                    </IconButton>
                    <IconButton aria-label="save" onClick={() => savePost(user, postId, savedPosts[postId], setSavedPosts)}>
                        {savedPosts[postId] ? <SaveIcon style={{ color: '#1976d2'}}/> : <SaveIcon style={{ color: '#607d8b'}}/>}
                    </IconButton>
                    <IconButton aria-label="follow" onClick={() => handleFollowUser(petOwner.email, user, followedUsers, setFollowedUsers)}>
                        {followedUsers[petOwner.email] ? <PersonAdd style={{ color: '#1976d2'}}/> : <PersonAdd style={{ color: '#607d8b'}}/>}
                    </IconButton>
                    <Typography variant="body2">
                        {likeCounts[postId] || 0} Likes
                    </Typography>
                </CardActions>



            </StyledCard>

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

export default PostProfile;
