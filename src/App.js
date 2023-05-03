//src/App.js:

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Create from './pages/Create';
import LoginPage from './pages/LoginPage';
import NavBar from './components/NavBar';
import './bootstrap-5.2.3-dist/css/bootstrap.css'

function App() {
  return (
      <div className="App">
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Router>
      </div>
  );
}

export default App;
