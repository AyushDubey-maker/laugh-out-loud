import React, { useEffect, useState } from "react";
import "./MemeGenerated.css";
import { useHistory, useLocation } from "react-router-dom";
import { useClipboard } from "use-clipboard-copy";
import { Button } from "@material-ui/core";
import { auth } from "../firebase";
import firebase from 'firebase';
import logo from "../assets/laugh-out-loud-logo.png";
function MemeGenerated() {
  const [copied, setCopied] = useState(false);
  const clipboard = useClipboard();
  const history = useHistory();
  const location = useLocation();
  const url = new URLSearchParams(location.search).get("url");
  const copyLink = () => {
    clipboard.copy(url);
    setCopied(true);
  };
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
  const user=firebase.auth().currentUser;
  return (
    <div className="meme-container">
      <header className="meme-header">
      <div className="header-left">
        <img src={logo} alt="Laugh Out Loud Logo" className="meme-logo" />
      </div>
      <div className="header-right">
                  {user && (
                     <div className="user-avatar" title={user.displayName} onClick={()=>history.push('/save')}> 
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
                        Make More Memes 🖍
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
     
     <div className="meme-box meme-generated-box">{url && <img src={url} alt="" />}</div>
     <div className="meme_generated_footer">
      <p>
        Your meme is saved in your savelist{" "}
      </p>
        <div className="save-btn-group meme-generated-save-btn-grp">
        <Button className="copy_url_btn" variant="contained" color="primary" onClick={copyLink}>
        {copied ? "Link copied!" : "Copy link"} 📋
        </Button>
        {" "}
        <Button
          variant="contained"
          color="primary"
          className="checkout_url"
          onClick={() => history.push("/save")}
        >
          View SaveList
        </Button>
        </div>
      
      </div>
    </div>
  );
}

export default MemeGenerated;
