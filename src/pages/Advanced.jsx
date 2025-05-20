import React from 'react';
import { useNavigate } from 'react-router-dom';

const Advanced = () => {
    const navigate = useNavigate();

    return (
        <div className="advanced-container">
            <div className="advanced-section">
                <h2>Cài đặt nâng cao</h2>
                <div className="setting-group">
                    <label>Chất lượng âm thanh</label>
                    <select>
                        <option>Thấp</option>
                        <option>Trung bình</option>
                        <option>Cao</option>
                    </select>
                </div>
                <div className="setting-group">
                    <label>Định dạng đầu ra</label>
                    <select>
                        <option>MP3</option>
                        <option>WAV</option>
                        <option>OGG</option>
                    </select>
                </div>
                <div className="setting-group">
                    <label>Kích thước hình ảnh</label>
                    <select>
                        <option>512x512</option>
                        <option>768x768</option>
                        <option>1024x1024</option>
                    </select>
                </div>
                <button
                    className="fixed-button"
                    onClick={() => navigate('/generate')}
                    style={{ marginTop: '20px' }}
                >
                    Quay lại
                </button>
            </div>
        </div>
    );
};

export default Advanced; 