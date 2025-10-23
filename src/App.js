import logo from './logo.svg';
import './App.css';
import { Routes, Route, BrowserRouter} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { useState } from 'react';
import SegmentModal from './home';


function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  //  IMPORTANT: Replace this placeholder with your actual webhook.site URL 
  const WEBHOOK_URL = 'https://webhook.site/379768ca-a2cf-4cf9-9b5e-0142d4841f96';

  const handleSaveData = async (data) => {
    console.log('Attempting to send data:', data);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: "no-cors",
        // Convert the required JSON payload to a string
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Segment data successfully sent to webhook.site');
        alert('Segment saved! Data successfully sent to webhook.site. Check your webhook page!');
      } else {
        console.error('Failed to send data. Status:', response.status);
        alert('Segment saved, but data submission failed. Check the console.');
      }
    } catch (error) {
      console.error('Network error during data submission:', error);
      alert('Segment saved, but a network error occurred. Check the console.');
    }
  };
  return (
    // <div className="App">
    //   <BrowserRouter>
    //     <Routes>
    //       <Route path="/" element={<HomeComponent />} />
    //     </Routes>
    //   </BrowserRouter>
    // </div>
    <div className="app-container">
      <h1>View Audience</h1>

      {/* 1. Button caption "Save segment" */}
      <button
        className="main-save-btn"
        onClick={() => setIsModalOpen(true)}
      >
        Save segment
      </button>

      {/* 2. Popup component */}
      <SegmentModal
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveData}
      />
    </div>
  );
}

export default App;
