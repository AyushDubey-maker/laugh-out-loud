import React, {  useEffect, useState } from 'react'
import { auth, db } from '../firebase';
import MemeCard from './MemeCard';
import './SaveList.css'
import firebase from 'firebase'
import { useHistory } from 'react-router';
import { Button } from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';
import Spinner from 'react-spinkit'
function SaveList() {
  
    const [savelist,setSavelist]=useState([])
    const user=firebase.auth().currentUser;
    const history=useHistory()
    useEffect(()=>{
      db.collection('user-memes').doc(user?.uid).collection('memes').orderBy('timestamp','desc').onSnapshot(snapshot=>(
        setSavelist(snapshot.docs.map(doc=>({
          id:doc.id,
          data:doc.data()
        })))
      ))
      // eslint-disable-next-line
      },[savelist])

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
    
    return (
        <div className='saveList'>
          <div className="saveList_header">
          <Button variant="contained" color="primary" onClick={()=>history.push('/')}><ArrowBackIos className='back_icon'/>Home</Button>
            {/* <ArrowBackIos className='back_icon' onClick={()=>history.push('/')}/> */}
          <h1>Your Saved Memes</h1>
          {/* <img className='meme_header_img' alt="" src="https://freepngimg.com/download/internet_meme/3-2-troll-face-meme-png.png"/> */}
            <h1>😁</h1>
           </div>
            {savelist.length > 0 ? (
          <div className="movie-grid">
            {savelist.map(meme => (
              <MemeCard meme={meme} key={meme.id} id={meme.id} type="savelist" />
            ))}
          </div>
          
        ) : (
          <div className="no-memes-div">
          {/* <h2 className="no-memes">No memes saved! Add some!</h2> */}
          <Spinner name="ball-spin-fade-loader" color="purple" fadeIn="none"/>
          {/* <Button variant="contained" color="primary" onClick={()=>history.push('/')}>Go Back To HomePage</Button> */}
          </div>
        )} 
        </div>
    )
}

export default SaveList
