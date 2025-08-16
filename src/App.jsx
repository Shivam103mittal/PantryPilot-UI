import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RecipeMatcher from "./components/RecipeMatcher";
import Login from "./components/Login";
import Register from "./components/Register"; // new import
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Register page */}
        <Route path="/register" element={<Register />} />

        {/* Protected RecipeMatcher page */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {/* Full-page container */}
              <div className="min-h-screen w-full flex flex-col">
                <RecipeMatcher />
              </div>
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
