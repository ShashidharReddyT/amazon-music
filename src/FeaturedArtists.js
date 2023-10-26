import React, { useEffect, useState, useRef } from 'react';
import './HomePage.css';
import { useNavigate, Link } from 'react-router-dom';
import Loading from './Loading';
import Lessthan from "../src/Assets/Lessthan.svg";
import Greaterthan from "../src/Assets/Greaterthan.svg";
import Modal from './Modal';
import { IoIosArrowForward } from "react-icons/io";
import ForwardButtonLogo from '../src/Assets/ForwardButtonLogo.svg';


function FeaturedArtists() {
    const [featuredArtists, setFeaturedArtists] = useState([]);
    const [visibleArtists, setVisibleArtists] = useState(12);
    const [loading, setLoading] = useState(true);
    const [currentArtist, setCurrentArtist] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);

    const [showAllClicked, setShowAllClicked] = useState(false);
    const totalSongs = 100;



    const navigateToAlbumDetails = (artist) => {
        navigate(`/artist/${artist._id}`, {
            state: { itemData: artist },
        });
    };


    useEffect(() => {
        const fetchDataWithDelay = async () => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 800));

                const response = await fetch('https://academics.newtonschool.co/api/v1/music/artist?limit=100', {
                    headers: {
                        'projectId': 'ybxi8hzrv99f',
                    },
                });

                const responseData = await response.json();

                if (responseData.status === 'success') {
                    const data = responseData.data;
                    if (Array.isArray(data)) {
                        setFeaturedArtists(data);
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
    }, []);

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

    const openModal = (artist) => {
        setCurrentArtist(artist);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setCurrentArtist(null);
        setModalIsOpen(false);
    };
    const showAll = () => {
        setVisibleArtists(totalSongs);
        setShowAllClicked(true);
    };

    const showLess = () => {
        setVisibleArtists(12);
        setShowAllClicked(false);
    };


    return (
        <div className="featured-list-container">
            <div className='merging'>
                <h2 className='titles'>Artists</h2>
                <div className="button-container">
                    <button className="show-less-button" onClick={() => handleScroll('left')}>
                        <img src={Lessthan} alt='less' />
                    </button>
                    <button className="load-more-button" onClick={() => handleScroll('right')}>
                        <img src={Greaterthan} alt='great' />
                    </button>

                    <Link to='/seeallsongs4' className='show-all-button'>SEE ALL</Link>

                </div>
            </div>
            {loading ? (
                <Loading />
            ) : (
                <div ref={scrollContainerRef} className="featured-list1">
                    {featuredArtists.slice(0, visibleArtists).map((artist, index) => (
                        <li key={index} className="artist-card">
                            <div className="buttons">
                                {/* <button className="heart-button">❤️</button> */}
                                <button className="playbutton" onClick={() => navigateToAlbumDetails(artist)}>
                                    <img src={ForwardButtonLogo} alt="Forward" className="playbutton-image" />
                                </button>                                {/* <button className="dots-button" onClick={() => openModal(artist)}>⋯</button> */}
                            </div>
                            {artist.image && (
                                <img src={artist.image} alt={artist.name} className="artist-image" />
                            )}
                            {artist.thumbnail && (
                                <img src={artist.thumbnail} alt={artist.name} className="artist-image" />
                            )}
                            <h3 className="titlesss">{artist.name}</h3>
                            {artist && artist.languages && (
                                <h3 className='artistsname'>{artist.languages.join(', ')}</h3>
                            )}
                        </li>
                    ))}
                </div>
            )}

            <Modal
                isOpen={modalIsOpen}
                onClose={closeModal}
                content={
                    <div>
                        {currentArtist && (
                            <div>
                                <h2>{currentArtist.name}</h2>
                                {currentArtist.description && (
                                    <p>{currentArtist.description}</p>
                                )}
                            </div>
                        )}
                    </div>
                }
            />
        </div>
    );
}

export default FeaturedArtists;
