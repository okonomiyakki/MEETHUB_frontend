import './App.css';
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

function App() {
    function setScreenSize() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    useEffect(() => {
        setScreenSize();
    });
    return (
        <div>
            <Routes></Routes>
        </div>
    );
}

export default App;
