import React, { useEffect, useState, useRef } from 'react';
import './HomePage.css';
import Loading from './Loading';
import Musicplayer from './Musicplayer';
import Lessthan from "../src/Assets/Lessthan.svg";
import Greaterthan from "../src/Assets/Greaterthan.svg";
import { useMusic } from './MusicProvider';
import { useUser } from "./UserProvider";
import { FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function FeaturedSongs({ mood }) {
    const [featuredSongs, setFeaturedSongs] = useState([]);
    const [visibleSongs, setVisibleSongs] = useState(12);
    const [loading, setLoading] = useState(true);
    const [currentSong, setCurrentSong] = useState(null);
    const [, setModalIsOpen] = useState(false);
    const [, setClickedSongPosition] = useState({ top: 0, left: 0 });
    const [, setCurrentSongForModal] = useState(null);

    const scrollContainerRef = useRef(null);
    const [showAllClicked, setShowAllClicked] = useState(false);

    const { setMusic } = useMusic();
    const totalSongs = 100;
    const { isUserLoggedIn, token } = useUser();
    const [selectedSong, setSelectedSong] = useState(null);
    const [songIndex, setSongIndex] = useState(null);

    useEffect(() => {
        const fetchDataWithDelay = async () => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 400));

                const apiUrl = `https://academics.newtonschool.co/api/v1/music/song?sort={"release":1}`;
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

    const handleScroll = (scrollDirection) => {
        const scrollContainer = scrollContainerRef.current;

        if (scrollContainer) {
            const currentScrollLeft = scrollContainer.scrollLeft;
            const scrollDistance = scrollDirection === 'left' ? -600 : 600;
            const targetScrollLeft = currentScrollLeft + scrollDistance;
            scrollContainer.scrollTo({
                left: targetScrollLeft,
                behavior: "smooth",
            });
        }
    };

    const playSong = (itemData, index) => {
        if (selectedSong === itemData) {
            setSelectedSong(null);
        } else {
            setSelectedSong(itemData);
            setSongIndex(index);

        }
    };

    const playNextSong = () => {
        if (songIndex !== null && songIndex < featuredSongs.length - 1) {
            const nextSongIndex = songIndex + 1;
            setSelectedSong(featuredSongs[nextSongIndex]);
            setSongIndex(nextSongIndex);
        }
    };

    const playPreviousSong = () => {
        if (songIndex !== null && songIndex > 0) {
            const previousSongIndex = songIndex - 1;
            setSelectedSong(featuredSongs[previousSongIndex]);
            setSongIndex(previousSongIndex);
        }
    };

    const openModal = (event, song) => {
        const songPosition = event.target.getBoundingClientRect();
        const top = songPosition.top + window.scrollY;
        const left = songPosition.left + window.scrollX;
        setClickedSongPosition({ top, left });
        setCurrentSongForModal(song);
        setModalIsOpen(true);
    };
    const showAll = () => {
        setVisibleSongs(totalSongs);
        setShowAllClicked(true);
    };

    const showLess = () => {
        setVisibleSongs(12);
        setShowAllClicked(false);
    };
    const addToFavorites = (songId) => {
        // Find the song in artistNames array by songId
        const updatedArtistNames = featuredSongs.map((itemData) => {
            if (itemData._id === songId) {
                // Toggle the isFavorite property
                return { ...itemData, isFavorite: !itemData.isFavorite };
            }
            return itemData;
        });

        setFeaturedSongs(updatedArtistNames);

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
        <div className="featured-list-container">
            <div className='merging'>
                <h2 className='titles'>Featured this week</h2>
                <div className="button-container">
                    <button className="show-less-button" onClick={() => handleScroll('left')}>
                        <img src={Lessthan} alt='less' />
                    </button>
                    <button className="load-more-button" onClick={() => handleScroll('right')}>
                        <img src={Greaterthan} alt='great' />
                    </button>
                    <Link to='/seeallsongs2' className='show-all-button'>SEE ALL</Link>
                </div>
            </div>
            {loading ? (
                <Loading />
            ) : (
                <div ref={scrollContainerRef} className="featured-list">
                    {featuredSongs.slice(0, visibleSongs).map((itemData, index) => (
                        <li key={index} className="artist-card">
                            <div className="buttons">
                                <div className="favorite-button" onClick={() => addToFavorites(itemData._id)}>
                                    <div className='iconss' style={{ color: itemData.isFavorite ? 'red' : 'white' }}><FaHeart /> </div>
                                </div>
                                <button
                                    className={`play-button ${selectedSong === itemData ? 'pause' : ''}`}
                                    onClick={() => playSong(itemData, index)}
                                >
                                    {selectedSong === itemData ? '⏸️' : '▶'}
                                </button>
                                {/* <button
                                    className="dots-button"
                                    onClick={(event) => openModal(event, itemData)}
                                >
                                    ⋯
                                </button> */}
                            </div>
                            {itemData.thumbnail && (
                                <img src={itemData.thumbnail} alt={itemData.name} className="artist-image" />
                            )}

                            <h3 className="titlesss">{itemData.title} </h3>
                            <p className='artistsname'>{itemData.artist.map(artist => artist.name).join(' & ')}</p>
                        </li>
                    ))}
                </div>
            )}

            {
                selectedSong && (
                    <Musicplayer
                        audioUrl={selectedSong.audio_url}
                        albumImage={selectedSong.thumbnail}
                        title={selectedSong.title}
                        songId={selectedSong._id}
                        onPrevious={playPreviousSong}
                        onNext={playNextSong}
                    />
                )
            }

        </div>
    );
}

export default FeaturedSongs;
