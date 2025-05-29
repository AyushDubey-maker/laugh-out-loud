import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router";
import { auth, db } from "../firebase";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import BookmarkBorderOutlinedIcon from "@material-ui/icons/BookmarkBorderOutlined";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import "./MemePage.css";
import firebase from "firebase";
import { Button } from "@material-ui/core";
import logo from "../assets/laugh-out-loud-logo.png";
import img_not_found from '../assets/404_img_not_found.png';
import Spinner from 'react-spinkit'
import { useSwipeable } from 'react-swipeable';


function MemePage() {
  const [memes, setMemes] = useState([]);
  const [memeIndex, setMemeIndex] = useState(0);
  const [user, setUser] = useState(null);
  const [savedMemes, setSavedMemes] = useState([]);
  const [loadingNext, setLoadingNext] = useState(false);


  const history = useHistory();
  const DOTS_PER_PAGE = 10;
  useEffect(() => {
    auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setUser(authUser);
        db.collection("user-memes")
      .doc(authUser.uid)
      .collection("memes")
      .get()
      .then(snapshot => {
        const savedUrls = snapshot.docs.map(doc => doc.data().memes.url);
        setSavedMemes(savedUrls);
      });
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
        setSavedMemes(prev => [...prev, memes[memeIndex].url]);

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
    const fetchMemes = useCallback(async () => {
      try {
        const res = await fetch("https://meme-api.com/gimme/50");
        const data = await res.json();
        const _memes = data.memes;
        shuffleMemes(_memes);
        setMemes(prev => [...prev, ..._memes]);
      } catch (err) {
        alert("Failed to fetch memes: " + err.message);
      }
    }, []);
  // Fetching Random Memes through this api
      useEffect(() => {
      fetchMemes();
    }, [fetchMemes]);

  // For mobile screens swipeable feature
      const swipeHandlers = useSwipeable({
      onSwipedLeft: () => {
        if (!loadingNext) {
          const nextIndex = memeIndex + 1;
          if (nextIndex >= memes.length - 1) fetchMemes();
          setMemeIndex(nextIndex);
        }
      },
      onSwipedRight: () => {
        if (memeIndex > 0) {
          setMemeIndex(memeIndex - 1);
        }
      },
      preventScrollOnSwipe: true,
      trackMouse: true,
    });

const goToNext = () => {
  if (!loadingNext) {
    setLoadingNext(true);
    setTimeout(() => {
      const nextIndex = memeIndex + 1;

      if (nextIndex >= memes.length - 1) {
        fetchMemes(); // Preload next batch
      }

      setMemeIndex(nextIndex);
      setLoadingNext(false);
    }, 300);
  }
};

const goToPrev = () => {
  const prevIndex = memeIndex - 1;
  if (prevIndex >= 0) {
    setMemeIndex(prevIndex);
  }
};
  const isSaved = memes.length > 0 && savedMemes.includes(memes[memeIndex]?.url);


  return (
    <div className="meme-container">
  <header className="meme-header">
  <div className="header-left">
    <img src={logo} alt="Laugh Out Loud Logo" className="meme-logo" />
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

      <div className="meme-box" {...swipeHandlers}>
            {memes.length === 0 ? (
            <div className="app-loading">
              <div className="app-loading-container">
                <Spinner name="ball-spin-fade-loader" color="lightbrown" fadeIn="none" />
              </div>
            </div>
          ) : (
            <img
              alt="meme"
              src={memes[memeIndex]?.url}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = img_not_found;
              }}
            />
          )}

        {memes.length > 0 && memeIndex > 0 && (
          <ArrowBackIcon
            className="nav-btn prev"
            titleAccess="Previous Meme"
            // onClick={() => setMemeIndex(memeIndex - 1)}
            onClick={goToPrev}

          />
        )}
        {memes.length > 0 && (
          <ArrowForwardIcon
            className={`nav-btn next ${loadingNext ? 'disabled' : ''}`}
            titleAccess="Next Meme"
   
            onClick={goToNext}

          />
        )}
      </div>

        <div className="nav-dots">
        {(() => {
          const currentDotPage = Math.floor(memeIndex / DOTS_PER_PAGE);
          return memes
            .slice(
              currentDotPage * DOTS_PER_PAGE,
              (currentDotPage + 1) * DOTS_PER_PAGE
            )
            .map((_, i) => {
              const absoluteIndex = currentDotPage * DOTS_PER_PAGE + i;
              return (
                <span
                  key={i}
                  className={`dot ${absoluteIndex === memeIndex ? "active" : ""}`}
                  onClick={() => setMemeIndex(absoluteIndex)}
                ></span>
              );
            });
        })()}
      </div>

      {user && memes.length > 0 && (
        <div className="save-btn-group">
          
          <Button
          className="save-meme-btn"
          variant="contained"
          color="primary"
          onClick={saveMeme}
          disabled={isSaved}
        >
          {isSaved ? (
            <>
              Saved <BookmarkIcon />
            </>
          ) : (
            <>
              Save Meme <BookmarkBorderOutlinedIcon />
            </>
          )}
        </Button>
        <Button className="view-save-meme-btn" variant="outlined" color="primary" onClick={() => history.push("/save")}>
            View Saved Memes
          </Button> 

        </div>
      )}
    </div>
  );
}

export default MemePage;
