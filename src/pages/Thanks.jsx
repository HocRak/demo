import React from 'react';
import { useNavigate } from 'react-router-dom';

const Thanks = () => {
    const navigate = useNavigate();

    return (
        <div className="thanks-container">
            <div className="thanks-box">
                <h2 className="thanks-title">Cảm ơn bạn!</h2>
                <p className="thanks-message">
                    Tài khoản của bạn đã được tạo thành công.
                    Vui lòng kiểm tra email để xác nhận tài khoản.
                </p>
                <a
                    href="#"
                    onClick={() => navigate('/login')}
                    className="login-redirect"
                >
                    Đăng nhập
                </a>
            </div>
        </div>
    );
};

export default Thanks; 