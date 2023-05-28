import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Post from './Post';
import { Grid } from '@mui/material';

const PostList = () => {
    const { user, isAuthenticated } = useAuth0();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPostsByOwner = async () => {
            if (isAuthenticated && user) {
                try {
                    const response = await fetch('/.netlify/functions/getPostsByOwner', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userEmail: user.email }),
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error ${response.status}`);
                    }

                    const postData = await response.json();
                    const postsWithPetName = postData.map(post => ({...post, petName: "Unknown"}));

                    setPosts(postsWithPetName);
                } catch (error) {
                    console.error('Error fetching posts:', error);
                }
            }
        };

        fetchPostsByOwner();
    }, [user, isAuthenticated]);

    return (
        <Grid container spacing={3}>
            {posts.map((post) => (
                <Grid item xs={12} md={4} key={post.id} style={{ minHeight: '500px' }}>
                    <Post post={post} />
                </Grid>
            ))}
        </Grid>
    );
};

export default PostList;
