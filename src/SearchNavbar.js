import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import { useUser } from "./UserProvider";
import Amazonmusic from '../src/Assets/Amazon-music.png';
import HomeLogo from '../src/Assets/HomeLogo.svg';
import Podcasts from '../src/Assets/Podcasts.svg';
import Library from '../src/Assets/Library.svg';
import userlogo from '../src/Assets/UserLogo.svg';
import Searchlogo from '../src/Assets/Searchlogo.svg';
import Librarydropdownlogo from '../src/Assets/Librarydropdownlogo.svg';

const Navbar = React.memo(() => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isUserLoggedIn, token } = useUser();
    const [search] = useState('');
    const navigate = useNavigate();
    const menuContainerRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const closeMenuOnOutsideClick = (e) => {
            if (menuContainerRef.current && !menuContainerRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('click', closeMenuOnOutsideClick);

        return () => {
            document.removeEventListener('click', closeMenuOnOutsideClick);
        };
    }, []);


    const toggleUserMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const addLocalStorage = () => {
        const history = JSON.parse(localStorage.getItem('history')) || [];
        if (!history.includes(search.trim())) {
            history.push(search.trim());
        }
        localStorage.setItem('history', JSON.stringify(history));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim() === '') {
            return;
        }
        addLocalStorage();
        navigate(`/search/${search.trim()}`);
    };



    return (
        <header>
            <nav className="navbar1">
                <div className="logo">
                    <Link to="/">
                        <img src={Amazonmusic} alt="Amazonmusic" className="logo" />
                    </Link>
                </div>

                <ul className="nav-linksdiv">
                    <div className="nav-links">
                        <Link
                            to="/"
                            className={`hover-home-button ${location.pathname === '/' ? 'active' : ''}`}
                        >
                            <img src={HomeLogo} alt="homelogo" className="homelogo" />
                            HOME
                        </Link>
                    </div>

                    <div className="nav-links">
                        <Link
                            to="/podcasts"
                            className={`hover-home-button ${location.pathname === '/podcasts' ? 'active' : ''}`}
                        >
                            <img src={Podcasts} alt="podcasts" />
                            PODCASTS
                        </Link>
                    </div>

                    <div className="nav-links">
                        <Link
                            to="/library"
                            className={`hover-home-button ${location.pathname === '/library' ? 'active' : ''}`}
                        >
                            <img src={Library} alt="library" />
                            LIBRARY{'\u00A0'}
                            <img src={Librarydropdownlogo} alt="librarydropdown" className="dropdowns" />
                        </Link>
                        <ul className="dropdown-content">
                            <li>
                                <p>Music</p>
                            </li>
                            <li>
                                <p>Podcasts</p>
                            </li>
                        </ul>
                    </div>
                </ul>


                {!isUserLoggedIn ? (
                    <div className="menu-container" ref={menuContainerRef}>
                        <button className="user-icon" onClick={toggleUserMenu}>
                            <img src={userlogo} alt="UserIcon" />
                        </button>

                        {menuOpen && (
                            <div className="menu">
                                <Link to="/signup">Signup</Link>
                                <Link to="/login">Login</Link>
                                <Link to="/subscribe">Subscriptions</Link>
                                {/* <Link to="userprofile">User Profile</Link> */}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="menu-container" ref={menuContainerRef}>
                        <button className="user-icon" onClick={toggleUserMenu}>
                            <img src={userlogo} alt="UserIcon" />
                        </button>
                        {menuOpen && (
                            <div className="menu">
                                <Link to="/subscribe">Subscriptions</Link>
                                <Link to="/userprofile">Profile</Link>
                                <Link to="/signout">Sign Out</Link>
                            </div>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
});

export default Navbar;
