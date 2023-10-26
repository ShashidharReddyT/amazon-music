import React, { useState, useEffect } from "react";
import { useUser } from "./UserProvider";
import { useNavigate } from "react-router-dom";

function UpdatePassword() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [responseMessage, setResponseMessage] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { signInContext } = useUser(); // Use signInContext to update user information after password change
    const navigate = useNavigate();

    const handleUpdatePassword = async (event) => {
        event.preventDefault();

        try {
            // Check if the user token is available in session storage
            const authToken = sessionStorage.getItem("authToken");

            if (!authToken) {
                // Handle the case when the user is not authenticated
                setResponseMessage("User not authenticated. Please log in.");
                return;
            }

            // Client-side validation (add your own validation rules)
            if (!name || !email || !currentPassword || !newPassword) {
                setResponseMessage("Please fill in all fields.");
                return;
            }

            setIsLoading(true);

            const user = {

                email,
                currentPassword,
                newPassword,
                appType: "music",
            };

            const myHeaders = new Headers();
            myHeaders.append("projectId", "ybxi8hzrv99f");
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${authToken}`);

            const response = await fetch(
                "https://academics.newtonschool.co/api/v1/user/updateMyPassword",
                {
                    method: "PATCH",
                    headers: myHeaders,
                    body: JSON.stringify(user),
                }
            );

            setIsLoading(false);

            if (response.ok) {
                setResponseMessage("Password updated successfully.");
                // You can add further logic here, such as redirecting the user or showing a success message.

                // Update user information after password change
                signInContext(authToken, name);

                // Clear form fields
                setName("");
                setEmail("");
                setCurrentPassword("");
                setNewPassword("");
            } else {
                setResponseMessage(
                    "Password update failed. Please check your current password and try again."
                );
            }
        } catch (error) {
            setIsLoading(false);
            console.error("Password update error:", error);
            setResponseMessage("An error occurred while updating the password. Please try again later.");
        }
    };

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        // Checking if there is an authentication token in sessionStorage
        const authToken = sessionStorage.getItem("authToken");
        if (authToken) {
            // Set the user as authenticated
            setIsLoggedIn(true);
            // Optionally, you can retrieve user information here as well
            const userName = sessionStorage.getItem("userInfo");

        }
    }, []);

    return (
        <div>
            <form onSubmit={handleUpdatePassword}>
                <p>Update Password</p>
                <label>
                    <strong>Name</strong>
                    <br />
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    <strong>Email</strong>
                    <br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    <strong>Current Password</strong>
                    <br />
                    <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                        Show
                    </button>
                </label>
                <br />
                <label>
                    <strong>New Password</strong>
                    <br />
                    <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                        Show
                    </button>
                </label>
                <br />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Password"}
                </button>
                <div>{responseMessage}</div>
            </form>
        </div>
    );
}

export default UpdatePassword;
