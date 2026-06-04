import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { LangProvider } from '@/shared/lib/context/LangContext';
import { UserProvider, useUser } from '@/entities/user/model/UserContext';

// Страницы
import ProjectPage from "@/pages/ProjectPage/ProjectPage"; 
import AtmListPage from "@/pages/AtmListPage/AtmListPage"; 
import AtmEditorPage from "@/pages/AtmEditorPage/AtmEditorPage"; 
import AuthPage from "@/pages/AuthPage/ui/AuthPage";

// Компонент для защиты путей
const PrivateRoute = ({ children }) => {
  const { user } = useUser();
  return user ? children : <Navigate to="/auth" replace />;
};

function AppContent() {
  const { user } = useUser();

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage />} />

      <Route path="/" element={<PrivateRoute><ProjectPage /></PrivateRoute>} />
      
      <Route path="/project/:projectId" element={<PrivateRoute><AtmListPage /></PrivateRoute>} />
      
      <Route path="/project/:projectId/editor/:atmId" element={<PrivateRoute><AtmEditorPage /></PrivateRoute>} />

      <Route path="*" element={<Navigate to={user ? "/" : "/auth"} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <UserProvider>
        <LangProvider>
          <AppContent />
        </LangProvider>
      </UserProvider>
    </Router>
  );
}