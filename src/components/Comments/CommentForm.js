import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

const CommentForm = ({ postId, userEmail, onCommentAdded }) => {
    const [comment, setComment] = useState('');

    const handleInputChange = (event) => {
        setComment(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('/.netlify/functions/addComment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId, userEmail, comment }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }

            // Assuming the server response includes the comment that was added,
            // call the onCommentAdded function with the new comment.
            const newComment = await response.json();
            onCommentAdded(newComment);

            // Clear the comment input field.
            setComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <form
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '1em',
            }}
            onSubmit={handleSubmit}
        >
            <TextField
                id="comment"
                label="Add a comment"
                variant="outlined"
                style={{ flexGrow: 1, marginRight: '1em' }}
                value={comment}
                onChange={handleInputChange}
            />
            <Button variant="contained" color="primary" type="submit">
                Post
            </Button>
        </form>
    );
};

export default CommentForm;
