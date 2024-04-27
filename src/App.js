import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [showWebView, setShowWebView] = useState(false);

  const iframeRef = useRef(null);
  const toggleWebView = () => setShowWebView(!showWebView);

  const postData = {
    userId: 'USER TEST',
    category: '', // leave empty if you do not want to display it
    planC: 'Cardio',
    company: 'YOUR COMPANY NAME',
    key: 'YOUR KEY',
    age: 50,
    height: 150, // in cm
    weight: 200,
    gender: 'Male'
  };

  const handleMessage = (event) => {
    
    try {
      if (event.data) {
        const message = JSON.parse(event.data);
  
        console.log('Received data:', message); // Log the received data
  
        if (message.type === 'finished_workout') {
          console.log('Received data:', message.data);
     
        }
        if (message.type === 'exitApp') {
          toggleWebView();
        }
        if (message.type === 'error_occured') {
          console.log('Received data:', message.data);
          toggleWebView();
        }
        if (message.type === 'exercise_completed') {
          console.log('Received data:', message.data);
      
        }
      } else {
        console.log('Received empty message'); // Log if the message is empty
      }
    } catch (e) {
      console.error('Could not parse JSON message from WebView:', e);
    }
  };
  useEffect(() => {
    const handleWindowMessage = (event) => {
      handleMessage(event);
    };

    window.addEventListener('message', handleWindowMessage);

    return () => {
      window.removeEventListener('message', handleWindowMessage);
    };
  }, [toggleWebView]); 



  useEffect(() => {
    if (showWebView && iframeRef.current) {
      // Ensure the iframe is loaded before posting the message
      iframeRef.current.onload = () => {
        iframeRef.current.contentWindow.postMessage(postData, '*'); // Specify the target origin as needed
      };
    }
  }, [showWebView]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {!showWebView && <button onClick={toggleWebView}>Open WebView</button>} {/* CUSTOM BUTTON TO LAUNCH KINESTEX */}
      {showWebView && (
        <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', zIndex: '0' }}>
          <iframe
            ref={iframeRef}
            src="https://kinestex.vercel.app/"
            frameBorder="0"
            allow="camera; microphone; autoplay"
            sandbox="allow-same-origin allow-scripts"
            allowFullScreen={true}
            javaScriptEnabled={true}
            style={{ width: '100%', height: '100%' }}
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default App;
