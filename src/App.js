import './App.scss';
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/home/home';
import { Map } from './pages/map';

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
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/map" element={<Map />}></Route>
            </Routes>
        </div>
    );
}

export default App;
