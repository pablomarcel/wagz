import React from 'react';
import LoginForm from '../components/LoginForm';
import '../bootstrap-5.2.3-dist/css/bootstrap.css'

const LoginPage = () => {
    return (
        <div className="container my-5">
            <h2>Login</h2>
            <LoginForm />
        </div>
    );
};

export default LoginPage;
