import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Musicplayer from './Musicplayer';
import './Albumdetailspage.css';

import { FaHeart } from 'react-icons/fa';
import { useUser } from './UserProvider';

function AlbumDetails() {
    const { state } = useLocation();
    const itemData = state && state.itemData;
    const [selectedSong, setSelectedSong] = useState(null);
    const [artistNames, setArtistNames] = useState([]);
    const [audioDuration, setAudioDuration] = useState(0);
    const [songIndex, setSongIndex] = useState(null);
    const [isFavSong, setIsFavSong] = useState(false);
    const { isUserLoggedIn, token } = useUser();


    const fetchAudioDuration = () => {
        const audioElement = document.getElementById('audioElement');
        if (audioElement) {
            setAudioDuration(audioElement.duration);
        }
    };

    useEffect(() => {
        const artistIdToNameMap = {};
        itemData.artists.forEach((artist) => {
            artistIdToNameMap[artist._id] = artist.name;
        });

        const songsWithArtistNames = itemData.songs.map((song) => ({
            ...song,
            artistNames: song.artist.map((artistId) => artistIdToNameMap[artistId]),
        }));

        setSelectedSong(songsWithArtistNames[0]);
        setSongIndex(0);

        setArtistNames(songsWithArtistNames);
    }, [itemData]);

    if (!itemData) {
        return <div>Item data not available.</div>;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSongClick = (song, index) => {
        console.log('Song clicked:', song);

        if (selectedSong === song) {
            setSelectedSong(null);
        } else {
            setSelectedSong(song);
            setSongIndex(index);
        }
    };

    const playNextSong = () => {
        if (songIndex !== null && songIndex < artistNames.length - 1) {
            const nextSongIndex = songIndex + 1;
            setSelectedSong(artistNames[nextSongIndex]);
            setSongIndex(nextSongIndex);
        }
    };

    const playPreviousSong = () => {
        if (songIndex !== null && songIndex > 0) {
            const previousSongIndex = songIndex - 1;
            setSelectedSong(artistNames[previousSongIndex]);
            setSongIndex(previousSongIndex);
        }
    };

    const backgroundStyle = {
        backgroundImage: `url(${itemData.image})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        color: 'white',
        position: 'relative',
        isolation: 'isolate',

        top: '-20px',
        width: '100%'
    };
    const addToFavorites = (songId) => {
        // Find the song in artistNames array by songId
        const updatedArtistNames = artistNames.map((song) => {
            if (song._id === songId) {
                // Toggle the isFavorite property
                return { ...song, isFavorite: !song.isFavorite };
            }
            return song;
        });

        setArtistNames(updatedArtistNames);

        // Now, you can make the API call to add or remove the song from favorites based on song.isFavorite.
        const projectId = "ybxi8hzrv99f";

        const myHeaders = new Headers();
        myHeaders.append("projectId", projectId);
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            songId: songId,
        });

        const requestOptions = {
            method: "PATCH",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        fetch(
            "https://academics.newtonschool.co/api/v1/music/favorites/like",
            requestOptions
        )
            .then((response) => response.text())
            .then((result) => {
                console.log("Result fav", result);
            })
            .catch((error) => console.log("Error", error));
    };

    return (
        <div style={backgroundStyle} className='albumdetailsmain'>
            <div className='albumdetailsmain'>
                <div className='albumimages'>
                    <img src={itemData.image} alt={itemData.title} className='imagefetch' />
                    <div className='titkes'>
                        <h3>{itemData.title}</h3>
                        <p>{itemData.description}</p>
                        <p>Songs: {artistNames.length}</p>
                    </div>
                </div>
                {artistNames.length > 0 ? (
                    <>
                        <h3>Songs:</h3>
                        <ul className="song-list">
                            {artistNames.map((song, index) => (
                                <li
                                    className={`song-list-item ${selectedSong === song ? 'selected' : ''}`}
                                    key={index}
                                    onClick={() => handleSongClick(song, index)}
                                >
                                    <span className="song-number">{index + 1}.</span>
                                    <div className="song-details">
                                        <img src={song.thumbnail} alt={song.title} className="song-thumbnail" />
                                        <div className="song-info">
                                            <p className='datee'>{formatDate(song.dateOfRelease)}</p>
                                            <p>{song.title}</p>
                                            {song.artistNames.length > 0 ? <p>{song.artistNames.join(', ')}</p> : <p>{'No artists'}</p>}
                                        </div>
                                    </div>
                                    <div className='song-detailss'>
                                        <p className='sonnng'>{song.title}</p>
                                    </div>
                                    <div className='song-duration'>
                                        <p>Duration: {audioDuration.toFixed(2)} seconds</p>
                                    </div>

                                    <audio id="audioElement" src={song.audio_url} onLoadedMetadata={fetchAudioDuration} />

                                    <div className="favorite-button" onClick={() => addToFavorites(song._id)}>
                                        <div className='iconss' style={{ color: song.isFavorite ? 'red' : 'white' }}><FaHeart /> </div>
                                    </div>

                                </li>
                            ))}
                        </ul>
                        {selectedSong && (
                            <Musicplayer
                                audioUrl={selectedSong.audio_url}
                                albumImage={itemData.image}
                                title={selectedSong.title}
                                songId={selectedSong._id}
                                onPrevious={playPreviousSong}
                                onNext={playNextSong}
                            />
                        )}
                    </>
                ) : (
                    <p>No songs available</p>
                )}
            </div>
        </div>
    );
}

export default AlbumDetails;
