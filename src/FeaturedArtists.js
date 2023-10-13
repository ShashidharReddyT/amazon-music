import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import Lessthan from "../src/Assets/Lessthan.svg";
import Greaterthan from "../src/Assets/Greaterthan.svg";
import Modal from './Modal';
import { IoIosArrowForward } from "react-icons/io";

function FeaturedArtists() {
    const [featuredArtists, setFeaturedArtists] = useState([]);
    const [visibleArtists, setVisibleArtists] = useState(12);
    const [loading, setLoading] = useState(true);
    const [currentArtist, setCurrentArtist] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const navigate = useNavigate();

    const navigateToAlbumDetails = (artist) => {
        navigate(`/artist/${artist._id}`, {
            state: { itemData: artist },
        });
    };

    const itemsPerPage = 3;
    const totalArtists = 100;

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

    const loadMore = () => {
        setVisibleArtists(Math.min(visibleArtists + itemsPerPage, totalArtists));
    };

    const showAll = () => {
        setVisibleArtists(totalArtists);
    };

    const showLess = () => {
        setVisibleArtists(10);
    };

    const openModal = (artist) => {
        setCurrentArtist(artist);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setCurrentArtist(null);
        setModalIsOpen(false);
    };

    return (
        <div className="featured-list-container">
            <div className='merging'>
                <h2 className='titles'>Artists</h2>
                <div className="button-container">
                    {visibleArtists > 0 && (
                        <button onClick={showLess} className="show-less-button">
                            <img src={Lessthan} alt='less' />
                        </button>
                    )}
                    {visibleArtists < totalArtists && (
                        <button onClick={loadMore} className="load-more-button">
                            <img src={Greaterthan} alt='greater' />
                        </button>
                    )}
                    {visibleArtists < totalArtists && (
                        <button onClick={showAll} className="show-all-button">
                            SEE{'\u00A0'}ALL
                        </button>
                    )}
                </div>
            </div>
            {loading ? (
                <Loading />
            ) : (
                <ul className="featured-list1">
                    {featuredArtists.slice(0, visibleArtists).map((artist, index) => (
                        <li key={index} className="artist-card">
                            <div className="buttons">
                                <button className="heart-button">❤️</button>
                                <button className="play-button" onClick={() => navigateToAlbumDetails(artist)}><IoIosArrowForward /></button>
                                <button className="dots-button" onClick={() => openModal(artist)}>⋯</button>
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
                </ul>
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
