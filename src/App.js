import React, {useContext, useState} from 'react';
import {Routes, Route } from 'react-router-dom';
import './App.css';
import MainNavigation from './MainNavigation';
import FootballCompetitions from './FootballCompetitions';
import RegisterForm from "./RegisterForm";
import LoginForm from "./login/LoginForm";
import AuthContext, { AuthProvider } from "./AuthContext";
import LeagueSelectPage from "./LeagueSelectPage";
import CommunityPage from "./CommunityPage";
import BoardDetail from "./BoardDetail";


function App() {
    const [isLoginOpen, setLoginOpen] = useState(false);


    const openLoginModal = () => setLoginOpen(true);
    const closeLoginModal = () => setLoginOpen(false);


    return (
        <AuthProvider>
            <MainNavigation/>
            <Routes>
                <Route path="/matchList" element={<FootballCompetitions />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/" element={<LeagueSelectPage />} />
                <Route path="/community/:league" element={<CommunityPage />} />
                <Route path="/boards/:boardId" element={<BoardDetail />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
