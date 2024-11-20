import React, { useState, useEffect } from 'react';
import './DemoDashboard.css'; // Make sure the CSS is imported

const DemoDashboard = () => {
  const [metricsData, setMetricsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetricsData = async () => {
      try {
        const response = await fetch('/demo'); // Fetch data from backend
        const data = await response.json();
        setMetricsData(data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchMetricsData(); // Call the fetch function on mount
  }, []);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="demo-page-container">
      <h1 className="demo-page-title">Demo Metrics</h1>
      <div className="demo-page-section">
        {metricsData.length > 0 ? (
          metricsData.map((category, index) => (
            <div key={index} className="demo-page-category">
              <h2>{category.displayName}</h2>
              <div className="demo-page-content">
                {category.stats.map((metric, idx) => (
                  <div key={idx} className="demo-page-section">
                    <h3>{metric.name}</h3>
                    <p>{metric.description}</p>
                    <p>Progress: {metric.progress}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="error">No metrics data available</p>
        )}
      </div>
    </div>
  );
};

export default DemoDashboard;
