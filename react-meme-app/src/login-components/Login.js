import React from 'react';
import { useHistory } from 'react-router-dom';
import { auth, provider } from '../firebase';
import GoogleButton from 'react-google-button';
import './Login.css';
import { Button } from '@material-ui/core';
import logo from '../assets/laugh-out-loud-logo.png'; 
import man_laughing from '../assets/laughing_man.png'

function Login() {
    const history = useHistory();

    const handleLogin = () => {
        auth.signInWithPopup(provider)
            .then(() => history.push('/'))
            .catch((error) => alert(error.message));
    };

    return (
        <div className="login-container">
            <div className='login-container-div'>
                <img
                    src={logo}
                    alt="Laugh Out Loud Logo"
                    className="app-logo-only"
                />
                <p className='login-container-div-title'>Meme. Laugh. Repeat.</p>
                </div>
            <div className="login-card">
            <div className="login-card-right">
            <img src={man_laughing} alt='' className='laughing_man_logo'/>
            </div>
            <div className="login-card-left">
                {/* <h3>🔐Welcome to <br/>Laugh Out Loud</h3> */}
                <p className="subtitle">
                    Sign in to explore, create, and share fun memes.
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
            <hr/>
            <div className="tips-container">
            <p className="tips-heading">👇 Tips:</p>
            <ul className="tips-list">
                <li>You can browse memes without signing in.</li>
                <li>Sign in to save & share your creations!</li>
            </ul>
            </div>
        </div>
    );
}

export default Login;
