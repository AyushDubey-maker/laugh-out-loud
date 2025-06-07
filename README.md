# Laugh Out Loud

**Laugh Out Loud** is a meme-centric web application that lets users browse, save, generate, and interact with memes—all in a seamless, personalized interface. Built using **React.js**, **Firebase**, and deployed via **Vercel**, it combines modern frontend development, scalable backend integration, and even a pinch of **AI/ML** because, well, it’s trending.

---

## Features

### 🔹 Meme Browsing & Interaction
- Fetches memes dynamically via external APIs.
- Implements swipe gestures and navigational controls (keyboard/mouse/touch) for cross-device compatibility.
- Optimized lazy loading and error handling with fallbacks (404 images, spinners).

### 🔹 Authentication & Personalization
- Firebase Authentication via Google OAuth.
- Persistent meme saving (Firestore).
- Dynamic avatar handling and saved meme previews.

### 🔹 Meme Generator
- Real-time meme preview updates based on user-selected template and text.
- Text rendering via URL encoding against template APIs.
- Modal-based UX for editing meme previews.

### 🔹 "Roast Me" Bot Mode (AI Feature)
- An experimental chat-style roasting interface.
- Utilizes Hugging Face’s `mistralai/Mistral-7B-Instruct-v0.3` model to generate witty and sharp responses.
- Extensive **prompt engineering** was applied to generate emotionally resonant, yet hilariously savage responses to user inputs.

---

## Tech Stack

| Area                | Stack/Tooling                                       |
|---------------------|-----------------------------------------------------|
| Frontend            | React.js, HTML5, CSS3, Material UI, React Spinkit  |
| State Management    | React Hooks, useEffect/useState/useCallback         |
| Backend Services    | Firebase Auth, Firestore DB                         |
| AI/ML Integration   | Hugging Face Inference API                          |
| Prompt Engineering  | Custom system instructions for dynamic response     |
| Deployment          | Vercel (CI/CD integrated)                           |

---

## Firebase Setup

To enable Firebase functionality:

1. Create a Firebase project on [console.firebase.google.com](https://console.firebase.google.com).
2. Enable Google Authentication.
3. Create a Firestore database in test mode.
4. In your React project, create a `.env` file and add:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

```
---

## AI/ML Model Integration (Hugging Face)

The **Roast Me** chat uses `mistralai/Mistral-7B-Instruct-v0.3`, accessed via the **Hugging Face Inference API**.

To set this up:

1. Create an account at [huggingface.co](https://huggingface.co).
2. Generate an API token from your Hugging Face account settings.
3. Add the following to your `.env` file:

```env
REACT_APP_HUGGINGFACE_API_KEY=your_hf_token
```
---

## Project Highlights

- Adaptive, mobile-responsive UI with intelligent layout changes.
- Modular component structure with accessibility in mind.
- Applied prompt engineering to fine-tune the AI’s tone, style, and context-awareness.
- Enhanced performance with preloading and debounced transitions.
- Custom tooltips, modals, animations, and image fallback logic to maximize user engagement.

---

## Live Demo

Access the application here:  
[https://laugh-out-loud-fawn.vercel.app/](https://laugh-out-loud-fawn.vercel.app/)

---

## Future Scope

- Add meme image-to-text generation using multimodal models.
- Integrate personalized feed via user preferences.
- Add leaderboard and gamification for meme creation.
- Enable direct social media sharing for memes.