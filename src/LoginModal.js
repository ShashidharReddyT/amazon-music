import React from 'react';
import './LoginModal.css';
import { Link } from 'react-router-dom'

const LoginModal = ({ closeModal }) => {

    return (

        <div className="login-modal-overlay">
            <div className="login-modal">
                <button className='close-buttton' onClick={closeModal}>X</button>
                <p className='firstt'>Try Amazon Prime Music</p>
                <p className='secondd'>Ad-free music streaming included with Prime membership. Also</p>
                <p> includes free shipping and video streaming.</p>
                <div className='signbuttonss'>
                    <Link to="/login" className='signbutton'>ALREADY A CUSTOMER? SIGN IN</Link>
                    <Link to="/signup" className='signbutton1'>TRY NOW</Link>
                </div>

            </div>
        </div>
    );
};

export default LoginModal;