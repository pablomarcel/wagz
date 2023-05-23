/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import Comment from './Comment';
import CommentForm from './CommentForm';
import List from '@mui/material/List';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const Comments = ({ postId, userEmail, userPicture, closeComments, likeComment, likedComments }) => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch('/.netlify/functions/getComments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ postId, userEmail }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }

                const data = await response.json();
                setComments(data);
                console.log('Set comments:', data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        if (postId) {
            fetchComments();
        }
    }, [postId, userEmail]);

    useEffect(() => {
        // Check if there are any duplicate IDs.
        const idSet = new Set();
        let hasDuplicates = false;
        for (const comment of comments) {
            if (idSet.has(comment.id)) {
                hasDuplicates = true;
                console.warn('Duplicate comment ID:', comment.id);
            } else {
                idSet.add(comment.id);
            }
        }
        if (hasDuplicates) {
            console.warn('There are duplicate comment IDs. This might be causing the key prop warning.');
        }
    }, [comments]);

    const handleCommentAdded = (newComment) => {
        setComments((prevComments) => [...prevComments, newComment]);
    };

    return (
        <div>
            <DialogTitle>
                Comments
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={closeComments}
                    aria-label="close"
                    style={{ position: 'absolute', right: '8px', top: '8px' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <List>
                    {/* eslint-disable-next-line react/no-array-index-key */}
                    {comments.map((comment) => (

                        <Comment
                            key={comment.id}
                            id={comment.id}
                            ownerName={comment.ownerName || 'Unknown'}
                            text={comment.text}
                            timestamp={comment.timestamp}
                            isLiked={likedComments[comment.id] || false}
                            likeCount={typeof comment.likeCount === 'object' ? (comment.likeCount.low || 0) : (comment.likeCount || 0)}
                            userEmail={userEmail}
                            userPicture={userPicture}  // Pass the user's picture URL as a prop
                        />
                    ))}
                </List>
                <CommentForm postId={postId} userEmail={userEmail} onCommentAdded={handleCommentAdded} />
            </DialogContent>
        </div>
    );
};

export default Comments;
