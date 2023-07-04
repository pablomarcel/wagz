import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Home from './Home';
import { Helmet } from 'react-helmet';

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

    return (
        <>
            <Helmet>
                <title>Wagzters - Shared With Me</title>
                <meta name="description" content="Wagzters - Explore pet posts shared with you by other users, dive into the delightful world of pets shared by our community."/>
                <meta property="og:title" content="Wagzters - Shared With Me" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://i.imgur.com/jrbqoWp.png" />
                <meta property="og:url" content="https://wagzters.com/sharedwithme" />
                <meta property="og:description" content="Wagzters - Discover posts shared with you, showcasing the wonderful variety of pets within our community." />
            </Helmet>
            <Home filterPosts={sharedPosts} />
        </>
    );
};

export default SharedWithMe;
