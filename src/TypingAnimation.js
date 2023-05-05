import React, { useState, useEffect } from 'react';
import './TypingAnimation.css';

const phrases = [
  'Welcome to Virtual DJ',
  'Stream and enjoy',
  'Create your playlist',
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

export default TypingAnimation;
