import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory
import './Search.css';
import SongCard from './SongCard';

const Search = () => {
    const [searchInput, setSearchInput] = useState('');
    const [songResults, setSongResults] = useState([]);
    const [albumResults, setAlbumResults] = useState([]);
    const [artistResults, setArtistResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    const [selectedMood, setSelectedMood] = useState(null);

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
            <div className='search-barr'>
                <input
                    type="text"
                    placeholder="Search for music..."
                    value={searchInput}
                    onChange={(e) => {
                        setSearchInput(e.target.value);
                    }}
                    onClick={handleSearchBarClick}
                    className='search-bar1'
                />

                <button onClick={handleSearch}>Search</button>
            </div>

            <h2 className='moodsheading'>Search Music</h2>

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
                    {songResults.map((item) => (
                        <SongCard key={item.id} songData={item} currentSong={item} setCurrentSong={item} />
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
                        <p>No Results Found</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;
