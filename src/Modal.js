import React, { useEffect, useRef } from 'react';
import './Modal.css';
import { useNavigate } from 'react-router-dom';

function Modal({ isOpen, onClose, content, position }) {
    const modalRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const modalStyle = {
        top: `${position.top}px`,
        left: `${position.left}px`,
    };

    const handleViewAlbum = () => {
        navigate('/featuredsongdetail');
        onClose();
    };

    function handleShareSong() {
        //later i need to update this
    }

    function handleViewArtist() {

    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-overlay">
                <div className="modal-content" style={modalStyle}>
                    <button className="close-button" onClick={onClose}>
                        Close
                    </button>

                    <div className="modal-actions">
                        <p className="action-link" onClick={handleViewAlbum}>
                            View Album
                        </p>
                        <p className="action-link" onClick={handleShareSong}>
                            Share Song
                        </p>
                        <p className="action-link" onClick={handleViewArtist}>
                            View Artist
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;
