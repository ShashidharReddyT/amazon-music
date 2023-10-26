import React, { useState } from 'react';
import logo from './Assets/Amazon-music.png';
import './SignupPage.css';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const navigate = useNavigate();
    const handleSignup = async (event) => {
        event.preventDefault();
        try {
            const user = {
                name: `${firstName} ${lastName}`,
                email,
                password,
                appType: 'music',
            };

            const myHeaders = new Headers();
            myHeaders.append("projectId", "ybxi8hzrv99f");
            myHeaders.append("Content-Type", "application/json");

            const response = await fetch('https://academics.newtonschool.co/api/v1/user/signup', {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(user),
            });

            console.log('Response status:', response.status);
            const responseBody = await response.text();
            console.log('Response body:', responseBody);

            if (response.status === 201) {
                setResponseMessage('Registration successful! You can now log in.');
                alert('Registration successful! You can now log in.');
                setFirstName('');
                setLastName('');
                setEmail('');
                setPassword('');
                // Redirect to the homepage
                navigate('/login'); // Replace '/' with the actual URL of your homepage
            } else {
                setResponseMessage(`Registration failed.`);
            }
        } catch (error) {
            console.error('Registration error:', error);
            setResponseMessage('An error occurred during registration. Please try again later.');
        }
    };

    return (
        <div>
            <img src={logo} alt="Amazon.com" className="logoo" />
            <div id="signInBorder">
                <form onSubmit={handleSignup}>
                    <p id="SignInTxt">Sign up</p>
                    <label>
                        <strong>First Name</strong>
                        <br />
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="inputfield" />
                    </label>
                    <br />
                    <label>
                        <strong>Last Name</strong>
                        <br />
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="inputfield" />
                    </label>
                    <br />
                    <label>
                        <strong>Email (phone for mobile accounts)</strong>
                        <br />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="inputfield" />
                    </label>
                    <br />
                    <label>
                        <strong>Password</strong>
                        <span>
                            <a href="#1" id="password">
                                Forgot your password?
                            </a>
                        </span>
                        <br />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="inputfield"
                            autoComplete="current-password"
                        />
                    </label>
                    <div>
                        <button id="amazon" type="submit"> {/* Use type="submit" for the button */}
                            Sign up
                        </button>
                    </div>
                    <div>{responseMessage}</div>
                </form>
            </div>
            <hr id="footer" />
            <div className="extra">
            </div>
        </div>
    );
}

export default SignupPage;
