import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import firebase from 'firebase';
import "./RoastMeModal.css";

const RoastMeModal = ({ isOpen, onClose }) => {

  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const isLoggedIn = firebase.auth().currentUser;
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);
  if (!isOpen) return null;
  const getTodayKey = () => {
    const today = new Date();
    return `roast_quota_${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  };

  const getQuota = () => {
    const quotaKey = getTodayKey();
    const stored = JSON.parse(localStorage.getItem(quotaKey)) || { count: 0 };
    return stored;
  };

  const incrementQuota = () => {
    const quotaKey = getTodayKey();
    const { count } = getQuota();
    localStorage.setItem(quotaKey, JSON.stringify({ count: count + 1 }));
  };

  const politePhrases = [
    "you are good", "nice work", "well done", "good job", "thanks", "you're smart", "you’re the best",
    "good effort", "appreciate you", "that was nice", "so kind of you", "you're kind", "you’re sweet"
  ];
  const braggyPhrases = [
    "i’m too good", "you can’t roast me", "i'm unroastable", "i’m amazing", "i never lose", "nobody can touch me"
  ];
  const defensivePhrases = [
    "don’t roast", "please be nice", "go easy", "don’t be harsh", "not too mean", "skip me please"
  ];
  const selfPityPhrases = [
    "i look ugly", "i’m dumb", "i suck", "i’m trash", "i hate myself", "i have no friends"
  ];
  const attentionPhrases = [
    "say something funny", "entertain me", "got jokes?", "bored me", "give me content"
  ];
  const greetingPhrases = ["hi", "hello", "hey", "yo", "sup"];


  const getRoast = async (userInput) => {
  setLoading(true);

  const lower = userInput.toLowerCase().trim();
  let extra = "";

  if (politePhrases.some(p => lower.includes(p))) {
    extra = " They're fishing for praise. Roast them like a humble-bragger.";
  } else if (braggyPhrases.some(p => lower.includes(p))) {
    extra = " They think they're untouchable. Bring them back to Earth.";
  } else if (defensivePhrases.some(p => lower.includes(p))) {
    extra = " They're asking not to be roasted. That’s your cue to double down.";
  } else if (selfPityPhrases.some(p => lower.includes(p))) {
    extra = " They want sympathy. Give them savage honesty.";
  } else if (attentionPhrases.some(p => lower.includes(p))) {
    extra = " They want entertainment. Roast them for being lazy and needy.";
  } else if (greetingPhrases.includes(lower)) {
    extra = " They think just saying 'hi' counts as effort. Roast them for barely showing up.";
  } else if (lower === "") {
    extra = " Roast them for saying absolutely nothing. That's peak effort.";
  }

  try {
    const model = "mistralai/Mistral-7B-Instruct-v0.3";
    const HF_TOKEN = process.env.REACT_APP_HUGGINGFACE_API_KEY;

    const prompt = `
You are a savage roast bot. Always respond with a single sentence only.
Be sarcastic, brutal, and sound like you're roasting a friend.
Use simple language a teenager would understand. No clever wordplay. No personal jokes. No explanations. No suggestions.
Minimum emoji usage. Response must be formatted correctly with capital letter and punctuation.${extra}

User: ${userInput}
Bot:
`;

    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    let output = response.data?.generated_text || response.data?.[0]?.generated_text || "That roast was too weak.";
    output = output.split(/\n|"|“|”/).filter(line => line.trim()).pop().trim();

    setChatHistory(prev => [
      ...prev,
      { type: "user", text: userInput },
      { type: "bot", text: output }
    ]);
    setInput("");
  } catch (err) {
    console.error("Error:", err.message);
    setChatHistory(prev => [
      ...prev,
      { type: "bot", text: "Oops, I forgot how to roast. Try again later." }
    ]);
    setInput("");
  }

  setLoading(false);
};

  const handleSend = () => {
  const { count } = getQuota();
  const maxAllowed = isLoggedIn ? 10 : 3;

  if (count >= maxAllowed) {
    const msg = isLoggedIn
      ? "You've hit your roast limit for today. Come back tomorrow for more burns."
      : "Want more roasts? Login to get 7 more today!";
    setChatHistory(prev => [...prev, { type: "bot", text: msg }]);
    return;
  }
    if (input.trim()) {
      getRoast(input.trim());
      incrementQuota();
    }
  };

  return (
    <div className="roast-modal-backdrop">
      <div className="roast-modal">
        <div className="roast-modal-header">
          <h2 className="laughbot-title">LaughBot: Unfiltered</h2>
          <span className="roast-modal-close" onClick={onClose}>&times;</span>
        </div>
        <div className="roast-modal-body">
           <p className="intro-message">
          Welcome to <strong>LaughBot: Unfiltered</strong> – your sarcastic sidekick! Type anything and get roasted in one brutally honest line. Ready to laugh at yourself?
            </p>
          <div className="chat-window">
            <div className="chat-messages">
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`chat-bubble ${msg.type === "user" ? "right" : "left"}`}
                >
                  {msg.type === "user" ? `You: ${msg.text}` : `LaughBot: ${msg.text}`}
                </div>
              ))}
               <div ref={bottomRef} />
            </div>
            <div className="chat-input-container">
              <input
                type="text"
                placeholder="Roast me..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button onClick={handleSend} disabled={loading}>
                {loading ? "Roast in progress..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoastMeModal;
