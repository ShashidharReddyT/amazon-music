import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Musicplayer from './Musicplayer';
import './Albumdetailspage.css';

function AlbumDetails() {
    const { state } = useLocation();
    const itemData = state && state.itemData;
    const initialSelectedSong = null;
    const [selectedSong, setSelectedSong] = useState(initialSelectedSong);
    const [artistNames, setArtistNames] = useState([]);
    const [isMusicPlayerOpen, setIsMusicPlayerOpen] = useState(false);
    const [audioDuration, setAudioDuration] = useState(0);

    const fetchAudioDuration = () => {
        const audioElement = document.getElementById('audioElement');
        if (audioElement) {
            setAudioDuration(audioElement.duration);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!itemData || !itemData.songs || itemData.songs.length === 0) {
                    return;
                }
                const songIds = itemData.songs;
                const songPromises = songIds.map(async (songId) => {
                    const response = await fetch(`https://academics.newtonschool.co/api/v1/music/song/${songId}`, {
                        headers: {
                            'projectId': 'ybxi8hzrv99f',
                        },
                    });

                    if (!response.ok) {
                        throw new Error(`Error fetching song with ID ${songId}`);
                    }

                    const songData = await response.json();
                    return songData.data;
                });

                const songDetailsData = await Promise.all(songPromises);
                setArtistNames(songDetailsData);
                console.log('Fetched song details:', songDetailsData);
            } catch (error) {
                console.error('Error fetching song details:', error);
            }
        };

        if (itemData) {
            fetchData();
        }
    }, [itemData]);

    const handleSongClick = (song) => {
        setSelectedSong(song);
        setIsMusicPlayerOpen(true);
    };

    const handleCloseMusicPlayer = () => {
        setIsMusicPlayerOpen(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div>
            <h2>Artists Details</h2>
            <img src={itemData.image} alt={itemData.title} className='imagefetch' />
            <h3>Title: {itemData.title}</h3>
            <p>Description: {itemData.description}</p>
            {artistNames.length > 0 ? (
                <>
                    <h3>Songs:</h3>
                    <ul className="song-list">
                        {artistNames.map((song, index) => (
                            <li
                                className={`song-list-item ${selectedSong === song ? 'selected' : ''}`}
                                key={index}
                                onClick={() => handleSongClick(song)}
                            >
                                <span className="song-number">{index + 1}.</span>
                                <div className="song-details">
                                    <img src={song.thumbnail} alt={song.title} className="song-thumbnail" />
                                    <div className="song-info">
                                        <p className='datee'>{formatDate(song.dateOfRelease)}</p>
                                        <p>{song.title}</p>
                                        <p>{song.artist.map(artist => artist.name).join(', ')}</p>
                                    </div>
                                </div>
                                <div className='song-detailss'>
                                    <p className='sonnng'>{song.title}</p>
                                </div>
                                <div className='song-duration'>
                                    <p>Duration: {audioDuration.toFixed(2)} seconds</p>
                                </div>
                                <audio id="audioElement" src={song.audio_url} onLoadedMetadata={fetchAudioDuration} />
                            </li>
                        ))}
                    </ul>
                    {isMusicPlayerOpen && selectedSong && (
                        <div className="music-player">
                            <button onClick={handleCloseMusicPlayer}>Close Music Player</button>
                            <Musicplayer
                                audioUrl={selectedSong.audio_url}
                                albumImage={itemData.image}
                                title={selectedSong.title}
                                songId={selectedSong._id}
                            />
                        </div>
                    )}
                </>
            ) : (
                <p>No songs available</p>
            )}
        </div>
    );
}
export default AlbumDetails;
