import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    return (
        <div className="header_content">
            <div className="fixed-button-container">
                <button
                    className="fixed-button"
                    onClick={() => navigate('/advanced')}
                >
                    Advanced
                </button>
            </div>
            <i className="fa-solid fa-circle-user fa-2x avatar"></i>
            <i className="username">User</i>
        </div>
    );
};

export default Header; 