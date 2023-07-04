import React from 'react';
import LoginForm from '../components/LoginForm';
import '../bootstrap-5.2.3-dist/css/bootstrap.css'
import { Helmet } from 'react-helmet';

const LoginPage = () => {
    return (
        <div className="container my-5">
            <Helmet>
                <title>Wagzters - Login</title>
                <meta name="description" content="Login to the application to access your account and manage your pets." />
            </Helmet>

            <h2>Login</h2>
            <LoginForm />
        </div>
    );
};

export default LoginPage;
