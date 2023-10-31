import React, { useState, useEffect } from 'react';
import './HomePage.css';
import FeaturedSongs from './FeaturedSongs';
import FeaturedAlbums from './FeaturedAlbums';
import FeaturedArtists from './FeaturedArtists';
import TrendingSongs from './TrendingSongs';
import NewReleaseSongs from './NewReleaseSongs';
import Musicplayer from './Musicplayer';
import Loading from './Loading';
import { useMusic } from './MusicProvider';

function HomePage(setCurrentlyPlayingSong) {
  const { selectedMusic, setMusic, playNext, playPrevious, artistNames } = useMusic();
  const [isLoading, setIsLoading] = useState(true);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const { currentSong, setCurrentSong } = useMusic();
  const [songResults, setSongResults] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);

  const [audioDuration, setAudioDuration] = useState(0);
  const [songIndex, setSongIndex] = useState(null);

  // Function to play the next song
  const playNextSong = () => {
    if (currentSongIndex < artistNames.length - 1) {
      const nextSongIndex = currentSongIndex + 1;
      setCurrentSongIndex(nextSongIndex);
      setCurrentSong(artistNames[nextSongIndex]);
    }
  };

  // Function to play the previous song
  const playPreviousSong = () => {
    if (currentSongIndex > 0) {
      const previousSongIndex = currentSongIndex - 1;
      setCurrentSongIndex(previousSongIndex);
      setCurrentSong(artistNames[previousSongIndex]);
    }
  };

  const playSong = (itemData, index) => {
    setCurrentlyPlayingSong(itemData._id);
    if (selectedSong === itemData) {
      setSelectedSong(null);
      // Clear selected music
    } else {
      setSelectedSong(itemData);
      setSongIndex(index);

    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 0);
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <FeaturedSongs mood="romantic" />

          <FeaturedAlbums />

          <TrendingSongs />

          <NewReleaseSongs />

          <FeaturedArtists />

          {currentSong && (
            <Musicplayer
              audioUrl={currentSong.audioUrl}
              albumImage={currentSong.albumImage}
              title={currentSong.title}
              songId={currentSong.songId}
              onPrevious={playPreviousSong}
              onNext={playNextSong}
            />
          )}


        </div>
      )}
    </>
  );
}

export default HomePage;
