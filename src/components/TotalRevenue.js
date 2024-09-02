import React, { useEffect, useState, useRef, useCallback } from 'react';

const TotalRevenue = ({ products, formatNumber }) => {
  const [hasAnnounced, setHasAnnounced] = useState(false);
  const [lastAnnouncementTime, setLastAnnouncementTime] = useState(null);
  const timeoutRef = useRef(null);
  const recognitionRef = useRef(null);

  // Calculate the total revenue
  const totalRevenue = products.reduce((acc, product) => acc + product.totalRevenue, 0);

  // Function to speak the total revenue in INR
  const speakRevenue = useCallback(() => {
    if (typeof SpeechSynthesisUtterance !== 'undefined' && typeof speechSynthesis !== 'undefined') {
      console.log('Speaking revenue:', formatNumber(totalRevenue));
      const utterance = new SpeechSynthesisUtterance(
        `The final total revenue is ${formatNumber(totalRevenue)} Indian Rupees.`
      );
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    } else {
      console.error('Speech Synthesis API is not supported');
    }
  }, [totalRevenue, formatNumber]);

  // Function to handle inactivity timeout
  const setInactivityTimeout = useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const currentTime = new Date().getTime();
      const lastAnnouncement = lastAnnouncementTime || 0;
      const tenMinutesInMilliseconds = 10 * 60 * 1000;
      const eightSecondsInMilliseconds = 8 * 1000;

      if (!hasAnnounced || (currentTime - lastAnnouncement > tenMinutesInMilliseconds)) {
        speakRevenue();
        setHasAnnounced(true);
        setLastAnnouncementTime(currentTime);
      } else if (currentTime - lastAnnouncement > eightSecondsInMilliseconds) {
        setHasAnnounced(false); // Allow announcement if inactivity period of 8 seconds is reached
      }
    }, 8000); // 8-second polling to check for inactivity
  }, [hasAnnounced, speakRevenue, lastAnnouncementTime]);

  useEffect(() => {
    console.log('Initializing speech recognition');
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      if (transcript.includes('total revenue')) {
        const currentTime = new Date().getTime();
        const tenMinutesInMilliseconds = 50 * 60 * 1000;

        if (!hasAnnounced || (currentTime - lastAnnouncementTime > tenMinutesInMilliseconds)) {
          speakRevenue();
          setHasAnnounced(true);
          setLastAnnouncementTime(currentTime);
        }
        recognition.stop();
      }
      // Reset inactivity timeout on command result
      setInactivityTimeout();
    };

    recognition.onspeechend = () => {
      console.log('Speech ended');
      setInactivityTimeout();
    };

    recognition.onerror = (event) => {
      console.error('Error occurred in recognition:', event.error);
      recognition.stop();
      setInactivityTimeout();
    };

    recognitionRef.current = recognition;

    // Start recognition
    recognition.start();

    // Clean up on component unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        clearTimeout(timeoutRef.current);
      }
    };
  }, [hasAnnounced, speakRevenue, setInactivityTimeout, lastAnnouncementTime]);

  useEffect(() => {
    console.log('Products changed, resetting announcement state');
    if (hasAnnounced) {
      setHasAnnounced(false); // Reset announcement state when products change
    }
    setInactivityTimeout();
  }, [products, setInactivityTimeout]);

  useEffect(() => {
    console.log('Monitoring user input');
    // Reset inactivity timeout on user input
    setInactivityTimeout();

    // Cleanup on component unmount
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [products, formatNumber]);

  return (
    <div className="total-revenue">
      <center>
        <strong>Total Revenue: {formatNumber(totalRevenue)} Indian Rupees</strong>
      </center>
    </div>
  );
};

export default TotalRevenue;
