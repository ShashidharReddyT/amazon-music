import React, { useState, useRef, useEffect } from 'react';
import './Musicplayer.css';
import { FaHeart } from 'react-icons/fa';
import { useUser } from './UserProvider';
import Forwardbutton from '../src/Assets/Forwardbutton.svg';
import Backwardbutton from '../src/Assets/Backwardbutton.svg';
import LoginModal from './LoginModal';

const MusicPlayer = ({ audioUrl, albumImage, title, songId, onNext, onPrevious }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFavSong, setIsFavSong] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const audioRef = useRef(null);
    const { isUserLoggedIn, token } = useUser();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [seeking] = useState(false);


    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.addEventListener('loadedmetadata', () => {
                setDuration(audioRef.current.duration);
            });

            audioRef.current.addEventListener('timeupdate', () => {
                if (!seeking) {
                    setCurrentTime(audioRef.current.currentTime);
                }
            });

            audioRef.current.addEventListener('ended', () => {
                setIsPlaying(false);
                onNext();
            });
        }
    }, [audioRef, onNext]);

    const togglePlay = () => {
        if (!isUserLoggedIn) {
            setIsLoginModalOpen(true);
        } else {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const progress = (currentTime / duration) * 100 + '%';

    const handleProgressClick = (event) => {
        if (!audioRef.current) return;
        const bar = event.currentTarget;
        const clickPosition = event.nativeEvent.offsetX;
        const seekPercentage = clickPosition / bar.clientWidth;
        const newTime = seekPercentage * duration;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const addToFavorites = () => {
        console.log("Song ID:", songId);
        setIsFavSong((prevIsFav) => !prevIsFav);

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

    const closeLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    const handleVolumeChange = (event) => {
        const newVolume = event.target.value;
        audioRef.current.volume = newVolume;
        setVolume(newVolume);
    };

    return (
        <div>
            {isLoginModalOpen && <LoginModal closeModal={closeLoginModal} />}
            <div className="progress-bar" onClick={handleProgressClick}>
                <div className="progress" style={{ width: progress }}></div>
            </div>
            <div className="music-player">
                <div className="album-info">
                    <img src={albumImage} alt={title} className="album-image" />
                    <div className="album-title">{title}</div>
                </div>
                <div className="musicbuttons">
                    <div>
                        <img
                            src={Backwardbutton}
                            alt="backward"
                            className="backward"
                            onClick={onPrevious}
                        />
                    </div>
                    <div className="player-controls">
                        <button
                            className={`play-pause-button ${isPlaying ? 'pause' : 'play'}`}
                            onClick={togglePlay}
                        ></button>
                    </div>
                    <div>
                        <img
                            src={Forwardbutton}
                            alt="forward"
                            className="forward"
                            onClick={onNext}
                        />
                    </div>
                </div>
                <div className="volume-control">
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                    />
                </div>
                <audio ref={audioRef} src={audioUrl}></audio>
                <div className="time-info">
                    <span className="current-time">{formatTime(currentTime)}</span>
                    <span className="duration">{formatTime(duration)}</span>
                </div>
                <div className="favorite-button" onClick={addToFavorites}>
                    <div className='iconss' style={{ color: isFavSong ? 'yellow' : 'red' }}><FaHeart /> </div>
                </div>
            </div>
        </div>
    );
};

export default MusicPlayer;
