import React, { useState, useEffect } from 'react';
import "./Login.css";

const phrases = [
  'Queue up your favorite tracks',
  'Play, pause, skip, and go back with ease',
  'Take control with the DJ board',
  'Seamlessly mix two songs together',
  'Let the AI DJ create the perfect mix',
];

function TypingAnimation() {
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      let currentText = phrases[phraseIndex].substr(0, text.length);

      if (isDeleting) {
        setText(currentText.substring(0, currentText.length - 1));
        if (currentText.length === 0) {
          setIsDeleting(false);
          setPhraseIndex((phraseIndex + 1) % phrases.length);
        }
      } else {
        setText(phrases[phraseIndex].substring(0, currentText.length + 1));
        if (text.length === phrases[phraseIndex].length) {
          setIsDeleting(true);
        }
      }
    }, isDeleting ? 100 : 200);

    return () => clearTimeout(timeOut);
  }, [text, isDeleting, phraseIndex]);

  return (
    <div className="typing-animation">
      <span>{text}</span>
      <span className="typing-cursor">|</span>
    </div>
  );
}

function Login() {
  return (
    <div className="login-container">
      <div className="animation-container">
        <span className="welcome">Welcome to Virtual DJ!</span>
        <TypingAnimation />
      </div>
      <div className="login-content">
        <h1 className="login-title">Virtual DJ</h1>
        <a href="/auth/login" className="login-button">
          Login with Spotify
        </a>
        <p className="login-disclaimer">* Premium Spotify account required</p>
      </div>
    </div>
  );
}

export default Login;
