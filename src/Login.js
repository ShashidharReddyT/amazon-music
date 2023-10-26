import React, { useState, useEffect } from "react";
import { useUser } from "./UserProvider";
import { useNavigate } from "react-router-dom";
import logo from "./Assets/Amazon-music.png";
import "./SignupPage.css";

function Login() {
    const { signInContext, signOutContext } = useUser();
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({
        email: "",
        password: "",
        appType: "music",
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        // Checking if there is an authentication token in sessionStorage
        const authToken = sessionStorage.getItem("authToken");
        if (authToken) {
            // Set the user as authenticated
            setIsLoggedIn(true);
            // Optionally, you can retrieve user information here as well
            const userName = sessionStorage.getItem("userInfo");
            setUserInfo({ email: userName });
        }
    }, []);

    function handleChange(event) {
        const element = event.target;
        const { name, value } = element;

        setUserInfo((oldInfo) => {
            return {
                ...oldInfo,
                [name]: value,
            };
        });
    }

    async function signIn(userInfo) {
        try {
            const myHeaders = new Headers();
            myHeaders.append("projectId", "ybxi8hzrv99f");
            myHeaders.append("Content-Type", "application/json");

            const url = "https://academics.newtonschool.co/api/v1/user/login";
            const payload = {
                ...userInfo,
            };

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify(payload),
            };

            const response = await fetch(url, requestOptions);

            if (response.ok) {
                const data = await response.json();
                const { token, data: loginData } = data;
                const { name: userName } = loginData;
                sessionStorage.setItem("authToken", token);
                sessionStorage.setItem("userInfo", userName);
                signInContext(token, userName);
                setIsLoggedIn(true);

                // Redirecting to the homepage after successful login
                navigate('/homepage');
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Password or email is incorrect");
            }
        } catch (error) {
            setError("An error occurred during login. Please try again later.");
        }
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (!userInfo.email || !userInfo.password) {
            setError("Please enter both email and password.");
            return;
        }

        signIn(userInfo);
    }

    function signOut() {
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("userInfo");
        signOutContext();
        setIsLoggedIn(false);
    }

    function navigateToSignupPage() {
        navigate("/signup");
    }

    return (
        <div>
            <img src={logo} alt="Amazon.com" className="logoo" />

            {isLoggedIn ? (
                <div className="welcome">
                    <p>Welcome to Amazon Music, {userInfo.email}!</p>
                    <button onClick={signOut}>Sign Out</button>
                </div>
            ) : (
                <div id="signInBorder">
                    <form onSubmit={handleSubmit}>
                        <p id="SignInTxt">Sign in</p>
                        <label>
                            <strong>Email or Username</strong>
                            <br />
                            <input
                                type="email"
                                name="email"
                                value={userInfo.email}
                                onChange={(event) => handleChange(event)}
                                className="inputfield"
                            />
                        </label>

                        <br />

                        <label>
                            <strong>Password</strong>
                            {/* <span>
                                <a href="#1" id="password">
                                    Forgot your password?
                                </a>
                            </span> */}
                            <br />
                            <input
                                type="password"
                                name="password"
                                value={userInfo.password}
                                onChange={(event) => handleChange(event)}
                                className="inputfield"
                            />
                        </label>

                        {error && <div className="error-message">{error}</div>}

                        <div>
                            <button id="amazon" type="submit">
                                Sign in
                            </button>
                        </div>

                        <div id="createAccount">
                            <h2 className="headerr">
                                <span>New to Amazon?</span>
                            </h2>
                            <button id="newAccount" name="newAcct" onClick={navigateToSignupPage}>
                                Create your Amazon account
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <hr id="footer" />

            <div className="extra">
                <p className="links">
                    <a href="#1" id="first">
                        Conditions of Use
                    </a>
                    <a href="#2">Notice of Use</a>
                    <a href="#3">Help</a>
                </p>
                <p className="links" id="special">
                    © 1996-2016, Amazon.com, Inc. or its affiliates
                </p>
            </div>
        </div>
    );
}

export default Login;
