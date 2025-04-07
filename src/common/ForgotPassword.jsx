import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleReset = async () => {
        if (email.trim() === "") {
            setMessage("Please enter your email.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("/user/forgotpassword", { email });

            if (response.data.token) {
                navigate(`/resetpassword/${response.data.token}`);
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            setMessage("Error sending reset link. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
                <h2 className="text-center text-primary">Forgot Password</h2>
                <p className="text-center">Enter your email to reset your password</p>

                <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <button className="btn btn-primary w-100" onClick={handleReset} disabled={loading}>
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2"></span> Sending...
                        </>
                    ) : (
                        "Reset Password"
                    )}
                </button>

                {message && (
                    <div className="alert alert-info text-center mt-3 p-2">{message}</div>
                )}
            </div>
        </div>
    );
};
