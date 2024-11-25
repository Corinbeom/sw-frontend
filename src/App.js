import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MainNavigation from './MainNavigation';
import FootballCompetitions from './FootballCompetitions';
import RegisterForm from "./RegisterForm";

function App() {
    return (
        <>
            <MainNavigation />
            <Routes>
                <Route path="/matchList" element={<FootballCompetitions />} />
                <Route path="/register" element={<RegisterForm/>}/>
            </Routes>
        </>
    );
}

export default App;