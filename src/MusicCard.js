import React, { useState } from "react";
import PropTypes from "prop-types";
import './MusicCard.css';
import LoginModal from './LoginModal';
import { useUser } from "./UserProvider";

function MusicCard({ title, audio_url, image, artists, id, onClick }) {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    useUser();

    const closeLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    return (
        <div className="music-card">
            <img src={image} alt={title} className="music-card-image" />
            <div className="music-card-details">
                <h3 className="music-card-title">{title}</h3>
                {artists ? (
                    <p className="music-card-artists">
                        {artists.map((artist, index) => (
                            <span key={index}>{artist.name}</span>
                        ))}
                    </p>
                ) : (
                    <p className="music-card-artists">No artists</p>
                )}
            </div>

            {isLoginModalOpen && (
                <LoginModal closeModal={closeLoginModal} />
            )}
        </div>
    );
}

MusicCard.propTypes = {
    title: PropTypes.string.isRequired,
    audio_url: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    artists: PropTypes.arrayOf(PropTypes.object).isRequired,
    id: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default MusicCard;
