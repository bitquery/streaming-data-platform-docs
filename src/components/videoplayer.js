import React from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = ({ url }) => {
    return (
        <div
            className="bq-video-player"
            style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16 / 9',
                maxHeight: 'min(500px, 56.25vw)',
            }}
        >
            <ReactPlayer
                url={url}
                controls={true}
                playing={false}
                width="100%"
                height="100%"
                style={{ position: 'absolute', inset: 0 }}
            />
        </div>
    );
};

export default VideoPlayer;
