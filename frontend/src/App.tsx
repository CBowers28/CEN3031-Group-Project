import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainDashboard from './pages/MainDashboard';

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<MainDashboard />} />
        </Routes>
    );
};

export default App;