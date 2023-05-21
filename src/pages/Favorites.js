// Favorites.js

import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Home from './Home'; // import the Home component

const Favorites = () => {
    const { user, isAuthenticated } = useAuth0();
    const [likedPosts, setLikedPosts] = useState([]);

    useEffect(() => {
        const fetchLikedPosts = async () => {
            if (isAuthenticated && user) {
                const response = await fetch('/.netlify/functions/getLikedPosts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userEmail: user.email }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }

                const data = await response.json();
                setLikedPosts(data);
            }
        };

        fetchLikedPosts();
    }, [isAuthenticated, user]);

    return <Home filterPosts={likedPosts} />; // render the Home component with only the liked posts
};

export default Favorites;
