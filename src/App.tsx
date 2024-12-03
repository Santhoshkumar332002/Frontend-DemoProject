import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './Home/pages';
import ProductDashboard from './ProductCard/GetProduct';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product-dashboard" element={<ProductDashboard />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
