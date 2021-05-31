import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import "./Generate-Meme.css";
import { Button } from "@material-ui/core";
import { auth, db } from "../firebase";
import firebase from "firebase";
function GenerateMeme() {
  const [generatememes, setGenerateMemes] = useState([]);
  const [memeIndex, setMemeIndex] = useState(0);
  const [captions, setCaptions] = useState([]);
 
  // UseEffect to check whether user is logged in or not..
  const [authuser, setUser] = useState(null);
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
  }, [authuser]);

  const history = useHistory();
  function updateCaption(e, index) {
    const text = e.target.value || "";
    setCaptions(
      captions.map((c, i) => {
        if (index === i) {
          return text;
        } else {
          return c;
        }
      })
    );
  }
  const fire_user = firebase.auth().currentUser;
  function generateMeme() {
    // Here we are sending the caption and image to the API and then Api is building up the Meme
    const currentMeme = generatememes[memeIndex];
    const formData = new FormData();
    formData.append("username",process.env.REACT_APP_USERNAME);
    formData.append("password", process.env.REACT_APP_PASSWORD);
    formData.append("template_id", currentMeme.id);
    captions.forEach((c, index) => formData.append(`boxes[${index}][text]`, c));

    fetch("https://api.imgflip.com/caption_image", {
      method: "POST",
      body: formData,
    }).then((res) => {
      res.json().then((result) => {
        db.collection("user-memes")
          .doc(fire_user?.uid)
          .collection("memes")
          .add({
            memes: result,
            created: true,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then(() => history.push(`/generated?url=${result.data.url}`));
      });
    });
  }
  const shuffleMemes = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes").then((res) => {
      res.json().then((result) => {
        const _memes = result.data.memes;
        shuffleMemes(_memes);
        setGenerateMemes(_memes);
    
      });
    });
  }, []);
  useEffect(() => {
    // Each meme image consists of some boxes provided by the API.
    if (generatememes.length) {
      setCaptions(Array(generatememes[memeIndex].box_count).fill(""));
    }
  }, [memeIndex, generatememes]);

  return (
    <div className="generate_meme_div">
      
     
      <Button
        className="go_back_btn"
        variant="outlined"
        color="primary"
        onClick={() => history.push("/")}
      >
        <ArrowBackIcon/>
        Go Back Viewing Memes
      </Button>
   
      <div className="input_conatiner">
        {generatememes.length > 0 &&
          captions.map((c, index) => (
            <input
              placeholder="Meme Text"
              onChange={(e) => updateCaption(e, index)}
              key={index}
            />
          ))}
      </div>
      <Button className="generate_meme_btn" variant="contained" color="primary" onClick={generateMeme}>
        Generate your meme
      </Button>
      <p> {generatememes.length > 0 && generatememes[memeIndex].name}</p>
      <div className="meme_box">
        {generatememes.length > 0 ? (
          <img
            className="meme_img"
            alt="meme"
            src={generatememes[memeIndex].url}
          />
        ) : (
          <p>Oops Memes over..Now do some Work Don't waste time</p>
        )}

        {memeIndex > 0 && (
          <ArrowBackIcon
            titleAccess="Previous Meme"
            className="prev_btn"
            onClick={() => setMemeIndex(memeIndex - 1)}
          >
            Previous
          </ArrowBackIcon>
        )}
        <ArrowForwardIcon
          titleAccess="Next Meme"
          className="next_btn"
          onClick={() => setMemeIndex(memeIndex + 1)}
        >
          Next
        </ArrowForwardIcon>
      </div>
     
    </div>
  );
}

export default GenerateMeme;
