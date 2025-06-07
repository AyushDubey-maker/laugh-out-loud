import React, { useState } from "react";
import axios from 'axios';
import "./RoastMeModal.css";

const RoastMeModal = ({ isOpen, onClose }) => {
    const [input, setInput] = useState("");
    const [roast, setRoast] = useState("");
    const [loading, setLoading] = useState(false);
    if (!isOpen) return null;

const getRoast = async (userInput) => {
  setLoading(true);
  try {
    const model = "meta-llama/Llama-3.1-8B";
    const HF_TOKEN = process.env.REACT_APP_HUGGINGFACE_API_KEY;

    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      { inputs: `Roast this: ${userInput}` },
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const output = response.data?.[0]?.generated_text || "That was too dumb even for me.";
    setRoast(output);
  } catch (err) {
    console.error("Error:", err.message);
    setRoast("Oops, I forgot how to roast. Try again later.");
  }
  setLoading(false);
};

  const handleSend = () => {
    if (input.trim()) {
     getRoast(input.trim())
    }
  };
  return (
    <div className="roast-modal-backdrop">
      <div className="roast-modal">
        <div className="roast-modal-header">
          <h2>Roast Me Bot</h2>
          <span className="roast-modal-close" onClick={onClose}>&times;</span>
        </div>
        <div className="roast-modal-body">
          <div className="chat-window">
            <div className="chat-messages">
              <div className="chat-bubble left">Roast Me Bot: Say something dumb, I dare you.</div>
            </div>
            <div className="chat-input-container">
              <input type="text" placeholder="Roast me..."  value={input} onChange={(e) => setInput(e.target.value)}/>
              <button onClick={handleSend} disabled={loading}>
                {loading ? "Roasting..." : "Send"}
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default RoastMeModal;
