import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import ForwardButtonLogo from '../src/Assets/ForwardButtonLogo.svg';
function FeaturedArtists() {
    const [featuredArtists, setFeaturedArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const artistsPerPage = 10;
    const navigate = useNavigate();

    const navigateToAlbumDetails = (artist) => {
        navigate(`/artist/${artist._id}`, {
            state: { itemData: artist },
        });
    };

    const handleNextPage = () => {
        if (page < 10) { // Assuming there are 10 pages with 10 songs each
            setPage(page + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://academics.newtonschool.co/api/v1/music/artist?page=${page}&limit=${artistsPerPage}`, {
                    headers: {
                        'projectId': 'ybxi8hzrv99f',
                    },
                });

                const responseData = await response.json();

                if (responseData.status === 'success') {
                    const data = responseData.data;
                    if (Array.isArray(data)) {
                        setFeaturedArtists(data);
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [page]);

    return (
        <div className="featured-list-container">
            <div className='merging'>
                <h2 className='titles'>Artists</h2>
            </div>
            {loading ? (
                <Loading />
            ) : (
                <div className="featured-list-all1">
                    {featuredArtists.map((artist, index) => (
                        <li key={index} className="artist-card">
                            <div className="buttons">
                                <button className="playbutton" onClick={() => navigateToAlbumDetails(artist)}>
                                    <img src={ForwardButtonLogo} alt="Forward" className="playbutton-image" />
                                </button>
                            </div>
                            {artist.image && (
                                <img src={artist.image} alt={artist.name} className="artist-image" />
                            )}
                            <h3 className="titlesss">{artist.name}</h3>
                            {artist.languages && (
                                <h3 className='artistsname'>{artist.languages.join(', ')}</h3>
                            )}
                        </li>
                    ))}
                </div>
            )}
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={page === 1}>Previous</button>
                <span>{page}</span>
                <button onClick={handleNextPage} disabled={page === 10}>Next</button>
            </div>
        </div>
    );
}

export default FeaturedArtists;
