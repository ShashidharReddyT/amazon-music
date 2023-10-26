import React, { useEffect, useState } from "react";
import { useUser } from "./UserProvider";
import MusicCard from "./MusicCard";
import { MusicProvider } from "./MusicProvider";
import MusicPlayer from "./Musicplayer";
import { useNavigate } from "react-router-dom";

function Library() {
  const [favSongList, setFavSongList] = useState([]);
  const { isUserLoggedIn, token } = useUser();
  const [selectedSong, setSelectedSong] = useState(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [artistNames, setArtistNames] = useState([]);

  const [songIndex, setSongIndex] = useState(null);

  const fetchAudioDuration = () => {
    const audioElement = document.getElementById("audioElement");

    if (audioElement) {
      setAudioDuration(audioElement.duration);
    }
  };

  async function fetchFavSongs() {
    var myHeaders = new Headers();
    myHeaders.append("projectId", "ybxi8hzrv99f");
    myHeaders.append("Authorization", `Bearer ${token}`);
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://academics.newtonschool.co/api/v1/music/favorites/like",
        requestOptions
      );
      const data = await response.json();

      console.log("Fetched favorite songs:", data);

      const listOfFavSongs = data.data.songs;
      setFavSongList(listOfFavSongs);
    } catch (error) {
      console.error("Error fetching favorite songs:", error);
    }
  }

  const removeFavSong = async (songId) => {
    var myHeaders = new Headers();
    myHeaders.append("projectId", "ybxi8hzrv99f");
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    const bodyObj = JSON.stringify({ songId });

    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: bodyObj,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://academics.newtonschool.co/api/v1/music/favorites/unlike",
        requestOptions
      );

      if (response.status === 200) {
        // Successfully removed the favorite
        const updatedFavSongs = favSongList.filter((song) => song._id !== songId);
        setFavSongList(updatedFavSongs);
      } else {
        console.error("Error removing favorite song:", response.statusText);
      }
    } catch (error) {
      console.error("Error removing favorite song:", error);
    }
  }

  const navigate = useNavigate();

  useEffect(() => {
    fetchFavSongs();

    const handlePageRefresh = (e) => {
      e.preventDefault();
      navigate("/");
    };

    window.addEventListener("beforeunload", handlePageRefresh);

    return () => {
      window.removeEventListener("beforeunload", handlePageRefresh);
    };
  }, [token, navigate]);

  const backgroundStyle = {
    backgroundImage:
      'url("https://indiesonics.com/Images/Articles/LibraryMusicAwards.png")',
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    color: "white",
    position: "relative",
    isolation: "isolate",
    left: "-50px",
    top: "-20px",
  };

  const openMusicPlayer = (music) => {
    console.log("Selected Music:", music); // Add this line
    setSelectedSong(music);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [currentSongIndex, setCurrentSongIndex] = useState(null);



  const playNextSong = () => {
    if (currentSongIndex < favSongList.length - 1) {
      const nextSongIndex = currentSongIndex + 1;
      setSelectedSong(favSongList[nextSongIndex]);
      setCurrentSongIndex(nextSongIndex);
    }
  };

  const playPreviousSong = () => {
    if (currentSongIndex > 0) {
      const previousSongIndex = currentSongIndex - 1;
      setSelectedSong(favSongList[previousSongIndex]);
      setCurrentSongIndex(previousSongIndex);
    }
  };


  return (
    <MusicProvider>
      <div style={backgroundStyle} className="albumdetailsmains">
        <img
          src={"https://indiesonics.com/Images/Articles/LibraryMusicAwards.png"}
          alt={"title"}
          className="imagefetch"
        />
        {isUserLoggedIn ? (
          <div>
            <h2 className="library-subheader">Your Favorite Songs:</h2>
            <ul className="song-list">
              {favSongList.map((music, index) => (

                <li key={music._id} className="song-list-item">
                  <div className="music-card-content" onClick={() => openMusicPlayer(music, index)}>
                    <span className="song-number">{index + 1}.</span>

                    <MusicCard
                      title={music.title}
                      image={music.thumbnail}
                      artists={music.artist}
                      id={music._id}
                      isFavSong={favSongList.some((song) => song._id === music._id)}
                    />
                    <p>Date of Release: {formatDate(music.dateOfRelease)}</p>
                    <div className="song-duration">
                      <p>Duration: {audioDuration.toFixed(2)} seconds</p>
                    </div>
                    <audio
                      id="audioElement"
                      src={music.audio_url}
                      onLoadedMetadata={fetchAudioDuration}
                    />
                    <button className="remove-favorite-button" onClick={() => removeFavSong(music._id)}>
                      Remove Favorite
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          // Displaying a message and a login redirection when user is not logged in
          <div className="login-message">
            <p className="please-login">Please login to view your favorite songs.</p>
            <button className="login-redirect-button" onClick={() => navigate("/login")}>
              Login
            </button>
          </div>
        )}

        {selectedSong && (
          <div className="selected-song">
            <MusicPlayer
              audioUrl={selectedSong.audio_url}
              albumImage={selectedSong.thumbnail}
              title={selectedSong.title}
              songId={selectedSong._id}
              onPrevious={playPreviousSong}
              onNext={playNextSong}
            />
            <button className="clear-selection" onClick={() => setSelectedSong(null)}>
              Clear Selection
            </button>
          </div>
        )}
      </div>
    </MusicProvider>
  );
}

export default Library;