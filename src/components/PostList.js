//src/components/PostList.js:

import React, { useEffect, useState } from 'react';
import '../bootstrap-5.2.3-dist/css/bootstrap.css'

const PostList = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function fetchAndSetPosts() {
            const response = await fetch('/.netlify/functions/getPosts');
            const fetchedPosts = await response.json();
            setPosts(fetchedPosts);
        }

        fetchAndSetPosts();
    }, []);

    return (
        <div>
            <h4>Posts</h4>
            {posts.length === 0 ? (
                <p>No posts available.</p>
            ) : (
                <ul>
                    {posts.map((post) => (
                        <li key={post.id}>
                            <strong>{post.petName}:</strong> {post.content}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PostList;
