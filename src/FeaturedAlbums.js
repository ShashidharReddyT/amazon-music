import React, { useEffect, useState, useRef } from 'react';
import './HomePage.css';
import { useNavigate, Link } from 'react-router-dom';
import Loading from './Loading';
import Lessthan from "../src/Assets/Lessthan.svg";
import Greaterthan from "../src/Assets/Greaterthan.svg";
import Modal from './Modal';
import { IoIosArrowForward } from "react-icons/io";
import ForwardButtonLogo from '../src/Assets/ForwardButtonLogo.svg';

function FeaturedAlbums() {
    const [featuredAlbums, setFeaturedAlbums] = useState([]);
    const [visibleAlbums, setVisibleAlbums] = useState(12);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [clickedCardPosition, setClickedCardPosition] = useState({ top: 0, left: 0 });
    const [currentAlbum, setCurrentAlbum] = useState(null);
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);
    const [visibleSongs, setVisibleSongs] = useState(12);
    const [showAllClicked, setShowAllClicked] = useState(false);

    const totalSongs = 100;

    useEffect(() => {
        const fetchDataWithDelay = async () => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 200));
                const response = await fetch('https://academics.newtonschool.co/api/v1/music/album?limit=100', {
                    headers: {
                        'projectId': 'ybxi8hzrv99f',
                    },
                });

                const responseData = await response.json();
                if (responseData.status === 'success') {
                    const data = responseData.data;
                    if (Array.isArray(data)) {
                        setFeaturedAlbums(data);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDataWithDelay();
    }, []);
    const navigateToAlbumDetails = (album) => {
        navigate(`/album/${album._id}`, {
            state: { itemData: album },
        });
    };

    const openModal = (event, album) => {
        const cardPosition = event.target.getBoundingClientRect();
        const top = cardPosition.top + window.scrollY;
        const left = cardPosition.left + window.scrollX;
        setClickedCardPosition({ top, left });
        setModalIsOpen(true);
        setCurrentAlbum(album);
    };

    const showAll = () => {
        setVisibleSongs(totalSongs);
        setShowAllClicked(true);
    };

    const showLess = () => {
        setVisibleSongs(12);
        setShowAllClicked(false);
    };

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

    return (
        <div className="featured-album-container">
            <div className='merging'>
                <h2 className='titles'>Albums</h2>
                <div className="button-container">
                    <button className="show-less-button" onClick={() => handleScroll('left')}>
                        <img src={Lessthan} alt='less' />
                    </button>
                    <button className="load-more-button" onClick={() => handleScroll('right')}>
                        <img src={Greaterthan} alt='great' />
                    </button>
                    <Link to='/seeallsongs3' className='show-all-button' >SEE ALL</Link>


                </div>
            </div>
            {loading ? (
                <Loading />
            ) : (
                <div ref={scrollContainerRef} className="featured-list">
                    {featuredAlbums.slice(0, visibleSongs).map((album, index) => (
                        <li key={index} className="artist-card">
                            <div className="buttons">
                                {/* <button className="heart-button">❤️</button> */}
                                <button className="playbutton" onClick={() => navigateToAlbumDetails(album)}>
                                    <img src={ForwardButtonLogo} alt="Forward" className="playbutton-image" />
                                </button>
                                {/* <button className="dots-button" onClick={(event) => openModal(event, album)}>⋯</button> */}
                            </div>
                            {album.image && (
                                <img src={album.image} alt={album.name} className="artist-image" />
                            )}
                            {album.thumbnail && (
                                <img src={album.thumbnail} alt={album.name} className="artist-image" />
                            )}
                            <h3 className="artist-name">{album.name}</h3>
                            <h3 className="titless">{album.title} </h3>
                            <p className='artistsname'>{album.artists.map(artist => artist.name).join(' & ')}</p>
                        </li>
                    ))}
                </div>
            )}

            {currentAlbum && (
                <Modal
                    isOpen={modalIsOpen}
                    onClose={() => {
                        setModalIsOpen(false);
                        setCurrentAlbum(null);
                    }}
                    content={<div>Modal Content</div>}
                    position={clickedCardPosition}
                    album={currentAlbum}
                />
            )}
        </div>
    );
}

export default FeaturedAlbums;