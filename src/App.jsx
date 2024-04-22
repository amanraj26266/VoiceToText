import React, { useState, useEffect } from 'react';
import './App.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false; // Keep listening even after the user stops talking
  recognition.interimResults = true; // Show results even while still capturing
  recognition.lang = 'en-US'; // Set the language
}

function App() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    if (!recognition) return;

    const handleResult = (event) => {
      const currentTranscript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      setTranscript(currentTranscript);
    };

    recognition.addEventListener('result', handleResult);
    recognition.addEventListener('end', () => isListening && recognition.start());

    return () => {
      recognition.removeEventListener('result', handleResult);
      recognition.removeEventListener('end', () => isListening && recognition.start());
    };
  }, [isListening]);

  const startListening = () => {
    if (!recognition) return;
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    if (!recognition) return;
    setIsListening(false);
    recognition.stop();
  };

  const copyToClipboard = async () => {
    if (!transcript) {
      alert("There's nothing to copy!");
      return;
    }
    try {
      await navigator.clipboard.writeText(transcript);
      alert('Transcript copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="App">
      <div className="head">
        <header className="App-header">
          <h2>Speech To Text Converter</h2>
          <p className='trans'>Transcript: {transcript}</p>
          <div className="btn">
            <button onClick={startListening} disabled={isListening}>Start Listening</button>
            <button onClick={stopListening} disabled={!isListening}>Stop Listening</button>
            <button onClick={copyToClipboard}>Copy Transcript</button>
          </div>
        </header>
      </div>
    </div>
  );
}

export default App;
