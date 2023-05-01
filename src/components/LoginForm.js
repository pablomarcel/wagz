import React from 'react';
import '../bootstrap-5.2.3-dist/css/bootstrap.css'
import { useAuth0 } from '@auth0/auth0-react';

const LoginForm = () => {
    const { loginWithRedirect } = useAuth0();

    const handleSubmit = (e) => {
        e.preventDefault();
        loginWithRedirect();
    };

    return (
        <form onSubmit={handleSubmit}>
            <button type="submit" className="btn btn-primary">Login</button>
        </form>
    );
};

export default LoginForm;
