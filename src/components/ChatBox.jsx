import React from 'react';

const ChatBox = ({ messages }) => {
    return (
        <div className="conservation">
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
                >
                    {message.isAudio ? (
                        <audio controls src={message.content}></audio>
                    ) : message.isImage ? (
                        <img
                            src={`data:image/png;base64,${message.content}`}
                            alt="Generated"
                            style={{ maxWidth: '100%' }}
                        />
                    ) : (
                        message.content
                    )}
                </div>
            ))}
        </div>
    );
};

export default ChatBox; 