import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import "./Generate-Meme.css";
import { Button } from "@material-ui/core";
import { auth, db } from "../firebase";
import firebase from "firebase";
import Spinner from 'react-spinkit';
import logo from "../assets/laugh-out-loud-logo.png";

function GenerateMeme() {
  const [generatememes, setGenerateMemes] = useState([]);
  const [memeIndex, setMemeIndex] = useState(0);
  const [captions, setCaptions] = useState([]);
  const [authUser, setUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const history = useHistory();
  const fire_user = firebase.auth().currentUser;

  const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
        history.push("/");
      }
    });
    // eslint-disable-next-line
  }, [authUser]);

  //  Fetch templates from Memegen
  useEffect(() => {
    fetch("https://api.memegen.link/templates")
      .then((res) => res.json())
      .then((data) => {
      
        setGenerateMemes(shuffleArray(data));
      })
      .catch((err) => console.error("Failed to fetch templates", err));
  }, []);

  //  Update captions
  function updateCaption(e, index) {
    const updated = [...captions];
    updated[index] = e.target.value;
    setCaptions(updated);
  }
//   Dynamically update captions based on line count from meme
useEffect(() => {
  if (generatememes.length && generatememes[memeIndex]) {
    const lineCount = generatememes[memeIndex].lines || 2;
    setCaptions(Array(lineCount).fill(""));
  }
}, [memeIndex, generatememes]);
  //  Construct meme URL

  function buildMemeUrl(template) {
  const safe = (str) =>
    encodeURIComponent(str || "_").replace(/-/g, "--").replace(/_/g, "__");

  const captionPath = captions
    .map((caption) => safe(caption))
    .join("/");

  return `https://api.memegen.link/images/${template.id}/${captionPath}.png`;
}

  //  Save to Firestore
  function saveMeme() {
  setIsSaving(true); 
    const currentMeme = generatememes[memeIndex];
    const memeUrl = buildMemeUrl(currentMeme);

    db.collection("user-memes")
      .doc(fire_user?.uid)
      .collection("memes")
      .add({
        memes: { url: memeUrl, name: currentMeme.name },
        created: true,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => history.push(`/generated?url=${memeUrl}`))
      .catch((err) => {
        console.error("Saving meme failed", err);
        alert("Failed to generate meme. Try again.");
      })
      .finally(() => setIsSaving(false)); 
  }

  return (
    <div className="meme-container">
      <header className="meme-header">
        <div className="header-left">
          <img
            src={logo}
            alt="Laugh Out Loud Logo"
            className="meme-logo"
            onClick={() => history.push("/")}
          />
        </div>
        <div className="header-right">
          {fire_user && (
            <div className="user-avatar" title={fire_user.displayName}>
              {fire_user.displayName?.[0].toUpperCase()}
            </div>
          )}
          {fire_user && (
            <Button
              variant="outlined"
              color="primary"
              className="header_button"
              onClick={() => history.push("/generate-meme")}
            >
              Create Memes 🖍
            </Button>
          )}
          {fire_user ? (
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

      <div className="generate_meme_div_header">
        <div className="input_conatiner">
          {captions.map((c, index) => (
            <input
              placeholder={`Caption ${index + 1}`}
              onChange={(e) => updateCaption(e, index)}
              key={index}
            />
          ))}
         
          <Button
          className="generate_meme_btn"
          variant="contained"
          color="primary"
          onClick={saveMeme}
          disabled={isSaving}
        >
          {isSaving ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Generating...</span>
              <Spinner name="circle" color="white" fadeIn="none" />
            </span>
          ) : (
            "Generate Meme"
          )}
        </Button>
        </div>
      </div>
      <div className="meme-box-container">
      <div className="meme-box-preview">
        {generatememes[memeIndex]?.example?.url && (
          <div className="example-preview">
            <p><strong>Example Meme:</strong></p>
            <img
                key={generatememes[memeIndex].id + "-example"} 
                className="example-img"
                src={generatememes[memeIndex].example.url}
                alt="Example Meme"
              style={{ maxWidth: "100%", border: "1px solid #ccc", borderRadius: "8px", marginTop: "4px" }}
            />
          </div>
        )}
        </div>
      <div className="meme-box">
        <p>{generatememes.length > 0 && generatememes[memeIndex].name}</p>
        {generatememes.length > 0 && generatememes[memeIndex] ? (
            <img
              key={generatememes[memeIndex].id} 
              className="meme_img"
              alt="meme"
              src={buildMemeUrl(generatememes[memeIndex])}
            />
          ) : (
            <p>Oops! No memes loaded.</p>
          )}
  

        <div className="arrow_box">
          {memeIndex > 0 && (
            <ArrowBackIcon
              titleAccess="Previous Meme Template"
              className="prev_btn"
               onClick={() => {setMemeIndex(memeIndex - 1)}}
             
            />
          )}
          <ArrowForwardIcon
            titleAccess="Next Meme Template"
            className="next_btn"
            onClick={() => {setMemeIndex(memeIndex + 1)}}
        
          />
        </div>
      </div>
      </div>
    </div>
  );
}

export default GenerateMeme;