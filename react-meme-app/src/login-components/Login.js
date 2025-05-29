import React from 'react';
import { useHistory } from 'react-router-dom';
import { auth, provider } from '../firebase';
import GoogleButton from 'react-google-button';
import './Login.css';
import { Button } from '@material-ui/core';
import logo from '../assets/laugh-out-loud-logo.png'; // logo with text included

function Login() {
    const history = useHistory();

    const handleLogin = () => {
        auth.signInWithPopup(provider)
            .then(() => history.push('/'))
            .catch((error) => alert(error.message));
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <img
                    src={logo}
                    alt="Laugh Out Loud Logo"
                    className="app-logo-only"
                />

                <p className="subtitle">
                    Sign in to explore, save, and create hilarious memes.
                </p>

                <div className="login-content">
                   
                    <GoogleButton
                        className="google-btn"
                        onClick={handleLogin}
                    />
                    
                    <Button
                        onClick={() => history.push('/')}
                        variant="contained"
                        color="primary"
                        className="later-btn"
                    >
                        Browse Without Signing In
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Login;
