import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        if (localStorage.getItem("isLoggedIn") === "true") {
            navigate('/generate');
        } else {
            alert("Bạn cần đăng nhập trước khi sử dụng tính năng này!");
            navigate('/login');
        }
    };

    return (
        <div className="full-container">
            <div className="sidebar">
                <div className="sidebar_text">
                    <h2>Sidebar</h2>
                    <span>TRANG CHỦ</span>
                </div>
            </div>
            <div className="content">
                <nav className="navbar content-item">
                    <div className="navbar_btn">
                        <button onClick={() => navigate('/signup')} className="btn_login">Sign Up</button>
                        <button onClick={() => navigate('/login')} className="btn_login">Sign In</button>
                    </div>
                </nav>
                <div className="content_body content-item">
                    <div className="body_title">
                        <h1>CHÀO MỪNG BẠN ĐẾN VỚI [...]</h1>
                        <h3>Slogan</h3>
                    </div>
                    <div className="body_description">
                        <h3 className="description_prompt">Tôi có thể giúp gì được cho bạn?</h3>
                        <ul className="description_prompt">
                            <li>Text to Speech - Chuyển văn bản thành giọng nói</li>
                            <li>Text to Image - Chuyển văn bản thành hình ảnh</li>
                            <li>Text to Video - Chuyển văn bản thành video</li>
                            <li>Create AI Avatar - Tạo avatar AI</li>
                            <li>Improve Image Quality - Cải thiện chất lượng hình ảnh</li>
                        </ul>
                    </div>
                    <button onClick={handleGetStarted} className="start_btn">BẮT ĐẦU NÀO</button>
                </div>
            </div>
        </div>
    );
};

export default Home; 