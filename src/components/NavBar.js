import React, { useState } from 'react';
import '../bootstrap-5.2.3-dist/css/bootstrap.css';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { usePetOwner } from '../PetOwnerContext';

const NavBar = () => {
    const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
    const { petOwner, setPetOwner } = usePetOwner();
    const [customUserName, setCustomUserName] = useState('');

    const handleCustomUserNameChange = (e) => {
        setCustomUserName(e.target.value);
    };

    const handleCustomUserNameSubmit = (e) => {
        e.preventDefault();
        if (petOwner) {
            setPetOwner({ ...petOwner, customUserName, userName: customUserName });
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand" to="/">Home</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {isAuthenticated && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/create">Create</Link>
                                </li>
                                <form onSubmit={handleCustomUserNameSubmit} className="d-flex">
                                    <input
                                        type="text"
                                        placeholder="Custom Username"
                                        value={customUserName}
                                        onChange={handleCustomUserNameChange}
                                    />
                                    <button type="submit">Set</button>
                                </form>
                            </>
                        )}
                        {!isAuthenticated ? (
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Login</Link>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <button
                                    className="nav-link btn btn-link"
                                    onClick={() => logout({ returnTo: window.location.origin })}
                                >
                                    Logout
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
