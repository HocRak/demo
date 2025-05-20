import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        rePassword: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate form data
        const newErrors = {};
        if (!formData.username) newErrors.username = 'Vui lòng nhập tên đăng nhập';
        if (!formData.email) newErrors.email = 'Vui lòng nhập email';
        if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu';
        if (formData.password !== formData.rePassword) {
            newErrors.rePassword = 'Mật khẩu không khớp';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/auth/register', formData);
            if (response.data.access_token) {
                localStorage.setItem('access_token', response.data.access_token);
                navigate('/');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Đăng ký thất bại!');
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8000/auth/google';
    };

    const handleGithubLogin = () => {
        window.location.href = 'http://localhost:8000/auth/github';
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <h1>Đăng ký tài khoản</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label className="form-label" style={{ color: 'white' }}>Tên đăng nhập</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        {errors.username && <small className="error-message">{errors.username}</small>}
                    </div>
                    <div className="form-control">
                        <label className="form-label" style={{ color: 'white' }}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {errors.email && <small className="error-message">{errors.email}</small>}
                    </div>
                    <div className="form-control">
                        <label className="form-label" style={{ color: 'white' }}>Mật khẩu</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {errors.password && <small className="error-message">{errors.password}</small>}
                    </div>
                    <div className="form-control">
                        <label className="form-label" style={{ color: 'white' }}>Nhập lại mật khẩu</label>
                        <input
                            type="password"
                            name="rePassword"
                            value={formData.rePassword}
                            onChange={handleChange}
                            required
                        />
                        {errors.rePassword && <small className="error-message">{errors.rePassword}</small>}
                    </div>

                    <button className="submit-button-signup" type="submit">
                        Đăng ký
                    </button>
                </form>

                <div className="separator">
                    <span>HOẶC ĐĂNG NHẬP BẰNG</span>
                </div>

                <div className="social-buttons">
                    <button className="btn Github" onClick={handleGithubLogin}>
                        <FaGithub size={24} />
                        Github
                    </button>
                    <button className="btn Google" onClick={handleGoogleLogin}>
                        <FcGoogle size={24} />
                        Google
                    </button>
                </div>
                <p className="sg-link" style={{ color: 'white' }}>
                    Đã có tài khoản? <Link style={{ marginLeft: '10px' }} to="/login" className="link-up">Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp; 