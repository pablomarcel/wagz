import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    Box,
    CircularProgress
} from '@mui/material';
import Comment from './Comment';
import CommentForm from './CommentForm';

const Comments = ({ postId, userEmail, userPicture, handleClose, likeComment, likedComments }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch('/.netlify/functions/getComments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ postId, userEmail }),  // Include userEmail
                });

                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }

                const data = await response.json();

                setComments(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, [postId, userEmail]);  // Include userEmail as dependency

    const handleCommentAdded = (newComment) => {
        setComments(prevComments => [...prevComments, newComment]);
    };

    return (
        <Dialog open={true} onClose={handleClose}>
            <DialogTitle>Comments</DialogTitle>
            <DialogContent>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <List>
                        {comments.map(comment => (
                            <Comment
                                key={comment.id}
                                {...comment}
                                userEmail={userEmail}
                                userPicture={userPicture}
                                likeComment={likeComment}
                                isLiked={likedComments[comment.id]}
                                likeCount={typeof comment.likeCount === 'object' ? (comment.likeCount.low || 0) : (comment.likeCount || 0)}
                            />
                        ))}
                    </List>
                )}
                <CommentForm
                    postId={postId}
                    userEmail={userEmail}
                    onCommentAdded={handleCommentAdded}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Comments;
