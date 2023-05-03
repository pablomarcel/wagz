//src/AuthProvider.js:

import React, { useEffect } from 'react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

const AuthProviderWrapper = ({ children }) => {
    return (
        <Auth0Provider
            domain={process.env.REACT_APP_AUTH0_DOMAIN}
            clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
            redirectUri={window.location.origin}
            logoutRedirectUri={window.location.origin}
            audience={process.env.REACT_APP_AUTH0_AUDIENCE}
            scope="openid profile email"
        >
            <AuthProvider>{children}</AuthProvider>
        </Auth0Provider>
    );
};

const AuthProvider = ({ children }) => {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const createUser = async () => {
            if (!isAuthenticated) {
                return;
            }

            const token = await getAccessTokenSilently();
            const response = await fetch('/.netlify/functions/createPetOwner', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email: user.email,
                    defaultUserName: user.email,
                    customUserName: '',
                    userName: user.email,
                }),
            });

            if (!response.ok) {
                console.error('Failed to create user');
            }
        };

        createUser();
    }, [isAuthenticated, user, getAccessTokenSilently]);

    return <>{children}</>;
};

export default AuthProviderWrapper;

