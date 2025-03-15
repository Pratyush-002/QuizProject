import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/TranslationContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Landing from './components/Landing';
import Login from './components/Login';
import Otp from './components/Otp';
import Quiz from './components/Quiz';
import MyWin from './components/MyWin';
import Leaderboard from './components/Leaderboard';
import './styles/style.css';
import './App.css';
import Upload from './components/Upload';

function App() {
  return (
    <Router>
      <LanguageProvider>
      <AppContent />
      </LanguageProvider>
    </Router>
  );
}

const AppContent = () => {
  const location = useLocation(); // Get the current route location
  const showSidebarRoutes = ['/quizes', '/mywises', '/leaderboard']; // Routes where sidebar should be shown

  // Check if the current route is in the showSidebarRoutes array
  const shouldShowSidebar = showSidebarRoutes.includes(location.pathname);

  return (
    <div className="bg-color">
      {/* Header Component */}
      <Header />

      {/* Main Layout with Sidebar and Content */}
      <div className="d-flex">
        {/* Conditionally render Sidebar */}
        {shouldShowSidebar && <Sidebar />}

        {/* Main Content */}
        <div className={`flex-grow-1 ${shouldShowSidebar ? 'with-sidebar' : ''}`}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/otp" element={<Otp />} />
            <Route path="/quizes" element={<Quiz />} />
            <Route path="/mywins" element={<MyWin />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/upload" element={<Upload />} />
            {/* Add other routes here */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;