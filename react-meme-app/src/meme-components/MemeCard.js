import React, { useState } from 'react'
import { db } from '../firebase'
import './MemeCard.css'
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
// import GetAppIcon from '@material-ui/icons/GetApp';
import firebase from 'firebase'
import { Button } from '@material-ui/core';
import { useClipboard } from 'use-clipboard-copy';

function MemeCard({meme,type,id}) {
  const [copied, setCopied] = useState(false);
  const clipboard = useClipboard();
  const copyLink = () => {

    clipboard.copy(meme.data?.memes?.url || meme.data?.memes?.data?.url || meme.data?.memeURL);
    setCopied(true);
  };
    const user=firebase.auth().currentUser;

    // Delete Meme

  function deleteMeme(id, storagePath) {
  const userId = firebase.auth().currentUser?.uid;
  if (!userId || !id || !storagePath) return;

  const storageRef = firebase.storage().ref();
  const fileRef = storageRef.child(storagePath);

  
  fileRef.delete()
    .then(() => {
    
      return db
        .collection("user-memes")
        .doc(userId)
        .collection("memes")
        .doc(id)
        .delete();
    })
    .then(() => {
      console.log("Meme deleted from both storage and Firestore.");
    })
    .catch((error) => {
      console.error("Error deleting meme:", error);
    });
}


    return (
        <div >
               {type === "savelist" && (
          <div className="meme_card">
            <img src={meme.data?.memes?.url || meme.data?.memes?.data?.url || meme.data?.memeURL}  loading="lazy" alt="Meme"/>
            <div className='buttons_d'>
             <Button variant="outlined" color="secondary" onClick={() => deleteMeme(meme.id, meme.data?.storagePath)}>Delete Meme<DeleteOutlineOutlinedIcon/></Button>

             <Button title="You created this meme" onClick={copyLink} variant="outlined" color="primary">{copied?'Url Copied!':'Get URL🔗'}</Button>
         
            </div>
          </div>
        )}
        </div>
    )
}

export default MemeCard
