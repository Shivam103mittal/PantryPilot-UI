// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import RecipeMatcher from "./components/RecipeMatcher";
import LikedRecipes from "./components/LikedRecipes";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";

// Transition wrapper for pages
const PageWrapper = ({ children }) => {
  return (
    <motion.div
      className="min-h-screen w-full flex flex-col"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Login page */}
        <Route
          path="/login"
          element={
            <PageWrapper>
              <Login />
            </PageWrapper>
          }
        />

        {/* Register page */}
        <Route
          path="/register"
          element={
            <PageWrapper>
              <Register />
            </PageWrapper>
          }
        />

        {/* Protected RecipeMatcher page */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <RecipeMatcher />
              </PageWrapper>
            </ProtectedRoute>
          }
        />

        {/* Protected RecipeMatcher page (alternative route) */}
        <Route
          path="/recipe-matcher"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <RecipeMatcher />
              </PageWrapper>
            </ProtectedRoute>
          }
        />

        {/* Protected LikedRecipes page */}
        <Route
          path="/liked-recipes"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <LikedRecipes />
              </PageWrapper>
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;