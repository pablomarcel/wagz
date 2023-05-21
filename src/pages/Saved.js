// Saved.js

import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Home from './Home'; // import the Home component

const Saved = () => {
    const { user, isAuthenticated } = useAuth0();
    const [savedPosts, setSavedPosts] = useState([]);

    useEffect(() => {
        const fetchSavedPosts = async () => {
            if (isAuthenticated && user) {
                const response = await fetch('/.netlify/functions/getSavedPosts', {
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
                setSavedPosts(data);
            }
        };

        fetchSavedPosts();
    }, [isAuthenticated, user]);

    return <Home filterPosts={savedPosts} />; // render the Home component with only the saved posts
};

export default Saved;
