import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const GoogleCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Lấy token từ URL parameters nếu có
                const params = new URLSearchParams(location.search);
                const token = params.get('token');

                if (token) {
                    // Lưu token vào localStorage
                    localStorage.setItem('access_token', token);
                    localStorage.setItem('isLoggedIn', 'true');

                    // Chuyển hướng đến trang generate
                    navigate('/generate');
                } else {
                    console.error('No token received from Google OAuth');
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error in Google callback:', error);
                navigate('/login');
            }
        };

        handleCallback();
    }, [navigate, location]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#1a1a1a',
            color: 'white'
        }}>
            <h2>Đang xử lý đăng nhập...</h2>
        </div>
    );
};

export default GoogleCallback; 