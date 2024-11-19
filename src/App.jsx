import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from './homepage/Homepage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Homepage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;