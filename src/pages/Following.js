import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Following = () => {
    const { user, isAuthenticated } = useAuth0();
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFollowingOwners = async () => {
            if (isAuthenticated && user) {
                try {
                    const response = await fetch('/.netlify/functions/getFollowingOwners', {
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
                    setOwners(data);
                    setLoading(false);
                } catch (error) {
                    setError(error.toString());
                    setLoading(false);
                }
            }
        };

        fetchFollowingOwners();
    }, [isAuthenticated, user]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Following</h1>
            {owners.length > 0 ? (
                owners.map((owner, index) => <p key={index}>{owner}</p>)
            ) : (
                <p>You are not following anyone.</p>
            )}
        </div>
    );
};

export default Following;
