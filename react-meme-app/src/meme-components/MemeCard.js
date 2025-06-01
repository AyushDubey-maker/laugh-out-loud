import React, { useState } from 'react'
import { db } from '../firebase'
import './MemeCard.css'
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import firebase from 'firebase'
import { Button } from '@material-ui/core';
import { useClipboard } from 'use-clipboard-copy';

function MemeCard({meme,type,id}) {
  const [copied, setCopied] = useState(false);
  const clipboard = useClipboard();
  const copyLink = () => {

    clipboard.copy( meme.data.memes.url);
    setCopied(true);
  };
    const user=firebase.auth().currentUser;
    function deleteMeme(){
      db.collection('user-memes').doc(user?.uid).collection('memes').doc(id).delete()
    }
    return (
        <div >
               {type === "savelist" && (
          <div className="meme_card">
            {/* Fetching imageUrl from data-->memes-->url (This is user-saved meme)|| data-->memes-->data--> (This is user-created meme) */}
            <img src={meme.data.memes.url || meme.data.memes.data.url} alt="Meme"/>
            <div className='buttons_d'>
             <Button variant="outlined" color="secondary" onClick={deleteMeme}>Delete Meme<DeleteOutlineOutlinedIcon/></Button>
            {meme.data.created===true && (
              <Button title="You created this meme" onClick={copyLink} variant="outlined" color="primary">{copied?'Url Copied!':'Get URL🔗'}</Button>
            )}
            </div>
          </div>
        )}
        </div>
    )
}

export default MemeCard
