{/*TODO: Implement this thing*/}

import React from 'react';
import {
    EmailShareButton,
    EmailIcon,
    FacebookShareButton,
    FacebookIcon,
} from "react-share";

const ImageShare = ({ imgId, title }) => {
  const shareUrl = imgId;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => alert("Link copied to clipboard!"))
      .catch(() => alert("Failed to copy link."));
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: 'Check this out!',
          url: shareUrl,
        });
      } catch (error) {
        alert("Sharing failed.");
      }
    } else {
      alert("Web Share API not supported.");
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow-md max-w-md">
      <h2 className="text-xl font-semibold mb-2">Share this {title}</h2>
      <div className="flex flex-col gap-2">
        <button
          onClick={handleCopyLink}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Copy Share Link
        </button>

        <FacebookShareButton
          url={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-700 text-white px-4 py-2 rounded text-center hover:bg-blue-800"
        >
          Share on Facebook
        </FacebookShareButton>

        <WorkplaceShareButton
          onClick={handleWebShare}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Share via Web Share API
        </WorkplaceShareButton>
      </div>
    </div>
  );
};


export default ImageShare;