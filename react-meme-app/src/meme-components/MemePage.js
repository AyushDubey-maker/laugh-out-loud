import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { auth, db } from "../firebase";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import BookmarkBorderOutlinedIcon from "@material-ui/icons/BookmarkBorderOutlined";

import "./MemePage.css";
import firebase from "firebase";
import { Button } from "@material-ui/core";
import Spinner from 'react-spinkit'
function MemePage() {
  const [memes, setMemes] = useState([]);
  const [memeIndex, setMemeIndex] = useState(1);
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setUser(authUser);
      }
    });

    // eslint-disable-next-line
  }, []);
  const fire_user = firebase.auth().currentUser;
  function saveMeme() {
    if (user) {
      db.collection("user-memes")
        .doc(fire_user?.uid)
        .collection("memes")
        .add({
          memes: memes[memeIndex],
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => alert("Meme Saved"));
    } else {
      history.push("/login");
    }
  }
  const shuffleMemes = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };

  // Fetching Random Memes through this api
  useEffect(() => {
    fetch("https://meme-api.com/gimme/50").then((res) => {
      res
        .json()
        .then((res) => {
          const _memes = res.memes;
          shuffleMemes(_memes);
          setMemes(_memes);
        })
        .catch((err) => alert(err.message));
    });
  }, []);

  return (
    <div className="meme-container">
      <div className="meme-container-header">
        <div className="meme-container-header-h">
        <h1>
          Laugh Out Loud 😁{" "}
        </h1>
        </div>
        <div className="meme-container-header-b">
          {user && (
            <Button
              variant="outlined"
              color="primary"
              className="create_memes_btn"
              onClick={() => history.push("/generate-meme")}
            >
              Welcome {user.displayName}, Create Your Own Memes 🖍
            </Button>
          )}
        {user ? (
          <Button
            variant="outlined"
            color="secondary"
            className="logout_btn"
            onClick={() => auth.signOut().then(() => setUser(null))}
          >
            Logout
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => history.push("/login")}
          >
            Login to Save Memes
          </Button>
        )}
        </div>
      </div>
      <div className="meme_box">
        {memes.length > 0 ? (
          <img alt="meme" src={memes[memeIndex].url} />
        ) : (
          // <p>Oops Memes over..Now do some Work Don't waste time</p>
          <div className="app_loading">
            <div className="app_loading_container">
              
            <Spinner name="ball-spin-fade-loader" color="purple" fadeIn="none"/>
              </div>
          </div>
        )}

        {memes.length > 0 && memeIndex > 0 && (
          <ArrowBackIcon
            titleAccess="Previous Meme"
            className="prev_btn"
            onClick={() => setMemeIndex(memeIndex - 1)}
          >
            Previous
          </ArrowBackIcon>
        )}
        {memes.length > 0 &&(
        <ArrowForwardIcon
          titleAccess="Next Meme"
          className="next_btn"
          onClick={() => setMemeIndex(memeIndex + 1)}
        >
          Next
        </ArrowForwardIcon>
        )}
      </div>
      <div className="save_btn_grp">
        {user && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => saveMeme()}
          >
            Save Meme
            <BookmarkBorderOutlinedIcon />
          </Button>
        )}

        {user && (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => history.push("/save")}
          >
            Lookout your Saved Memes
          </Button>
        )}
      </div>
    </div>
  );
}

export default MemePage;
