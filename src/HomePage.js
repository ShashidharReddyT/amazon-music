import React, { useEffect, useState } from 'react';
import './HomePage.css';
import FeaturedSongs from './FeaturedSongs';
import FeaturedAlbums from './FeaturedAlbums';
import FeaturedArtists from './FeaturedArtists';
import TrendingSongs from './TrendingSongs';
import NewReleaseSongs from './NewReleaseSongs';
import Musicplayer from './Musicplayer';
import Loading from './Loading';

function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSong, setCurrentSong] = useState(null);
  const [isMusicPlayerVisible, setMusicPlayerVisible] = useState(false);

  // Function to toggle the music player visibility
  const toggleMusicPlayer = () => {
    setMusicPlayerVisible(!isMusicPlayerVisible);
  };

  useEffect(() => {
    // Simulate loading delay (You can replace this with actual data fetching)
    setTimeout(() => {
      setIsLoading(false);
    }, 500); // 2 seconds for demonstration purposes; replace with your actual data fetching logic
  }, []);

  return (
    <>
      {/* Displaying loading indicator while waiting for data */}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {/* Displaying featured songs */}
          <FeaturedSongs mood="romantic" playSong={setCurrentSong} toggleMusicPlayer={toggleMusicPlayer} />

          {/* Displaying featured albums */}
          <FeaturedAlbums playSong={setCurrentSong} toggleMusicPlayer={toggleMusicPlayer} />

          <TrendingSongs playSong={setCurrentSong} toggleMusicPlayer={toggleMusicPlayer} />

          <NewReleaseSongs playSong={setCurrentSong} toggleMusicPlayer={toggleMusicPlayer} />

          {/* Displaying featured artists */}
          <FeaturedArtists playSong={setCurrentSong} toggleMusicPlayer={toggleMusicPlayer} />


        </>
      )}

      {/* Music Player Container */}
      <div className={`music-player ${isMusicPlayerVisible ? 'visible' : ''}`}>
        {currentSong && (
          <Musicplayer
            audioUrl={currentSong.audio_url}
            albumImage={currentSong.thumbnail}
            title={currentSong.title}
            songId={currentSong._id}
            onClose={() => setCurrentSong(null)}
          />
        )}
      </div>
    </>
  );
}

export default HomePage;
