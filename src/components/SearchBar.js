import React, { useEffect, useRef } from 'react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  const voiceBtnRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const voiceBtn = voiceBtnRef.current;
    const searchInput = searchInputRef.current;

    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      console.error("Speech Recognition API not supported.");
      return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const handleVoiceButtonClick = () => {
      recognition.start();
    };

    const handleRecognitionResult = (event) => {
      const speechResult = event.results[0][0].transcript;
      if (searchInput) {
        searchInput.value = speechResult;
        setSearchTerm(speechResult); // Update the search term state
      }
    };

    const handleRecognitionEnd = () => {
      recognition.stop();
    };

    const handleRecognitionError = (event) => {
      console.error("Error occurred in recognition: ", event.error);
    };

    if (voiceBtn) {
      voiceBtn.addEventListener("click", handleVoiceButtonClick);
    }

    recognition.onresult = handleRecognitionResult;
    recognition.onspeechend = handleRecognitionEnd;
    recognition.onerror = handleRecognitionError;

    // Cleanup event listeners on component unmount
    return () => {
      if (voiceBtn) {
        voiceBtn.removeEventListener("click", handleVoiceButtonClick);
      }
    };
  }, [setSearchTerm]);

  return (
    <div className="search-bar">
      <label htmlFor="search">Search: </label>
      <div className="input-container">
        <input
          type="text"
          id="search-input"
          ref={searchInputRef}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search by product name..."
        />
        <button id="voice-btn" ref={voiceBtnRef} aria-label="Voice Search">
          🎙
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
