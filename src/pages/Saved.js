// Saved.js

import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Home from './Home';
import {Helmet} from "react-helmet"; // import the Home component

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

    return (
        <>
            <Helmet>
                <title>Wagzters - Saved</title>
                <meta name="description" content="Wagzters - Browse your saved pet posts, cherishing the delightful moments with the pet stars."/>
                <meta property="og:title" content="Wagzters - Saved" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://i.imgur.com/jrbqoWp.png" />
                <meta property="og:url" content="https://wagzters.com/saved" />
                <meta property="og:description" content="Wagzters - Explore the posts you've saved, indulging in the warmth and joy each pet brings." />
            </Helmet>

            <Home filterPosts={savedPosts} />;

        </>

        );

};

export default Saved;
