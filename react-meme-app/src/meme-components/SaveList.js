import React, {  useEffect, useState } from 'react'
import { auth, db } from '../firebase';
import MemeCard from './MemeCard';
import './SaveList.css'
import firebase from 'firebase'
import { useHistory } from 'react-router';
import { Button } from '@material-ui/core';
import Spinner from 'react-spinkit';
import logo from "../assets/laugh-out-loud-logo.png";
function SaveList() {
  
    const [savelist,setSavelist]=useState([])
    const user=firebase.auth().currentUser;
    const history=useHistory()
    const [haveMemes,setHaveMemes]=useState(true);
    const [memeCounter,setMemeCounter]=useState(0);
    

            useEffect(() => {
          const unsubscribe = db
            .collection("user-memes")
            .doc(user?.uid)
            .collection("memes")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) =>
              setSavelist(
                snapshot.docs.map((doc) => ({
                  id: doc.id,
                  data: doc.data(),
                }))
              )
            );

          return () => unsubscribe();
        }, [user]);

      // UseEffect to check whether user is logged in or not..
      const [authuser,setUser]=useState(null);
      useEffect(()=>{
      auth.onAuthStateChanged((authUser)=>{
        if(authUser){
          setUser(authUser)
        }else{
          setUser(null);
          history.push('/')
        }
      })
      // eslint-disable-next-line
      },[authuser]);
// Use Effect to check if the user account has any memes or not
      function changeCounter(){
        setTimeout(() => {
        setMemeCounter(1);
      }, 5000); 
      }
      useEffect(()=>{
        changeCounter();
      })

    useEffect(()=>{
      if(memeCounter===1 && savelist.length===0){
        setHaveMemes(false)
      }
    },[memeCounter,savelist])
   
    
    return (
        <div className='meme-container'>
            <header className="meme-header">
            <div className="header-left">
              <img src={logo} alt="Laugh Out Loud Logo" className="meme-logo" onClick={()=>history.push('/')}/>
            </div>
            <div className="header-right">
              {user && (
              <div className="user-avatar" title={user.displayName}>
                {user.displayName?.[0].toUpperCase()}
              </div>
            )}
              {user && (
                <Button
                  variant="outlined"
                  color="primary"
                  className="header_button"
                  onClick={() => history.push("/generate-meme")}
                >
                 Create Memes 🖍
                </Button>
              )}
              {user ? (
                <Button
                  variant="contained"
                  color="secondary"
                  className="logout-btn"
                  onClick={() => auth.signOut().then(() => setUser(null))}
                >
                  LOGOUT
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  className="header_button"
                  onClick={() => history.push("/login")}
                >
                  Login to Save Memes
                </Button>
              )}
            </div>
          </header>
            {savelist.length > 0 ? (
          <div className="meme-grid">
            {savelist.map(meme => (
              <MemeCard meme={meme} key={meme.id} id={meme.id} type="savelist" />
            ))}
          </div>
          
        ) : haveMemes===true &&(
          <div className="no-memes-div">
          {/* <h2 className="no-memes">No memes saved! Add some!</h2> */}
          <Spinner name="ball-spin-fade-loader" color="lightbrown" fadeIn="none"/>
          {/* <Button variant="contained" color="primary" onClick={()=>history.push('/')}>Go Back To HomePage</Button> */}
          </div>
        )} 

        {/* If User Has No Memes */}
        {haveMemes===false &&(
           <div className="no-memes-div">
            <h2 className="no-memes">No memes saved! <a href='/'>Add some</a></h2>
           </div>
        )}
        </div>
    )
}

export default SaveList
