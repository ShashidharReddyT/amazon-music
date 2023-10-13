import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import Lessthan from "../src/Assets/Lessthan.svg";
import Greaterthan from "../src/Assets/Greaterthan.svg";
import Modal from './Modal';
import { IoIosArrowForward } from "react-icons/io";

function FeaturedAlbums() {
    const [featuredAlbums, setFeaturedAlbums] = useState([]);
    const [visibleAlbums, setVisibleAlbums] = useState(12);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 3;
    const totalAlbums = 100;
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [clickedCardPosition, setClickedCardPosition] = useState({ top: 0, left: 0 });
    const [currentAlbum, setCurrentAlbum] = useState(null);

    const navigate = useNavigate();

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

    useEffect(() => {
        const fetchDataWithDelay = async () => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 100));
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
        setVisibleAlbums(Math.min(visibleAlbums + itemsPerPage, totalAlbums));
    };

    const showAll = () => {
        setVisibleAlbums(totalAlbums);
    };

    const showLess = () => {
        setVisibleAlbums(12);
    };

    return (
        <div className="featured-list-container">
            <div className='merging'>
                <h2 className='titles'>Albums</h2>
                <div className="button-container">
                    {visibleAlbums > 0 && (
                        <button onClick={showLess} className="show-less-button">
                            <img src={Lessthan} alt='less' />
                        </button>
                    )}
                    {visibleAlbums < totalAlbums && (
                        <button onClick={loadMore} className="load-more-button">
                            <img src={Greaterthan} alt='great' />
                        </button>
                    )}
                    {visibleAlbums < totalAlbums && (
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
                    {featuredAlbums.slice(0, visibleAlbums).map((album, index) => (
                        <li key={index} className="artist-card">
                            <div className="buttons">
                                <button className="heart-button">❤️</button>
                                <button className="play-button" onClick={() => navigateToAlbumDetails(album)}><IoIosArrowForward /></button>
                                <button className="dots-button" onClick={(event) => openModal(event, album)}>⋯</button>
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
                </ul>
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
