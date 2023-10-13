import React from 'react';
import PropTypes from 'prop-types';
import './MusicCard.css';

function MusicCard({ song, index, selectedSong, onClick, audioDuration, formatDate, fetchAudioDuration }) {
    return (
        <li
            className={`song-list-item ${selectedSong === song ? 'selected' : ''}`}
            onClick={() => onClick(song)}
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
        </li>
    );
}

MusicCard.propTypes = {
    song: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    selectedSong: PropTypes.object,
    onClick: PropTypes.func.isRequired,
    audioDuration: PropTypes.number.isRequired,
    formatDate: PropTypes.func.isRequired,
    fetchAudioDuration: PropTypes.func.isRequired,
};

export default MusicCard;
