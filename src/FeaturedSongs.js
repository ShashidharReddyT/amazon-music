import React, { useEffect, useState } from 'react';
import './HomePage.css';
import Loading from './Loading';
import Musicplayer from './Musicplayer';
import Lessthan from "../src/Assets/Lessthan.svg";
import Greaterthan from "../src/Assets/Greaterthan.svg";
import Modal from './Modal';

import { useUser } from "./UserProvider";
import { useMusic } from "./MusicProvider";

function FeaturedSongs({ mood }) {
    const [featuredSongs, setFeaturedSongs] = useState([]);
    const [visibleSongs, setVisibleSongs] = useState(12);
    const [loading, setLoading] = useState(true);
    const [currentSong, setCurrentSong] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [clickedCardPosition, setClickedCardPosition] = useState({ top: 0, left: 0 });



    const [isFavSong, setIsFavSong] = useState(false);
    const { token, isUserLoggedIn } = useUser();
    const itemsPerPage = 3;
    const totalSongs = 100;
    const [favoriteSongs, setFavoriteSongs] = useState([]);
    const selectedMusic = useMusic().selectedMusic;


    useEffect(() => {
        const fetchDataWithDelay = async () => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 300));
                const apiUrl = `https://academics.newtonschool.co/api/v1/music/song?filter={"mood":"${mood}"}`;
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

    const playSong = (song) => {
        if (currentSong === song) {
            setCurrentSong(null);
        } else {
            setCurrentSong(song);
        }
    };

    const openModal = (event, itemData) => {

        const cardPosition = event.target.getBoundingClientRect();
        const top = cardPosition.top + window.scrollY;
        const left = cardPosition.left + window.scrollX;
        setClickedCardPosition({ top, left });
        setModalIsOpen(true);
    };


    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div className="featured-list-container">
            <div className='merging'>
                <h2 className='titles'>Featured Songs</h2>
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
                        <li key={index} className="artist-card">
                            <div className="buttons">

                                <button className="heart-button">❤️</button>
                                <button
                                    className={`play-button ${currentSong === itemData ? 'pause' : ''}`}
                                    onClick={() => playSong(itemData)}
                                >
                                    {currentSong === itemData ? '⏸️' : '▶'}
                                </button>
                                {/* Update the "dots" button to open the modal */}
                                <button
                                    className="dots-button"
                                    onClick={(event) => openModal(event, itemData)}
                                >
                                    ⋯
                                </button>
                            </div>
                            {itemData.thumbnail && (
                                <img src={itemData.thumbnail} alt={itemData.name} className="artist-image" />
                            )}

                            <h3 className="titlesss">{itemData.title} </h3>
                            <p className='artistsname'>{itemData.artist.map(artist => artist.name).join(' & ')}</p>
                        </li>
                    ))}
                </ul>
            )}

            <Modal
                isOpen={modalIsOpen}
                onClose={closeModal}
                content={<div>Modal Content</div>}
                position={clickedCardPosition}
            />

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
