import React, { useEffect, useState } from "react";
import "./MemeGenerated.css";
import { useHistory, useLocation } from "react-router-dom";
import { useClipboard } from "use-clipboard-copy";
import { Button } from "@material-ui/core";
import { auth } from "../firebase";
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
  return (
    <div className="meme_generated_div">
      <div className="meme_generate_div_header">
        <div className="meme_generate_div_header-h">
      <h1>
          Laugh Out Loud 😁
        </h1>
        </div>
      <div className="meme_generate_div_header_b">
      <Button
        className="generate_btn"
        variant="contained"
        color="primary"
        onClick={() => history.push("/generate-meme")}
      >
        Make More Memes
      </Button>
      <Button className="copy_url_btn" variant="contained" color="primary" onClick={copyLink}>
        {copied ? "Link copied!" : "Copy link"} 💬
      </Button>
      </div>
      </div>
      <div className="meme_box">{url && <img src={url} alt="" />}</div>
     <div className="meme_generated_footer">
      <p>
        Your meme is saved in your savelist{" "}
        <Button
          variant="contained"
          color="primary"
          onClick={() => history.push("/save")}
        >
          Checkout
        </Button>
      </p>
      </div>
    </div>
  );
}

export default MemeGenerated;
