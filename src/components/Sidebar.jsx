import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ selectedOption, onOptionChange }) => {
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);

    const handleNewChat = () => {
        const newChat = {
            id: Date.now(),
            name: `Hội thoại ${chats.length + 1}`
        };
        setChats([...chats, newChat]);
    };

    return (
        <div className="sidebar">
            <button
                onClick={() => navigate('/home')}
                className="back-button"
            >
                <i className="fa fa-home"></i>
            </button>

            <heading className="sidebar_title">
                <h2>Sidebar</h2>
            </heading>

            <div className="choices">
                <select
                    className="options"
                    value={selectedOption}
                    onChange={(e) => onOptionChange(e.target.value)}
                >
                    <option value="1">Text to Speech</option>
                    <option value="2">Text to Image</option>
                    <option value="3">Text to Video</option>
                    <option value="4">Create AI Avatar</option>
                    <option value="5">Improve Image Quality</option>
                    <option value="6">AI Chatbox</option>
                </select>
            </div>

            <div className="new-chat_btn">
                <button
                    className="generate_btn"
                    onClick={handleNewChat}
                >
                    + Cuộc trò chuyện mới
                </button>
            </div>

            <div className="history">
                <ul className="chat-list">
                    <li>Đoạn chat gần đây</li>
                    {chats.map(chat => (
                        <li
                            key={chat.id}
                            className="chat-item"
                        >
                            {chat.name}
                            <a href="#" className="options-btn">⋮</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar; 