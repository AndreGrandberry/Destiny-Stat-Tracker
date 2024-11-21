import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from './homepage/Homepage';
import DemoDashboard from './dashboard/DemoDashboard';
import Dashboard from './dashboard/Dashboard';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Homepage />} />
        <Route exact path="/demo" element={<DemoDashboard />} />
        <Route exact path="/dashboard" element={<Dashboard />} />

        
      </Routes>
    </BrowserRouter>
  );
};

export default App;