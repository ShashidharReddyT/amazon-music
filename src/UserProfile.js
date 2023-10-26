import React, { useState, useEffect } from 'react';
import { useUser } from './UserProvider';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
    const { user, signOutContext } = useUser();
    const username = user ? user.username : '';


    const [isEditing, setIsEditing] = useState(false);
    const [updatedUsername, setUpdatedUsername] = useState(username);
    const randomProfilePic = `https://www.shareicon.net/data/2016/05/24/770117_people_512x512.png`;
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
        email: '',
        password: '',
        appType: 'music',
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Checking if there is an authentication token in sessionStorage
        const authToken = sessionStorage.getItem('authToken');
        if (authToken) {
            // Set the user as authenticated
            setIsLoggedIn(true);
            // Optionally, you can retrieve user information here as well
            const userName = sessionStorage.getItem('userInfo');
            setUserInfo({ email: userName });
        }
    }, []);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        setIsEditing(false);
    };

    const handleUsernameChange = (event) => {
        setUpdatedUsername(event.target.value);
    };

    const signOut = () => {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userInfo');
        signOutContext();
        setIsLoggedIn(false);
        navigate('/');
    };
    const backgroundStyle = {
        backgroundImage: `url(${randomProfilePic})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        color: 'white',
        position: 'relative',
        isolation: 'isolate',
        left: '-50px',
        top: '-20px',
        width: '100%'
    };

    return (
        <div style={backgroundStyle} className='albumdetailsmain1'>
            {isLoggedIn ? (
                <>
                    <div className="user-details">
                        <div className="profile-picture">
                            <img src={randomProfilePic} alt="User Profile" className='profileimg' />
                        </div>

                        <div className="welcome1">
                            <p>{userInfo.email}!</p>
                            <p>Welcome! to Amazon Music</p>
                        </div>
                    </div>

                </>
            ) : (
                <div className='userloginn'>
                    <p>Please Login to view your profile</p>
                    <button id='amazon' onClick={() => navigate('/login')}>Login</button>
                </div>
            )}
        </div>
    );
}

export default UserProfile;