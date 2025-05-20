import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGithub, FaUser, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await axios.post("http://localhost:8000/api/auth/login", formData, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Server response:', response.data); // Debug log

            if (response.data && response.data.access_token) {
                // Lưu token vào localStorage
                try {
                    localStorage.setItem("access_token", response.data.access_token);
                    localStorage.setItem("isLoggedIn", "true");
                    console.log('Token saved successfully'); // Debug log

                    // Kiểm tra xem token đã được lưu chưa
                    const savedToken = localStorage.getItem("access_token");
                    console.log('Saved token:', savedToken); // Debug log

                    if (savedToken) {
                        navigate("/generate");
                    } else {
                        setError("Lỗi lưu token. Vui lòng thử lại!");
                    }
                } catch (storageError) {
                    console.error('Error saving to localStorage:', storageError);
                    setError("Lỗi lưu thông tin đăng nhập. Vui lòng thử lại!");
                }
            } else {
                setError("Không nhận được token từ server!");
                console.error('No token in response:', response.data);
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin đăng nhập.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8000/api/auth/google";
    };

    const handleGithubLogin = () => {
        window.location.href = "http://localhost:8000/api/auth/github";
    };

    return (
        <div className="signin-page">
            <div className="signin-container">
                <h1>Đăng nhập</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label style={{ color: 'white' }}>
                            Tên đăng nhập
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-control">
                        <label style={{ color: 'white' }}>
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        className="submit-button-signin"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                    {error && <p id="error-message" className="error-message">{error}</p>}
                </form>

                <div className="separator">
                    <span>HOẶC ĐĂNG NHẬP BẰNG</span>
                </div>

                <div className="social-buttons">
                    <button
                        className="btn Github"
                        onClick={handleGithubLogin}
                        disabled={isLoading}
                    >
                        <FaGithub size={24} />
                        Github
                    </button>
                    <button
                        className="btn Google"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                    >
                        <FcGoogle size={24} />
                        Google
                    </button>
                </div>

                <p style={{ color: 'white' }}>
                    Chưa có tài khoản?{" "}
                    <Link to="/signup" className="link-in">
                        Đăng ký ngay
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login; 