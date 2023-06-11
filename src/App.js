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
import CreateCommunity from "./pages/CreateCommunity";
import CreatePost from "./pages/CreatePost";
import CreateCommunityPost from "./pages/CreateCommunityPost";
import Profile from "./pages/Profile";
import Favorites from './pages/Favorites';
import Saved from './pages/Saved';
import Following from './pages/Following';
import SharedWithMe from './pages/SharedWithMe';
import PetOwnerProfile from './components/Profile/PetOwnerProfile';
import PetPost from './components/Pets/PetPost';
import PostProfile from './components/Posts/PostProfile';
import PetProfile from './components/Pets/PetProfile';
import PublicFigureProfile from './components/PublicFigures/PublicFigureProfile';
import CommunityProfile from './components/Communities/CommunityProfile';
import Feedback from './pages/Feedback';
import Shop from './components/Commerce/Shop';
import Events from './components/Events/Events';
import PublicFigures from './components/PublicFigures/PublicFigures';
import PublicFigureForm from './components/PublicFigures/PublicFigureForm';
import EventForm from './components/Events/EventForm';
import PostRecommendations from './components/PostRecommendations/PostRecommendations';
import PublicFigurePostForm from './components/PublicFigures/PublicFigurePostForm';
import Communities from './components/Communities/Communities';
import MyPets from './components/Pets/MyPets';
import ItemPost from './components/Commerce/ItemPost';
import EventPost from './components/Events/EventPost';
import PublicFigurePost from './components/PublicFigures/PublicFigurePost';
import CommunityPost from './components/Communities/CommunityPost';
import Payments from './components/Payments/Payments';
import StripePayments from './components/StripePayments/StripePayments';

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
            <Route path="/createCommunity" element={<CreateCommunity />} />
            <Route path="/post" element={<CreatePost />} />
            <Route path="/communityPost" element={<CreateCommunityPost />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/following" element={<Following />} />
            <Route path="/sharedwithme" element={<SharedWithMe />} />
            <Route path="/petownerprofile/:email" element={<PetOwnerProfile />} />
            <Route path="/petpost/:postId" element={<PetPost />} />
            <Route path="/postprofile/:postId" element={<PostProfile />} />
            <Route path="/petprofile/:petId" element={<PetProfile />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/events" element={<Events />} />
            <Route path="/publicfigures" element={<PublicFigures />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/mypets" element={<MyPets />} />
            <Route path="/itempost/:itemId" element={<ItemPost />} />
            <Route path="/eventpost/:eventId" element={<EventPost />} />
            <Route path="/publicfigurepost/:publicFigurePostId" element={<PublicFigurePost />} />
            <Route path="/communityPost/:communityPostId" element={<CommunityPost />} />
            <Route path="/publicfigureprofile/:publicFigureId" element={<PublicFigureProfile />} />
            <Route path="/communityProfile/:communityId" element={<CommunityProfile />} />
            <Route path="/payments/*" element={<Payments />} />
            <Route path="/publicfigureform" element={<PublicFigureForm />} />
            <Route path="/publicfigurepostform" element={<PublicFigurePostForm />} />
            <Route path="/eventform" element={<EventForm />} />
            <Route path="/postrecommendations" element={<PostRecommendations />} />
            <Route path="/stripepayments/*" element={<StripePayments />} />
          </Routes>
        </Router>
      </div>
  );
}

export default App;
