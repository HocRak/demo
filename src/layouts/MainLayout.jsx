import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ChatBox from '../components/ChatBox';
import InputBox from '../components/InputBox';

const MainLayout = () => {
    const [selectedOption, setSelectedOption] = useState('1');
    const [messages, setMessages] = useState([]);

    const handleMessageSend = (text, data, option) => {
        // Add user message
        setMessages(prev => [...prev, { type: 'user', content: text }]);

        // Add bot response
        if (option === "1") {
            setMessages(prev => [...prev, {
                type: 'bot',
                content: data.audio_url,
                isAudio: true
            }]);
        } else if (option === "2") {
            setMessages(prev => [...prev, {
                type: 'bot',
                content: data.image_base64,
                isImage: true
            }]);
        }
    };

    return (
        <div className="full-container">
            <Sidebar
                selectedOption={selectedOption}
                onOptionChange={setSelectedOption}
            />
            <div className="content">
                <Header />
                <ChatBox messages={messages} />
                <InputBox
                    selectedOption={selectedOption}
                    onMessageSend={handleMessageSend}
                />
            </div>
        </div>
    );
};

export default MainLayout; 