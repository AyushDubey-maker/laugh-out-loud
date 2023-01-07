import React from 'react'
import { useHistory } from 'react-router'
import { auth, provider } from '../firebase'
import GoogleButton from 'react-google-button'
import './Login.css'
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { Button } from '@material-ui/core'
function Login() {
    const history=useHistory()
    // Login through Google SignUp-->Firebase
    const handleLogin=()=>{
        auth.signInWithPopup(provider).then((result)=>{
     
        history.push('/')
        }).catch((error)=>alert(error.message))
    }
    return (
        <div className="login_div">
            <h1>Laugh Out Loud 😁</h1>
            {/* <img alt="" src="https://freepngimg.com/download/internet_meme/3-2-troll-face-meme-png.png"/> */}
            <div className='login_component'>
            <h2>Login User <PersonAddIcon fontSize="large"/></h2>
            
            <GoogleButton onClick={handleLogin} style={{"marginLeft":"30px"}}>Sign-In With Google</GoogleButton>
            <Button className="button" onClick={()=>history.push("/")} style={{"marginLeft":"30px"}} variant="contained" color="primary">Login Later</Button>
           
            </div>
        </div>
    )
}

export default Login
