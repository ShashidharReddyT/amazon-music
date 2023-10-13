import React, { useState } from 'react';
import Navbar from './Navbar';
import HomePage from './HomePage';
import Search from './Search';
import Subscriptions from './Subscriptions';
import AlbumDetails from './AlbumDetails';
import SongsDetail from './SongsDetail';
import ArtistsDetails from './ArtistsDetails';


import Podcasts from './Podcasts';
import { Route, Routes, Navigate } from "react-router-dom";
import SignupPage from './SignupPage';
import Login from './Login';
import MaybeShowNavBar from './MaybeShowNavBar';
import ErrorBoundary from './ErrorBoundary';
import { MusicProvider } from './MusicProvider';
import Library from './Library';
import ProtectedComponent from './ProtectedComponent';



function App() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };
  return (
    <ErrorBoundary>
      <div className="App">
        <MaybeShowNavBar>
          <Navbar onSearch={handleSearch} />
        </MaybeShowNavBar>
        <Routes>
          <Route
            path="/"
            element={
              <MusicProvider>
                <HomePage searchTerm={searchTerm} />
              </MusicProvider>
            }
          />

          <Route path="/podcasts" element={<Podcasts />} />

          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<Login />} />

          <Route path="/album/:albumId" element={<AlbumDetails />} />

          <Route path="/song/:song" element={<SongsDetail />} />

          <Route path="/artist/:artistId" element={<ArtistsDetails />} />

          <Route path="/subscribe" element={<Subscriptions />} />

          <Route path="/search" element={<Search />} />

          <Route path="*" element={<Navigate to="/" />} />

          {/* Protected route for Library */}
          <Route
            path="/library"
            element={
              <ProtectedComponent>
                <Library />
              </ProtectedComponent>
            }
          ></Route>
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;
