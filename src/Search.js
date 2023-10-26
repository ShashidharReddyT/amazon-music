import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Search.css';
import SongCard from './SongCard';
import SearchNavbar from './SearchNavbar';
import Musicplayer from './Musicplayer';
import Searchlogo from '../src/Assets/Searchlogo.svg';

const Search = () => {
    const [searchInput, setSearchInput] = useState('');
    const [songResults, setSongResults] = useState([]);
    const [albumResults, setAlbumResults] = useState([]);
    const [artistResults, setArtistResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentSong, setCurrentSong] = useState(null);
    const [selectedMood, setSelectedMood] = useState(null);
    const [songIndex, setSongIndex] = useState(null);
    const [selectedSong, setSelectedSong] = useState(null);
    const [artistNames, setArtistNames] = useState([]);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);



    const moods = [
        { name: 'romantic', gradient: 'linear-gradient(90deg, rgb(21, 220, 231), rgb(231, 61, 24))' },
        { name: 'happy', gradient: 'linear-gradient(90deg, rgb(16, 16, 229), rgb(136, 235, 7))' },
        { name: 'sad', gradient: 'linear-gradient(90deg, rgb(101, 241, 190), rgb(82, 46, 20))' },
        { name: 'excited', gradient: 'linear-gradient(90deg, rgb(101, 106, 241), rgb(225, 107, 23))' },
    ];

    const navigate = useNavigate();

    const fetchMoodData = (mood) => {
        setIsLoading(true);
        fetch(`https://academics.newtonschool.co/api/v1/music/song?filter={"mood":"${mood}"}`, {
            headers: {
                'projectId': 'ybxi8hzrv99f',
            },
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.status === 'success') {
                    setSongResults(result.data);
                } else {
                    setSongResults([]);
                }
            })
            .catch((err) => {
                console.warn(err);
                setSongResults([]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleSearchBarClick = () => {
        navigate('/search');
    };



    const playSong = (song) => {
        if (currentSong !== song) {
            setCurrentSong(song);
            const index = artistNames.findIndex((s) => s._id === song._id);
            if (index !== -1) {
                setSongIndex(index);
            }
        }
    };
    const handleSongClick = (song, index) => {
        if (currentSong !== song) {
            setCurrentSong(song);
            setSongIndex(index);
        }
    };
    const [currentSongIndex, setCurrentSongIndex] = useState(null);


    const playNextSong = () => {
        if (currentSongIndex < songResults.length - 1) {
            const nextSongIndex = currentSongIndex + 1;
            playSong(songResults[nextSongIndex]);
            setCurrentSongIndex(nextSongIndex);
        }
    };

    // Function to play the previous song
    const playPreviousSong = () => {
        if (currentSongIndex > 0) {
            const previousSongIndex = currentSongIndex - 1;
            playSong(songResults[previousSongIndex]);
            setCurrentSongIndex(previousSongIndex);
        }
    };


    const handleSearch = () => {
        setIsLoading(true);

        fetch(`https://academics.newtonschool.co/api/v1/music/song?filter={"title":"${searchInput}"}`, {
            headers: {
                'projectId': 'ybxi8hzrv99f',
            },
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.status === 'success' && result.results !== 0) {
                    setSongResults(result.data);
                } else {
                    setSongResults([]);
                }
            })
            .catch((err) => {
                console.warn(err);
                setSongResults([]);
            });

        fetch(`https://academics.newtonschool.co/api/v1/music/album?filter={"title":"${searchInput}"}`, {
            headers: {
                'projectId': 'ybxi8hzrv99f',
            },
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.status === 'success' && result.results !== 0) {
                    setAlbumResults(result.data);
                } else {
                    setAlbumResults([]);
                }
            })
            .catch((err) => {
                console.warn(err);
                setAlbumResults([]);
            });

        fetch(`https://academics.newtonschool.co/api/v1/music/artist?filter={"name":"${searchInput}"}`, {
            headers: {
                'projectId': 'ybxi8hzrv99f',
            },
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.status === 'success' && result.results !== 0) {
                    setArtistResults(result.data);
                } else {
                    setArtistResults([]);
                }
            })
            .catch((err) => {
                console.warn(err);
                setArtistResults([]);
            });

        setIsLoading(false);
    };



    return (
        <div>
            <SearchNavbar />
            <div className={`search-barr ${isSearchExpanded ? 'expanded' : ''}`}>
                <input
                    type="text"
                    placeholder="Search..."
                    className="search-inputt"
                    value={searchInput}
                    onChange={(e) => {
                        setSearchInput(e.target.value);
                    }}
                    onClick={handleSearchBarClick}
                />

                <div className="search-button-container">
                    <button type="button" className="search-button" onClick={handleSearch}>
                        <img src={Searchlogo} alt="searchlogo" className="searchicon" />
                    </button>

                    {isSearchExpanded && (
                        <div className="expanded-search-icon">
                            <img src={Searchlogo} alt="searchlogo" className="searchicon" />
                        </div>
                    )}
                </div>
            </div>



            <h2 className='moodsheading'>Music By Genre</h2>

            <div className='mood-cards'>
                {moods.map((mood) => (
                    <div
                        key={mood.name}
                        className={`mood-card`}
                        style={{ background: mood.gradient }}
                        onClick={() => {
                            setSelectedMood(mood.name);
                            fetchMoodData(mood.name);
                        }}
                    >
                        {mood.name}
                    </div>
                ))}
            </div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className='search-results'>
                    {songResults.map((item, index) => (
                        <li className="artist-card">
                            <div className="buttons">
                                <button
                                    className={`play-button ${currentSong === item ? 'pause' : ''}`}
                                    onClick={() => playSong(item, index)}
                                >

                                    {currentSong === item ? '⏸️' : '▶'}
                                </button>
                                {/* <button className="dots-button" >
                                    ⋯
                                </button> */}
                            </div>
                            {item.thumbnail && (
                                <img src={item.thumbnail} alt={item.name} className="artist-image" />
                            )}

                            <h3 className="titlesss">{item.title} </h3>
                            <p className='artistsname'>{item.artist.map(artist => artist.name).join(' & ')}</p>
                        </li>
                    ))}

                    {albumResults.map((item) => (
                        <div key={item.id}>
                            <h3>Album: {item.title}</h3>
                        </div>
                    ))}

                    {artistResults.map((item) => (
                        <div key={item.id}>
                            <h3>Artist: {item.name}</h3>
                        </div>
                    ))}

                    {songResults.length === 0 && albumResults.length === 0 && artistResults.length === 0 && (
                        <>
                            <p className='searchhresults'>Please search to view results</p>
                            <p>Note : search with entire name</p>
                        </>


                    )}
                    {currentSong && (
                        <Musicplayer
                            audioUrl={currentSong.audio_url}
                            albumImage={currentSong.thumbnail}
                            title={currentSong.title}
                            songId={currentSong._id}
                            onPrevious={playPreviousSong}
                            onNext={playNextSong}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;
