import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Home from './Home'; // import the Home component
import { Helmet } from 'react-helmet'; // import Helmet component

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

    return (
        <>
            <Helmet>
                <title>Wagzters - Favorites</title>
                <meta name="description" content="Wagzters - Browse your favorite pet posts, cherishing the delightful moments with the pet stars."/>
                <meta property="og:title" content="Wagzters - Favorites" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://i.imgur.com/jrbqoWp.png" />
                <meta property="og:url" content="https://wagzters.com/favorites" />
                <meta property="og:description" content="Wagzters - Explore the posts you've favorited, indulging in the warmth and joy each pet brings." />
            </Helmet>
            <Home filterPosts={likedPosts} />; {/* render the Home component with only the liked posts */}
        </>
    );
};

export default Favorites;
