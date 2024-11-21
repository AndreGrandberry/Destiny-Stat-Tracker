import React, { useState, useEffect } from 'react';
import './Dashboard.css'; // Make sure to import your CSS file to keep the styling
import ReturnHomeButton from './ReturnHomeButton';
import { convertTimestamp } from './DashboardFunctions'; // This function can stay the same

const Dashboard = () => {
  const [metricsData, setMetricsData] = useState([]); // Data state for metrics (from MongoDB)
  const [selectedCategory, setSelectedCategory] = useState('Seasons'); // Default selected category
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch metrics data from MongoDB on component mount (but now from /api instead of /demo)
  useEffect(() => {
    const fetchMetricsData = async () => {
      try {
        const response = await fetch('/api'); // Fetch the data from the /api endpoint (MongoDB)
        const data = await response.json();
        setMetricsData(data); // Set the fetched data to state
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        setError('Error fetching data');
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchMetricsData(); // Call the fetch function when component mounts
  }, []);

  // Smooth scroll to top when category is selected
  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    window.scrollTo({
      top: 0, // Scroll to the top of the page
      left: 0,
      behavior: 'smooth', // Enable smooth scrolling
    });
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h1 className="title">Destiny Stat Tracker</h1>
      <p className="intro">Your stats for various Destiny 2 activities pulled from MongoDB</p>
      <ReturnHomeButton />

      {/* Category Names Displayed Evenly Across the Page */}
      <div className="categories">
        {metricsData.length > 0 &&
          metricsData.map((category, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(category.categoryName)} // Trigger smooth scroll and category change
              className={`category ${selectedCategory === category.categoryName ? 'selected' : ''}`}
            >
              {category.categoryName}
            </div>
          ))}
      </div>

      {/* Render metrics for the selected category */}
      <div className="metrics">
        {selectedCategory &&
          metricsData
            .filter((category) => category.categoryName === selectedCategory)
            .map((category) => (
              <div key={category.categoryName}>
                <h2 className="category-title">{category.categoryName}</h2>
                {category.metrics.map((metric, idx) => (
                  <div key={idx} className="metric">
                    <h4>{metric.name}</h4>
                    <p>{metric.description}</p>
                    <p className="progress">Progress: {metric.description.startsWith('The fastest completion')
                    ? convertTimestamp(metric.progress) // Convert progress to timestamp
                    : metric.progress // Otherwise, use the original progress value
                    }</p>
                  </div>
                ))}
              </div>
            ))}
      </div>
    </div>
  );
};

export default Dashboard;