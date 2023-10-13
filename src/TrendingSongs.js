import React, { useEffect, useState } from 'react';
import './HomePage.css';
import Loading from './Loading';
import Musicplayer from './Musicplayer';
import Lessthan from "../src/Assets/Lessthan.svg";
import Greaterthan from "../src/Assets/Greaterthan.svg";
import SongCard from './SongCard';
import Modal from './Modal'; // Import the Modal component

function FeaturedSongs({ mood }) {
    const [featuredSongs, setFeaturedSongs] = useState([]);
    const [visibleSongs, setVisibleSongs] = useState(12);
    const [loading, setLoading] = useState(true);
    const [currentSong, setCurrentSong] = useState(null);

    const itemsPerPage = 3;
    const totalSongs = 100;

    // State for modal
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [clickedSongPosition, setClickedSongPosition] = useState({ top: 0, left: 0 });
    const [currentSongForModal, setCurrentSongForModal] = useState(null);

    useEffect(() => {
        const fetchDataWithDelay = async () => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 400));
                const apiUrl = `https://academics.newtonschool.co/api/v1/music/song`;
                const response = await fetch(apiUrl, {
                    headers: {
                        'projectId': 'ybxi8hzrv99f',
                    },
                });

                const responseData = await response.json();

                if (responseData.status === 'success') {
                    const data = responseData.data;
                    if (Array.isArray(data)) {
                        setFeaturedSongs(data);
                        console.log(data);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDataWithDelay();
    }, [mood]);

    const loadMore = () => {
        setVisibleSongs(Math.min(visibleSongs + itemsPerPage, totalSongs));
    };

    const showAll = () => {
        setVisibleSongs(totalSongs);
    };

    const showLess = () => {
        setVisibleSongs(12);
    };

    // Function to toggle play/pause of a song
    const playSong = (song) => {
        if (currentSong === song) {
            setCurrentSong(null);
        } else {
            setCurrentSong(song);
        }
    };

    // Function to open the modal when a song card is clicked
    const openModal = (event, song) => {
        // Get the position of the clicked song card
        const songPosition = event.target.getBoundingClientRect();

        // Calculate the position relative to the viewport
        const top = songPosition.top + window.scrollY;
        const left = songPosition.left + window.scrollX;

        // Set the position and open the modal
        setClickedSongPosition({ top, left });
        setCurrentSongForModal(song);
        setModalIsOpen(true);
    };

    return (
        <div className="featured-list-container">
            <div className='merging'>
                <h2 className='titles'>Trending Songs</h2>
                <div className="button-container">
                    {visibleSongs > 0 && (
                        <button onClick={showLess} className="show-less-button">
                            <img src={Lessthan} alt='less' />
                        </button>
                    )}
                    {visibleSongs < totalSongs && (
                        <button onClick={loadMore} className="load-more-button">
                            <img src={Greaterthan} alt='greater' />
                        </button>
                    )}
                    {visibleSongs < totalSongs && (
                        <button onClick={showAll} className="show-all-button">
                            SEE{'\u00A0'}ALL
                        </button>
                    )}
                </div>
            </div>
            {loading ? (
                <Loading />
            ) : (
                <ul className="featured-list">
                    {featuredSongs.slice(0, visibleSongs).map((itemData, index) => (
                        <SongCard
                            key={index}
                            songData={itemData}
                            isPlaying={currentSong === itemData}
                            onPlay={playSong}
                            onClick={(event) => openModal(event, itemData)}
                        />
                    ))}
                </ul>
            )}

            {currentSongForModal && (
                <Modal
                    isOpen={modalIsOpen}
                    onClose={() => {
                        setModalIsOpen(false);
                        setCurrentSongForModal(null);
                    }}
                    content={<div>Modal Content</div>}
                    position={clickedSongPosition}
                />
            )}

            {currentSong && (
                <Musicplayer
                    audioUrl={currentSong.audio_url}
                    albumImage={currentSong.thumbnail}
                    title={currentSong.title}
                    songId={currentSong._id}
                />
            )}
        </div>
    );
}

export default FeaturedSongs;
