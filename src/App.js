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
import Signout from './Signout';
import MaybeShowNavBar from './MaybeShowNavBar';
import ErrorBoundary from './ErrorBoundary';
import { MusicProvider } from './MusicProvider';
import Library from './Library';
import ProtectedComponent from './ProtectedComponent';

import UserProfile from './UserProfile';
import SeeallTrendingsongs from './SeeallTrendingsongs';
import SeeallFeaturedsongs from './SeeallFeaturedsongs';
import Seeallnewreleasesongs from './Seeallnewreleasesongs';
import SeeAllalbum from './SeeAllalbum';
import SeeAllartists from './SeeAllartists';
function App() {
  const [currentSong, setCurrentSong] = useState(null);
  const [isMusicPlayerVisible, setMusicPlayerVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentlyPlayingSong, setCurrentlyPlayingSong] = useState(null);

  const toggleMusicPlayer = () => {
    setMusicPlayerVisible(!isMusicPlayerVisible);
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <MaybeShowNavBar>
          <Navbar />
        </MaybeShowNavBar>

        <Routes>
          <Route path="/" element={
            <MusicProvider value={currentlyPlayingSong}>
              <HomePage setCurrentlyPlayingSong={setCurrentlyPlayingSong} />
            </MusicProvider>
          }
          />


          <Route path="/podcasts" element={<Podcasts />} />

          <Route path="/signup" element={<SignupPage />} />

          <Route path="/login" element={<Login />} />

          <Route path="/Signout" element={<Signout />} />


          <Route path="/userprofile" element={<UserProfile />} />

          <Route path="/album/:albumId" element={<AlbumDetails />} />

          <Route path="/song/:song" element={<SongsDetail />} />

          <Route path="/artist/:artistId" element={<ArtistsDetails />} />

          <Route path="/subscribe" element={<Subscriptions />} />

          <Route path="/search" element={<Search />} />
          <Route path='/seeallsongs1' element={<SeeallFeaturedsongs />} />
          <Route path="/seeallsongs" element={<SeeallTrendingsongs />} />
          <Route path='/seeallsongs2' element={<Seeallnewreleasesongs />} />
          <Route path='/seeallsongs3' element={<SeeAllalbum />} />
          <Route path='/seeallsongs4' element={<SeeAllartists />} />

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
