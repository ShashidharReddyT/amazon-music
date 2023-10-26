import React, { useState } from 'react';
import Musicplayer from './Musicplayer';

function SongCard({ songData }) {
    const [currentSong, setCurrentSong] = useState(null);

    const playSong = (song) => {
        if (currentSong === song) {
            // If the same song is clicked, close the player
            setCurrentSong(null);
        } else {
            // If a new song is clicked, close the previous player and open the new one
            setCurrentSong(song);
        }
    };

    return (
        <li className="artist-card">
            <div className="buttons">
                <button className="heart-button">
                    ❤️
                </button>
                <button
                    className={`play-button ${currentSong === songData ? 'pause' : ''}`}
                    onClick={() => playSong(songData)}
                >
                    {currentSong === songData ? '⏸️' : '▶'}
                </button>
                <button className="dots-button">
                    ⋯
                </button>
            </div>
            {songData.thumbnail && (
                <img src={songData.thumbnail} alt={songData.title} className="artist-image" />
            )}
            <h3 className="titlesss">{songData.title}</h3>
            <p className="artistsname">{songData.artist.map((artist) => artist.name).join(' & ')}</p>

            {currentSong === songData && (
                <Musicplayer
                    audioUrl={songData.audio_url}
                    albumImage={songData.thumbnail}
                    title={songData.title}
                    songId={songData._id}
                />
            )}
        </li>
    );
}

export default SongCard;
