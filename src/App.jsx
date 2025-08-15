// src/App.jsx
import React from "react";
import RecipeMatcher from "./components/RecipeMatcher";
import logo from "./assets/logo.png"; // Make sure the logo is in src/assets/

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      {/* Logo only */}
      <img src={logo} alt="PantryPilot Logo" className="w-48 mb-6" />

      {/* Recipe Matcher */}
      <div className="max-w-4xl w-full">
        <RecipeMatcher />
      </div>
    </div>
  );
}

export default App;
