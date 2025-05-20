import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    EmailShareButton,
    EmailIcon,
    FacebookShareButton,
    FacebookIcon
  } from "react-share";

import FileUpload from '../components/FileUpload';

const Generate = () => {
    const navigate = useNavigate();
    const [chatHistory, setChatHistory] = useState([]);
    const [selectedOption, setSelectedOption] = useState("1");
    const [conversations, setConversations] = useState([]);
    const [currentConversationId, setCurrentConversationId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
/*         if (!token) {
            navigate("/login");
            return;
        } */
    }, [navigate]);

    const handleNewChat = () => {
        if (chatHistory.length > 0) {
            const newConversation = {
                id: Date.now(),
                messages: [...chatHistory],
                title: chatHistory[0].content.substring(0, 30) + '...'
            };
            setConversations(prev => [...prev, newConversation]);
        }
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

        setIsLoading(true);
        const userMessage = {
            type: 'user',
            content: text
        };
        setChatHistory(prev => [...prev, userMessage]);

        try {
            let apiUrl;
            let requestBody = {};
            let videoUrl = null;
            let headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            };

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
            } else if (selectedOption === "6") {
                apiUrl = "http://127.0.0.1:8000/chatbot/content";
                requestBody = {
                    prompt: text
                };
                headers = {
                    "Content-Type": "application/json"
                };
            } else if (selectedOption === "7") {
                apiUrl = `http://localhost:8000/input/text?text=${encodeURIComponent(text)}`;
                headers = {
                    "Accept": "application/json"
                };
            } else {
                alert("Tính năng này chưa được hỗ trợ!");
                return;
            }

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`Lỗi API (${response.status}): ${await response.text()}`);
            }

            let botMessage;
            if (selectedOption === "3") {
                const blob = await response.blob();
                videoUrl = URL.createObjectURL(blob);
                botMessage = {
                    type: 'bot',
                    content: { video_url: videoUrl },
                    option: selectedOption
                };
            } else {
                const data = await response.json();
                if (selectedOption === "6") {
                    botMessage = {
                        type: 'bot',
                        content: { text: data.response },
                        option: selectedOption
                    };
                } else if (selectedOption === "2") {
                    botMessage = {
                        type: 'bot',
                        content: { image_url: `http://localhost:8000/${data.image_url}` },
                        option: selectedOption
                    };
                } else {
                    botMessage = {
                        type: 'bot',
                        content: data,
                        option: selectedOption
                    };
                }
            }
            setChatHistory(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Lỗi:", error);
            alert("Có lỗi xảy ra khi gọi API: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSpeechFile = async (file) => {
        setIsLoading(true);
        const audioUrl = URL.createObjectURL(file);
        const userMessage = {
            type: 'user',
            content: `Đã gửi file audio: ${file.name}`,
            audio_url: audioUrl
        };
        setChatHistory(prev => [...prev, userMessage]);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("http://127.0.0.1:8000/input/speech", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Lỗi API (${response.status}): ${await response.text()}`);
            }

            const data = await response.json();
            const botMessage = {
                type: 'bot',
                content: { text: data.text },
                option: "8"
            };
            setChatHistory(prev => [...prev, botMessage]);
        } catch (error) {
            alert("Có lỗi xảy ra khi gọi API: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVideoFile = async (file) => {
        setIsLoading(true);
        const videoUrl = URL.createObjectURL(file);
        const userMessage = {
            type: 'user',
            content: `Đã gửi video: ${file.name}`,
            video_url: videoUrl
        };
        setChatHistory(prev => [...prev, userMessage]);
    
        try {
            const formData = new FormData();
            formData.append("file", file);
    
            const response = await fetch("http://127.0.0.1:8000/input/video", {
                method: "POST",
                body: formData
            });
    
            if (!response.ok) {
                throw new Error(`Lỗi API (${response.status}): ${await response.text()}`);
            }
    
            const data = await response.json();
    
            const botMessage = {
                type: 'bot',
                content: { text: data.text },
                option: "9"
            };
            setChatHistory(prev => [...prev, botMessage]);
        } catch (error) {
            alert("Gửi video thất bại: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDocFile = async (file) => {
        setIsLoading(true);
        const fileUrl = URL.createObjectURL(file);
        const userMessage = {
            type: 'user',
            content: `Đã gửi file: ${file.name}`,
            file_url: fileUrl
        };
        setChatHistory(prev => [...prev, userMessage]);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("http://127.0.0.1:8000/input/file", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Lỗi API (${response.status}): ${await response.text()}`);
            }

            const data = await response.json();
            const botMessage = {
                type: 'bot',
                content: { text: data.text },
                option: "10"
            };
            setChatHistory(prev => [...prev, botMessage]);
        } catch (error) {
            alert("Có lỗi xảy ra khi gọi API: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImproveImage = async (file) => {
        setIsLoading(true);
        const imageUrl = URL.createObjectURL(file);
        const userMessage = {
            type: 'user',
            content: `Đã gửi ảnh: ${file.name}`,
            image_url: imageUrl
        };
        setChatHistory(prev => [...prev, userMessage]);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("http://127.0.0.1:8000/enhance", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Lỗi API (${response.status}): ${await response.text()}`);
            }

            const blob = await response.blob();
            const improvedImageUrl = URL.createObjectURL(blob);
            const botMessage = {
                type: 'bot',
                content: { improved_image_url: improvedImageUrl },
                option: "5"
            };
            setChatHistory(prev => [...prev, botMessage]);
        } catch (error) {
            alert("Có lỗi xảy ra khi gọi API: " + error.message);
        } finally {
            setIsLoading(false);
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
                        className={`options ${isLoading ? 'disabled' : ''}`}
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        disabled={isLoading}
                    >
                        <option value="1">Text to Speech</option>
                        <option value="2">Text to Image</option>
                        <option value="3">Text to Video</option>
                        <option value="4">Create AI Avatar</option>
                        <option value="5">Improve Image Quality</option>
                        <option value="6">AI Chatbox</option>
                        <option value="7">Text to Text</option>
                        <option value="8">Speech to Text</option>
                        <option value="9">Video to Text</option>
                        <option value="10">File to Text</option>
                    </select>
                </div>

                <div className="new-chat_btn">
                    <button 
                        className={`generate_btn ${isLoading ? 'disabled' : ''}`} 
                        onClick={handleNewChat}
                        disabled={isLoading}
                    >
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
                                    background: currentConversationId === conversation.id ? 'linear-gradient(135deg, #3999ff, #50e2ff)' : 'transparent',
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
                        <button 
                            className={`fixed-button ${isLoading ? 'disabled' : ''}`} 
                            onClick={() => navigate('/advanced')}
                            disabled={isLoading}
                        >
                            Advanced
                        </button>
                    </div>
                    <div className="user-info">
                        <i className="fa-solid fa-circle-user fa-2x avatar"></i>
                        <i className="username">User</i>
                    </div>
                </div>

                <div className="conservation content-item">
                    {chatHistory.map((message, index) => (
                        <div
                            key={index}
                            className={`message ${message.type}-message${message.video_url ? " video-message" : ""}${message.audio_url ? " audio-message" : ""}${message.image_url ? " image-message" : ""}`}
                        >
                            {message.type === 'user' ? (
                                message.audio_url ? (
                                    <audio controls src={message.audio_url} />
                                ) : message.video_url ? (
                                    <video
                                        controls
                                        src={message.video_url}
                                        style={{
                                            width: "100%",
                                            maxWidth: "500px",
                                            maxHeight: "300px",
                                            borderRadius: "10px"
                                        }}
                                    />
                                ) : message.image_url ? (
                                    <img
                                        src={message.image_url}
                                        alt="Ảnh đã gửi"
                                        style={{ maxWidth: "300px", borderRadius: "10px" }}
                                    />
                                ) : message.file_url ? (
                                    <a
                                        href={message.file_url}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="file-link"
                                        style={{ fontSize: '30px' }}
                                    >
                                        📄
                                    </a>
                                ) : (
                                    message.content
                                )
                            ) : (
                                message.option === "1" ? (
                                    <>
                                        <audio controls src={message.content.audio_url} />
                                        <EmailShareButton subject='My content was created by Nhom1, check it out!'
                                                body='My content was created by Nhom 1! Check it out!' className='share' style={{color: 'white'}}>
                                                    <EmailIcon size={48} round={true} />
                                        </EmailShareButton>

                                        <FacebookShareButton hashtag='#AI'>
                                            <FacebookIcon size={48} round={true} />
                                        </FacebookShareButton>
                                    </> 
                                ) : message.option === "2" ? (
                                    <>
                                        <img
                                            src={message.content.image_url}
                                            alt="Generated"
                                            style={{ maxWidth: '100%' }}
                                        />
                                        <EmailShareButton 
                                            subject='My content was created by Nhom1, check it out!'
                                            body='My content was created by Nhom 1! Check it out!' 
                                            className='share' 
                                            style={{color: 'white'}}
                                        >
                                            <EmailIcon size={48} round={true} />
                                        </EmailShareButton>
                                        
                                        <FacebookShareButton hashtag='#AI'>
                                            <FacebookIcon size={48} round={true} />
                                        </FacebookShareButton>
                                    </>
                                ): message.option === "3" ? (
                                    <>
                                        <video controls width="100%" src={message.content.video_url} />
                                        <EmailShareButton subject='My content was created by Nhom1, check it out!'
                                            body='My content was created by Nhom 1! Check it out!' className='share' style={{ color: 'white' }}>
                                            <EmailIcon size={48} round={true} />
                                        </EmailShareButton>

                                        <FacebookShareButton hashtag='#AI'>
                                            <FacebookIcon size={48} round={true} />
                                        </FacebookShareButton>
                                    </>
                                ) : message.option === "5" ? (
                                    <>
                                        <img
                                            src={message.content.improved_image_url}
                                            alt="Improved"
                                            style={{
                                                width: "100%",
                                                maxWidth: "500px",
                                                maxHeight: "300px",
                                                borderRadius: "10px",
                                                display: "block"
                                            }}
                                        />
                                        <EmailShareButton 
                                            subject='My content was created by Nhom1, check it out!'
                                            body='My content was created by Nhom 1! Check it out!'
                                            className='share' 
                                            style={{color: 'white'}}
                                        >
                                            <EmailIcon size={48} round={true} />
                                        </EmailShareButton>
                                        <FacebookShareButton hashtag='#AI'>
                                            <FacebookIcon size={48} round={true} />
                                        </FacebookShareButton>
                                    </>
                                ) : (message.option === "6" || message.option === "7" || message.option === "8" || message.option === "9" || message.option === "10") ? (
                                    <div className="text-response">
                                        {message.content.text}
                                    </div>
                                ) : null
                            )}
                        </div>
                    ))}
                    {isLoading && <div className="loading-spinner"></div>}
                </div>

                <div className="footer_content content-item">
                    <div id="btn_complex">
                        {selectedOption === "8" ? (
                            <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                gap: '10px', 
                                width: '60%',
                                margin: '20px auto'
                            }}>
                                <FileUpload onFileSend={handleSpeechFile} accept=".wav" disabled={isLoading} />
                                <span style={{ color: "#fff" }}>
                                    Hãy chọn file (.wav) để chuyển thành văn bản...
                                </span>
                            </div>
                        ) : selectedOption === "9" ? (
                            <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                gap: '10px', 
                                width: '60%',
                                margin: '20px auto'
                            }}>
                                <FileUpload onFileSend={handleVideoFile} accept=".mp4" disabled={isLoading} />
                                <span style={{ color: "#fff" }}>
                                    Hãy chọn file video (.mp4) để chuyển thành văn bản...
                                </span>
                            </div>
                        ) : selectedOption === "10" ? (
                            <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                gap: '10px', 
                                width: '60%',
                                margin: '20px auto'
                            }}>
                                <FileUpload onFileSend={handleDocFile} accept=".docx,.txt" disabled={isLoading} />
                                <span style={{ color: "#fff" }}>
                                    Hãy chọn file (.docx, .txt) để chuyển thành văn bản...
                                </span>
                            </div>
                        ) : selectedOption === "5" ? (
                            <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                gap: '10px', 
                                width: '60%',
                                margin: '20px auto'
                            }}>
                                <FileUpload onFileSend={handleImproveImage} accept=".jpg" disabled={isLoading} />
                                <span style={{ color: "#fff" }}>
                                    Hãy chọn file ảnh (.jpg) để cải thiện chất lượng...
                                </span>
                            </div>
                        ) : (
                            <>
                                <textarea
                                    className={`input ${isLoading ? 'disabled' : ''}`}
                                    rows="4"
                                    placeholder="Mô tả những gì bạn muốn tạo"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSubmit(e.target.value);
                                            e.target.value = '';
                                        }
                                    }}
                                    disabled={isLoading}
                                />
                                <button
                                    id="submit_btn"
                                    className={isLoading ? 'disabled' : ''}
                                    onClick={(e) => {
                                        const textarea = e.target.previousSibling;
                                        handleSubmit(textarea.value);
                                        textarea.value = '';
                                    }}
                                    disabled={isLoading}
                                >
                                    Create
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Generate; 