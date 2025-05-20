import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    EmailShareButton,
    EmailIcon,
    FacebookShareButton,
    FacebookIcon
} from "react-share";

const Generate = () => {
    const navigate = useNavigate();
    const [chatHistory, setChatHistory] = useState([]);
    const [selectedOption, setSelectedOption] = useState("1");
    const [conversations, setConversations] = useState([]);
    const [currentConversationId, setCurrentConversationId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        /*         if (!token) {
                    navigate("/login");
                    return;
                } */
    }, [navigate]);

    const handleNewChat = () => {
        // Lưu cuộc trò chuyện hiện tại nếu có
        if (chatHistory.length > 0) {
            const newConversation = {
                id: Date.now(),
                messages: [...chatHistory],
                title: chatHistory[0].content.substring(0, 30) + '...'
            };
            setConversations(prev => [...prev, newConversation]);
        }
        // Reset chat history cho cuộc trò chuyện mới
        setChatHistory([]);
        setCurrentConversationId(null);
    };

    const loadConversation = (conversationId) => {
        const conversation = conversations.find(c => c.id === conversationId);
        if (conversation) {
            setChatHistory(conversation.messages);
            setCurrentConversationId(conversationId);
        }
    };

    const handleSubmit = async (text) => {
        if (!text.trim()) {
            alert("Vui lòng nhập nội dung trước khi gửi.");
            return;
        }

        // Add user message to chat
        const userMessage = {
            type: 'user',
            content: text
        };
        setChatHistory(prev => [...prev, userMessage]);

        try {
            let apiUrl;
            let requestBody = {};
            let content = null;
            let videoUrl = null;
            if (selectedOption === "1") {
                apiUrl = "http://localhost:8000/text-to-speech";
                requestBody = {
                    text: text,
                    voice: "banmai",
                    speed: "0"
                };
            } else if (selectedOption === "2") {
                apiUrl = "http://localhost:8000/text-to-image/";
                requestBody = {
                    prompt: text,
                    steps: 0
                };
            } else if (selectedOption === "3") {
                apiUrl = "http://localhost:8000/text-to-video";
                requestBody = {
                    prompt: text,
                    negative_prompt: "blurry, low quality, distorted",
                    guidance_scale: 5.0,
                    fps: 16,
                    steps: 30,
                    seed: 123456,
                    frames: 64
                }
            }
            else {
                alert("Tính năng này chưa được hỗ trợ!");
                return;
            }

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("access_token")}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Lỗi API (${response.status}): ${errorText}`);
            }

            if (selectedOption === "3") {
                const blob = await response.blob();
                videoUrl = URL.createObjectURL(blob);
                content = { video_url: videoUrl };
            } else {
                const data = await response.json();
                content = data;
            }
            await new Promise(resolve => setTimeout(resolve, 5000));

            // Add bot message to chat
            const botMessage = {
                type: 'bot',
                content,
                option: selectedOption
            };
            setChatHistory(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Lỗi:", error);
            alert("Có lỗi xảy ra khi gọi API: " + error.message);
        }
    };


    return (
        <div className="full-container">
            <div className="sidebar">
                <button className="back-button" onClick={() => navigate('/')}>
                    <i className="fa fa-home"></i>
                </button>
                <div className="sidebar_title">
                    <h2>Sidebar</h2>
                </div>

                <div className="choices">
                    <select
                        className="options"
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
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
                    <button className="generate_btn" onClick={handleNewChat}>
                        + Cuộc trò chuyện mới
                    </button>
                </div>

                <div className="history">
                    <ul className="chat-list" style={{ listStyle: 'none', padding: 0 }}>
                        {conversations.map((conversation) => (
                            <li
                                key={conversation.id}
                                className={`chat-item ${currentConversationId === conversation.id ? 'active' : ''}`}
                                onClick={() => loadConversation(conversation.id)}
                                style={{
                                    padding: '10px',
                                    margin: '5px 0',
                                    cursor: 'pointer',
                                    backgroundColor: currentConversationId === conversation.id ? '#f0f0f0' : 'transparent',
                                    color: currentConversationId === conversation.id ? 'black' : 'white'
                                }}
                            >
                                {conversation.title}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="content">
                <div className="header_content content-item">
                    <div className="fixed-button-container">
                        <button className="fixed-button" onClick={() => navigate('/advanced')}>
                            Advanced
                        </button>
                    </div>
                    <i className="fa-solid fa-circle-user fa-2x avatar"></i>
                    <i className="username">User</i>
                </div>

                <div className="conservation content-item">
                    {chatHistory.map((message, index) => (
                        <div key={index} className={`message ${message.type}-message`}>
                            {message.type === 'user' ? (
                                message.content
                            ) : (
                                message.option === "1" ? (
                                    <>
                                        <audio controls src={message.content.audio_url} />
                                        <EmailShareButton subject='My content was created by Nhom1, check it out!'
                                            body='My content was created by Nhom 1! Check it out!' className='share' style={{ color: 'white', margin: '5px'}}>
                                            <EmailIcon size={32} round={true} />
                                        </EmailShareButton>

                                        
                                        {/*How am I suppose to upload this Base64 blob to server?*/}
                                        <FacebookShareButton hashtag='#AI' style={{ color: 'white', margin: '5px'}}>
                                            <FacebookIcon size={32} round={true} />
                                        </FacebookShareButton>
                                    </>

                                ) : message.option === "2" ? (
                                    <><img
                                        src={`data:image/png;base64,${message.content.image_url}`}
                                        alt="Generated"
                                        style={{ maxWidth: '70%', maxHeight: '70%', borderRadius: '10px' }} />
                                        <EmailShareButton subject='My content was created by Nhom1, check it out!'
                                            body='My content was created by Nhom 1! Check it out!' className='share' style={{ color: 'white' }}>
                                            <EmailIcon size={32} round={true} />
                                        </EmailShareButton>

                                        <FacebookShareButton hashtag='#AI'>
                                            <FacebookIcon size={32} round={true} />
                                        </FacebookShareButton>

                                    </>

                                ) : message.option === "3" ? (
                                    <>
                                        <video controls width="100%" src={message.content.video_url} />
                                        <EmailShareButton subject='My content was created by Nhom1, check it out!'
                                            body='My content was created by Nhom 1! Check it out!' className='share' style={{ color: 'white' }}>
                                            <EmailIcon size={32} round={true} />
                                        </EmailShareButton>

                                        <FacebookShareButton hashtag='#AI'>
                                            <FacebookIcon size={32} round={true} />
                                        </FacebookShareButton>
                                    </>
                                ) : null

                            )}

                        </div>
                    ))}
                </div>

                <div className="footer_content content-item">
                    <div id="btn_complex">
                        <textarea
                            className="input"
                            rows="4"
                            placeholder="Mô tả những gì bạn muốn tạo"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e.target.value);
                                    e.target.value = '';
                                }
                            }}
                        />
                        <button
                            id="submit_btn"
                            onClick={(e) => {
                                const textarea = e.target.previousSibling;
                                handleSubmit(textarea.value);
                                textarea.value = '';
                            }}
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Generate; 