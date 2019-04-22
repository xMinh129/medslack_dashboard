import React from 'react'
import '../Common/css/Loading.css';

const Loading = () => (
    <div className="loading-box">
        <div className="bouncing-loader">
            <div className="bouncing-loader__round"></div>
            <div className="bouncing-loader__round"></div>
            <div className="bouncing-loader__round"></div>
        </div>
    </div>

);


export default Loading;