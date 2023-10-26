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
    const [visibleSongs, setVisibleSongs] = useState(100);
    const itemsPerPage = 10; // Number of items to display per page
    const [currentPage, setCurrentPage] = useState(1);

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

    const handleNextPage = () => {
        if (currentPage < Math.ceil(featuredAlbums.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const getPaginatedAlbums = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return featuredAlbums.slice(startIndex, endIndex);
    };

    return (
        <div className="featured-album-container">
            <div className='merging'>
                <h2 className='titles'>Albums</h2>
            </div>
            {loading ? (
                <Loading />
            ) : (
                <div ref={scrollContainerRef} className="featured-list-all1">
                    {getPaginatedAlbums().map((album, index) => (
                        <li key={index} className="artist-card">
                            <div className="buttons">
                                <button className="playbutton" onClick={() => navigateToAlbumDetails(album)}>
                                    <img src={ForwardButtonLogo} alt="Forward" className="playbutton-image" />
                                </button>
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

            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
                <span>{currentPage}</span>
                <button onClick={handleNextPage} disabled={currentPage >= Math.ceil(featuredAlbums.length / itemsPerPage)}>Next</button>
            </div>

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
