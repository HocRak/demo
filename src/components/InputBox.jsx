import React, { useState } from 'react';

const InputBox = ({ selectedOption, onMessageSend }) => {
    const [inputText, setInputText] = useState('');

    const handleSubmit = async () => {
        if (!inputText.trim()) {
            alert("Vui lòng nhập nội dung trước khi gửi.");
            return;
        }

        try {
            let apiUrl;
            let requestBody = {};

            if (selectedOption === "1") { // Text to Speech
                apiUrl = "http://localhost:8000/text-to-speech";
                requestBody = {
                    text: inputText,
                    voice: "banmai",
                    speed: "0"
                };
            } else if (selectedOption === "2") { // Text to Image
                apiUrl = "http://localhost:8000/text-to-image/quick";
                requestBody = {
                    prompt: inputText,
                    steps: 0
                };
            } else {
                alert("Tính năng này chưa được hỗ trợ!");
                return;
            }

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`Lỗi API (${response.status}): ${await response.text()}`);
            }

            const data = await response.json();
            onMessageSend(inputText, data, selectedOption);
            setInputText('');

            // Handle response based on selected option
            if (selectedOption === "1") {
                // Handle audio response
                const audio = new Audio(data.audio_url);
                audio.play();
            } else if (selectedOption === "2") {
                // Handle image response
                // You might want to display the image in a modal or somewhere else
                console.log("Image generated:", data.image_base64);
            }
        } catch (error) {
            console.error("Lỗi:", error);
            alert("Có lỗi xảy ra khi gọi API: " + error.message);
        }
    };

    return (
        <div className="footer_content">
            <div id="btn_complex">
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="input"
                    rows="4"
                    placeholder="Mô tả những gì bạn muốn tạo"
                />
                <button
                    id="submit_btn"
                    onClick={handleSubmit}
                >
                    Create
                </button>
            </div>
        </div>
    );
};

export default InputBox; 