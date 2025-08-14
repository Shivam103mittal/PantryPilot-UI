// src/App.jsx
import React from "react";
import RecipeMatcher from "./components/RecipeMatcher";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">PantryPilot</h1>
      <div className="max-w-4xl mx-auto">
        <RecipeMatcher />
      </div>
    </div>
  );
}

export default App;
