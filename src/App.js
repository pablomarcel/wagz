import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Create from './pages/Create';
import LoginPage from './pages/LoginPage';
import NavBar from './components/NavBar';
import './bootstrap-5.2.3-dist/css/bootstrap.css'
import CreatePetOwner from "./pages/CreatePetOwner";
import CreatePet from "./pages/CreatePet";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import Favorites from './pages/Favorites';
import Saved from './pages/Saved';
import Following from './pages/Following';

function App() {
  return (
      <div className="App">
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/createPetOwner" element={<CreatePetOwner />} />
            <Route path="/createPet" element={<CreatePet />} />
            <Route path="/post" element={<CreatePost />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/following" element={<Following />} />
          </Routes>
        </Router>
      </div>
  );
}

export default App;
