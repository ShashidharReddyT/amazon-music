import React, { useEffect, useState } from "react";
import './HomePage.css';

import Loading from './Loading';

import Musicplayer from './Musicplayer';
import { Link } from 'react-router-dom';
import { useMusic } from './MusicProvider';
import { useUser } from "./UserProvider";

import { FaHeart } from 'react-icons/fa';

function FeaturedSongs({ romantic }) {

    const [loading, setLoading] = useState(true);
    const [featuredSongs, setFeaturedSongs] = useState([]);

    const { isUserLoggedIn, token } = useUser();
    const [visibleSongs, setVisibleSongs] = useState(100);

    const [selectedSong, setSelectedSong] = useState(null);
    const [songIndex, setSongIndex] = useState(null);
    const [page, setPage] = useState(1);
    useUser();
    const itemsPerPage = 10;

    const handleNextPage = () => {
        if (page < 2) {
            setPage(page + 1);

        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
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
    useEffect(() => {
        const fetchDataWithDelay = async () => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 300));
                const apiUrl = `https://academics.newtonschool.co/api/v1/music/song?filter={"mood":"romantic"}`;
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
    }, []);

    const playSong = (itemData, index) => {
        if (selectedSong === itemData) {
            setSelectedSong(null);

        } else {
            setSelectedSong(itemData);
            setSongIndex(index);
        }
    };

    const getPaginatedSongs = () => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return featuredSongs.slice(startIndex, endIndex);
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
    return (
        <div className="featured-list-container">
            <div className="merging">
                <h2 className="titles">Featured Songs</h2>
            </div>
            <ul className="featured-list-all">
                {getPaginatedSongs().map((itemData, index) => (
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
                        </div>
                        {itemData.thumbnail && (
                            <img src={itemData.thumbnail} alt={itemData.name} className="artist-image" />
                        )}
                        <h3 className="titlesss">{itemData.title} </h3>
                        <p className="artistsname">{itemData.artist.map(artist => artist.name).join(' & ')}</p>
                    </li>
                ))}
            </ul>
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={page === 1}>Previous</button>
                <span>{page}</span>
                <button onClick={handleNextPage} disabled={page * itemsPerPage >= featuredSongs.length}>Next</button>
            </div>
            {selectedSong && (
                <Musicplayer
                    audioUrl={selectedSong.audio_url}
                    albumImage={selectedSong.thumbnail}
                    title={selectedSong.title}
                    songId={selectedSong._id}
                    onPrevious={playPreviousSong}
                    onNext={playNextSong}
                />
            )}
        </div>
    )
}

export default FeaturedSongs;