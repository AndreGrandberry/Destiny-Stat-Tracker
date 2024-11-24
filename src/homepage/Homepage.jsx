import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Homepage.css";


// Component for the Homepage
const Homepage = () => {
  const navigate = useNavigate();

  const handleDemoClick = () => {
    navigate('/demo'); // Navigate to the /demo page
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  


  const handleOAuthButtonClick = async () => {
    try {
      setLoading(true);
      // Url to initiate OAuth flow
      const authorizationUrl = `https://www.bungie.net/en/oauth/authorize?client_id=${import.meta.env.VITE_OAUTH_CLIENT_ID}&response_type=code&redirect_uri=https://destiny-stat-tracker.com/auth/callback`;
      window.location.href = authorizationUrl; // Redirect user to OAuth provider
    } catch (error) {
      setError(error.message);
      console.error('Error initiating OAuth flow:', error);
    } finally {
      setLoading(false); // Set loading state to false when OAuth flow concludes.
    }
  };


  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Welcome to The Destiny 2 Stat Tracker</h1>
      <p className="homepage-description">
        Click the button below to give us permission to authorize with Bungie to acces your Bungie.net information.
      </p>
      <button className="homepage-button" onClick={handleOAuthButtonClick} disabled={loading}>
        {loading ? 'Loading...' : 'Log in with your Bungie.net account'}
      </button>
      {error && <p className="homepage-error">Error: {error}</p>}

      <p className="github-link">
        Got any feedback? Here's a link to the <a href="https://github.com/AndreGrandberry/Destiny-Stat-Tracker" target="_blank" rel="noopener noreferrer">GitHub Repo</a>.
      </p>

      <p className="demo-info-text">
        Don't have a Destiny 2 Account? <br />
        View the demo page to see an example of a player's stats.
      </p>

      {/* Demo button with container for positioning */}
      <div className="demo-button-container">
        <button className="homepage-button" onClick={handleDemoClick}>
          View Demo
        </button>
      </div>

    </div>
  );
};


export default Homepage;