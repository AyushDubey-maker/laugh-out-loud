// import React, { useEffect, useState } from "react";
// import { useHistory } from "react-router";
// import ArrowBackIcon from "@material-ui/icons/ArrowBack";
// import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
// import "./Generate-Meme.css";
// import { Button } from "@material-ui/core";
// import { auth, db } from "../firebase";
// import firebase from "firebase";
// import logo from "../assets/laugh-out-loud-logo.png";
// function GenerateMeme() {
//   const [generatememes, setGenerateMemes] = useState([]);
//   const [memeIndex, setMemeIndex] = useState(0);
//   const [captions, setCaptions] = useState([]);
 
//   // UseEffect to check whether user is logged in or not..
//   const [authuser, setUser] = useState(null);

//   useEffect(() => {
//     auth.onAuthStateChanged((authUser) => {
//       if (authUser) {
//         setUser(authUser);
//       } else {
//         setUser(null);
//         history.push("/");
//       }
//     });
//     // eslint-disable-next-line
//   }, [authuser]);

//   const history = useHistory();
//   function updateCaption(e, index) {
//     const text = e.target.value || "";
//     setCaptions(
//       captions.map((c, i) => {
//         if (index === i) {
//           return text;
//         } else {
//           return c;
//         }
//       })
//     );
//   }
//   const fire_user = firebase.auth().currentUser;
//   function generateMeme() {
//     // Here we are sending the caption and image to the API and then Api is building up the Meme
//     const currentMeme = generatememes[memeIndex];
//     const formData = new FormData();
//     formData.append("username",process.env.REACT_APP_USERNAME);
//     formData.append("password", process.env.REACT_APP_PASSWORD);
//     formData.append("template_id", currentMeme.id);
//     captions.forEach((c, index) => formData.append(`boxes[${index}][text]`, c));

//     fetch("https://api.imgflip.com/caption_image", {
//       method: "POST",
//       body: formData,
//     }).then((res) => {
//       res.json().then((result) => {
//         db.collection("user-memes")
//           .doc(fire_user?.uid)
//           .collection("memes")
//           .add({
//             memes: result,
//             created: true,
//             timestamp: firebase.firestore.FieldValue.serverTimestamp(),
//           })
//           .then(() => history.push(`/generated?url=${result.data.url}`));
//       });
//     });
//   }
//   const shuffleMemes = (array) => {
//     for (let i = array.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * i);
//       const temp = array[i];
//       array[i] = array[j];
//       array[j] = temp;
//     }
//   };

//   useEffect(() => {
//     fetch("https://api.imgflip.com/get_memes").then((res) => {
//       res.json().then((result) => {
//         const _memes = result.data.memes;
//         shuffleMemes(_memes);
//         setGenerateMemes(_memes);
    
//       });
//     });
//   }, []);
//   useEffect(() => {
//     // Each meme image consists of some boxes provided by the API.
//     if (generatememes.length) {
//       setCaptions(Array(generatememes[memeIndex].box_count).fill(""));
//     }
//   }, [memeIndex, generatememes]);


//   return (
//    <div className='meme-container'>
//                <header className="meme-header">
//                <div className="header-left">
//                  <img src={logo} alt="Laugh Out Loud Logo" className="meme-logo" onClick={()=>history.push('/')}/>
//                </div>
//                <div className="header-right">
//                  {fire_user && (
//                  <div className="user-avatar" title={fire_user.displayName}>
//                    {fire_user.displayName?.[0].toUpperCase()}
//                  </div>
//                )}
//                  {fire_user && (
//                    <Button
//                      variant="outlined"
//                      color="primary"
//                      className="header_button"
//                      onClick={() => history.push("/generate-meme")}
//                    >
//                     Create Memes 🖍
//                    </Button>
//                  )}
//                  {fire_user ? (
//                    <Button
//                      variant="contained"
//                      color="secondary"
//                      className="logout-btn"
//                      onClick={() => auth.signOut().then(() => setUser(null))}
//                    >
//                      LOGOUT
//                    </Button>
//                  ) : (
//                    <Button
//                      variant="outlined"
//                      color="primary"
//                      className="header_button"
//                      onClick={() => history.push("/login")}
//                    >
//                      Login to Save Memes
//                    </Button>
//                  )}
//                </div>
//              </header>
//       <div className="generate_meme_div_header">
      
//       <div className="input_conatiner">
//         {generatememes.length > 0 &&
//           captions.map((c, index) => (
//             <input
//               placeholder="Meme Text"
//               onChange={(e) => updateCaption(e, index)}
//               key={index}
//             />
//           ))}
//       <Button className="generate_meme_btn" variant="contained" color="primary" onClick={generateMeme}>
//         Generate your meme
//       </Button>
//       </div>
//       </div>
//       <div className="meme-box">
//       <p> {generatememes.length > 0 && generatememes[memeIndex].name}</p>
//         {generatememes.length > 0 ? (
//           <img
//             className="meme_img"
//             alt="meme"
//             src={generatememes[memeIndex].url}
//           />
//         ) : (
//           <p>Oops Memes over..Now do some Work Don't waste time</p>
//         )}
//         <div className="arrow_box">
//         {memeIndex > 0 && (
//           <ArrowBackIcon
//             titleAccess="Previous Meme Template"
//             className="prev_btn"
//             onClick={() => setMemeIndex(memeIndex - 1)}
//           >
//             Previous
//           </ArrowBackIcon>
//         )}
//         <ArrowForwardIcon
//           titleAccess="Next Meme Template"
//           className="next_btn"
//           onClick={() => setMemeIndex(memeIndex + 1)}
//         >
//           Next
//         </ArrowForwardIcon>
//         </div>
//       </div>
     
//     </div>
//   );
// }

// export default GenerateMeme;


import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import "./Generate-Meme.css";
import { Button } from "@material-ui/core";
import { auth, db } from "../firebase";
import firebase from "firebase";
import logo from "../assets/laugh-out-loud-logo.png";

function GenerateMeme() {
  const [generatememes, setGenerateMemes] = useState([]);
  const [memeIndex, setMemeIndex] = useState(0);
  const [captions, setCaptions] = useState([]);
  const [authUser, setUser] = useState(null);
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

  // 🔤 Update captions
  function updateCaption(e, index) {
    const updated = [...captions];
    updated[index] = e.target.value;
    setCaptions(updated);
  }
// Dynamically update captions based on line count from meme
useEffect(() => {
  if (generatememes.length && generatememes[memeIndex]) {
    const lineCount = generatememes[memeIndex].lines || 2;
    setCaptions(Array(lineCount).fill(""));
  }
}, [memeIndex, generatememes]);
  // 🔗 Construct meme URL

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
      .then(() => history.push(`/generated?url=${memeUrl}`));
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
          >
            Generate Meme
          </Button>
        </div>
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
  );
}

export default GenerateMeme;