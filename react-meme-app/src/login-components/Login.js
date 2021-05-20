import React from 'react'
import { useHistory } from 'react-router'
import { auth, provider } from '../firebase'
import GoogleButton from 'react-google-button'
import './Login.css'
import PersonAddIcon from '@material-ui/icons/PersonAdd';
function Login() {
    const history=useHistory()
    const handleLogin=()=>{
        auth.signInWithPopup(provider).then((result)=>{
        //    setUser(result.user)
        history.push('/')
        }).catch((error)=>alert(error.message))
    }
    return (
        <div className="login_div">
            <h1>Laugh Out Loud </h1>
            <img alt="" src="https://freepngimg.com/download/internet_meme/3-2-troll-face-meme-png.png"/>
            <div className='login_component'>
            <h2>Login User <PersonAddIcon fontSize="large"/></h2>
            <GoogleButton onClick={handleLogin}>Sign-In With Google</GoogleButton>
            </div>
        </div>
    )
}

export default Login
