import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Home from './Home';

const SharedWithMe = () => {
    const { user, isAuthenticated } = useAuth0();
    const [sharedPosts, setSharedPosts] = useState([]);

    useEffect(() => {
        const fetchSharedPosts = async () => {
            if (isAuthenticated && user) {
                const response = await fetch('/.netlify/functions/getSharedWithMePosts', {
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
                setSharedPosts(data);
            }
        };

        fetchSharedPosts();
    }, [isAuthenticated, user]);

    return <Home filterPosts={sharedPosts} />;
};

export default SharedWithMe;
