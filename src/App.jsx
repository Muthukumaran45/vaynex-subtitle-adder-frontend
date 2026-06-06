import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated
              ? <Navigate to="/home" replace />
              : <Auth onLogin={() => setIsAuthenticated(true)} />
          }
        />
        <Route
          path="/home"
          element={
            isAuthenticated
              ? <Home onLogout={() => setIsAuthenticated(false)} />
              : <Navigate to="/" replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;