import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router";
import { Button } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import DeleteIcon from "@material-ui/icons/Delete";
import { Rnd } from "react-rnd";
import html2canvas from "html2canvas";
import "./Generate-Meme.css";
import { auth } from "../firebase";
import logo from "../assets/laugh-out-loud-logo.png";

function GenerateMemeScratch() {
  const [authUser, setUser] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [textBoxes, setTextBoxes] = useState([]);
  const history = useHistory();
  const previewRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [inputBg, setInputBg] = useState("white");
  const [isCapturing, setIsCapturing] = useState(false);
  const [fontColor, setFontColor] = useState("black");



  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
        history.push("/");
      }
    });
  }, [authUser, history]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const addTextBox = () => {
    setTextBoxes([
      ...textBoxes,
      { id: Date.now(), text: "Text", x: 50, y: 50, width: 150, height: 40 }
    ]);
  };

  const handleTextChange = (e, id) => {
    const newText = e.target.innerText;
    setTextBoxes((prev) =>
      prev.map((box) => (box.id === id ? { ...box, text: newText } : box))
    );
  };
  // Handle Capture
    const handleCapture = async () => {
    if (!previewRef.current) return;

    setIsCapturing(true); 
    
    await new Promise((resolve) => setTimeout(resolve, 100));

    const canvas = await html2canvas(previewRef.current, {
        backgroundColor: null,
        useCORS: true,
        logging: false,
        scale: 2 
    });

    const dataUrl = canvas.toDataURL("image/png");
    setCapturedImage(dataUrl);

    setIsCapturing(false); 
    };
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
          {authUser && (
            <div className="user-avatar" title={authUser.displayName}>
              {authUser.displayName?.[0].toUpperCase()}
            </div>
          )}
          {authUser && (
            <Button
              variant="outlined"
              color="primary"
              className="header_button"
              onClick={() => history.push("/generate-meme")}
            >
              Create Memes <ArrowForwardIcon className="tilted-icon" />
            </Button>
          )}
          <Button
            variant="contained"
            color="secondary"
            className="logout-btn"
            onClick={() => auth.signOut().then(() => setUser(null))}
          >
            LOGOUT
          </Button>
        </div>
      </header>

      <div className="scratch-tools">
        <label htmlFor="upload-input" className="styled-upload-btn">
            Choose Image or GIF
            </label>
            <input
            id="upload-input"
            type="file"
            accept="image/*,image/gif"
            onChange={handleImageUpload}
            style={{ display: "none" }}
            />
          
            
            <select  className="background-selector" value={inputBg} onChange={(e) => setInputBg(e.target.value)}>
                <option disabled>Text Background</option>
                <option value="white">White</option>
                <option value="transparent">Transparent</option>
                <option value="black">Black</option>
            </select>

            
            <select  className="background-selector" value={fontColor} onChange={(e) => setFontColor(e.target.value)}>
                <option disabled>Font Color</option>
                <option value="black">Black</option>
                <option value="white">White</option>
                <option value="red">Red</option>
                <option value="blue">Blue</option>
            </select>
           

            <Button
            variant="outlined"
            onClick={addTextBox}
            disabled={!imageSrc}
            >
            + Add Text
            </Button>
      </div>

      <div className="scratch-preview">
        <div className="preview-area" ref={previewRef} id="capture-area">
            {imageSrc ? (
            <img src={imageSrc} alt="Preview" className="uploaded-image" />
            ) : (
            <div className="placeholder-text">Preview</div>
            )}

            {imageSrc &&
            textBoxes.map((box) => (
                
                <Rnd
                key={box.id}
                bounds="parent"
                default={{
                    x: box.x,
                    y: box.y,
                    width: box.width,
                    height: box.height,
                }}
                onDragStop={(e, d) => {
                    setTextBoxes((prev) =>
                    prev.map((b) => (b.id === box.id ? { ...b, x: d.x, y: d.y } : b))
                    );
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                    setTextBoxes((prev) =>
                    prev.map((b) =>
                        b.id === box.id
                        ? {
                            ...b,
                            width: parseInt(ref.style.width),
                            height: parseInt(ref.style.height),
                            ...position,
                            }
                        : b
                    )
                    );
                }}
                >
                <div className="draggable-text-container">
                    <div
                    contentEditable={!isCapturing}
                    suppressContentEditableWarning
                    className={`draggable-text ${isCapturing ? "no-border" : ""}`}
                    style={{
                        backgroundColor: inputBg,
                        color: fontColor,
                    }}
                    onBlur={(e) => handleTextChange(e, box.id)}
                    >
                    {box.text}
                    </div>

                    {!isCapturing && (
                    <button
                        className="delete-textbox"
                        onPointerDown={(e) => {
                        e.stopPropagation(); // Prevent drag
                        e.preventDefault();  // Prevent touch/tap from triggering drag
                        setTextBoxes((prev) => prev.filter((b) => b.id !== box.id));
                        }}
                    >
                        <DeleteIcon fontSize="small" color="secondary" />
                    </button>
                    )}
                </div>
                </Rnd>
            
        

            ))}
        </div>
        {capturedImage && (
            <div style={{ marginTop: "20px", textAlign: "center" }}>
            <h3>Generated Meme:</h3>
            <img src={capturedImage} alt="Captured Meme" style={{ maxWidth: "100%", border: "1px solid #ccc" }} />
            <a href={capturedImage} download="meme.png">
            <Button variant="outlined" style={{ marginTop: "10px" }}>
            Save Meme
            </Button>
            </a>
            </div>
            )}
        </div>
        <Button variant="contained" color="primary"  disabled={!imageSrc} onClick={handleCapture}>
        Preview Meme
        </Button>
        
        
    </div>
  );
}

export default GenerateMemeScratch;