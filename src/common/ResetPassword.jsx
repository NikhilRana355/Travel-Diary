import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/css/reset.css"

export const ResetPassword = () => {
    const { token } = useParams(); // Get token from URL
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleResetPassword = async () => {
        if (!password || !confirmPassword) {
            setMessage("Please enter both password fields.");
            return;
        }
        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("/user/resetpassword", { token, password });
            setMessage(response.data.message);
            setTimeout(() => navigate("/login"), 2000); // Redirect to login after reset
        } catch (error) {
            setMessage("Error resetting password. Try again.");
        }
        setLoading(false);
    };

    return (
        <div className="reset-password-container">
            <div className="reset-box">
                <h2>Reset Password</h2>
                <p>Enter a new password below</p>
                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button onClick={handleResetPassword} disabled={loading}>
                    {loading ? "Resetting..." : "Set New Password"}
                </button>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};
