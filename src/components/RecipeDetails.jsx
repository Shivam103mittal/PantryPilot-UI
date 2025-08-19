// src/components/RecipeDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaUtensils,
  FaClock,
  FaArrowLeft,
  FaSignOutAlt,
  FaHeart,
  FaCheck,
} from "react-icons/fa";
import logo from "../assets/logo.png";
import "./animations.css"

const RecipeDetails = () => {
  const { id } = useParams(); // recipe id from URL
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());
  
  const username = localStorage.getItem("username");
  const userToken = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userToken) {
      navigate("/login");
      return;
    }
    fetchRecipe();
  }, [id, userToken, navigate]);

  const fetchRecipe = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`/api/recipes/${id}`);
      if (!response.ok) throw new Error("Failed to fetch recipe");
      const data = await response.json();
      setRecipe(data);
    } catch (err) {
      console.error("Error fetching recipe:", err);
      setError("Failed to load recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const goBack = () => {
    navigate("/liked-recipes");
  };

  // NEW: Toggle ingredient checked state
  const toggleIngredient = (ingredientId) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(ingredientId)) {
      newChecked.delete(ingredientId);
    } else {
      newChecked.add(ingredientId);
    }
    setCheckedIngredients(newChecked);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-2xl font-bold mb-4">Error Loading Recipe</h2>
          <p className="text-white/70 mb-6">{error}</p>
          <button
            onClick={goBack}
            className="bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 text-purple-100 px-6 py-3 rounded-xl hover:bg-purple-500/30 transition-all duration-500 ease-in-out flex items-center gap-2 mx-auto"
          >
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white/50 text-6xl mb-4">🍽️</div>
          <h2 className="text-white text-2xl font-bold mb-4">Recipe Not Found</h2>
          <p className="text-white/70 mb-6">The recipe you're looking for doesn't exist.</p>
          <button
            onClick={goBack}
            className="bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 text-purple-100 px-6 py-3 rounded-xl hover:bg-purple-500/30 transition-all duration-500 ease-in-out flex items-center gap-2 mx-auto"
          >
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4 mb-2 sm:mb-0">
              <img
                src={logo}
                alt="PantryPilot Logo"
                className="h-14 w-14 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-white">PantryPilot</h1>
                <p className="text-white/70 text-sm">Recipe Details</p>
              </div>
            </div>

            {/* User Info and Actions */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="text-white/90 text-sm text-center sm:text-left">
                Welcome, <span className="font-semibold">{username || "User"}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={goBack}
                  className="bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 text-purple-100 px-4 py-2 rounded-xl hover:bg-purple-500/30 transition-all duration-500 ease-in-out flex items-center gap-2 text-sm font-medium"
                >
                  <FaArrowLeft className="text-sm" />
                  Back
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-100 px-4 py-2 rounded-xl hover:bg-red-500/30 transition-all duration-500 ease-in-out flex items-center gap-2 text-sm font-medium"
                >
                  <FaSignOutAlt className="text-sm" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8">
            {/* Enhanced Title Section */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <FaClock className="text-purple-400 text-3xl" />
                <h2 className="text-3xl sm:text-4xl font-bold text-white">
                  {recipe.title}
                </h2>
                <FaHeart className="text-red-400 text-3xl" />
              </div>
              
              {/* Recipe stats */}
              <div className="flex justify-center gap-6 text-white/70">
                <div className="flex items-center gap-2">
                  <FaUtensils className="text-green-400" />
                  <span className="text-sm font-medium">
                    {recipe.ingredients?.length || 0} ingredients
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-blue-400" />
                  <span className="text-sm font-medium">{recipe.prepTime} mins</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Enhanced Ingredients Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                {/* NEW: Progress indicator for checked ingredients */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <FaUtensils className="text-green-400" />
                    Ingredients
                  </h3>
                  <div className="text-sm text-white/60">
                    {checkedIngredients.size}/{recipe.ingredients?.length || 0} checked
                  </div>
                </div>
                
                <div className="space-y-3">
                  {recipe.ingredients?.map((ing, idx) => (
                    <div
                      key={ing.id}
                      className={`backdrop-blur-sm border p-4 rounded-xl transition-all duration-300 cursor-pointer hover:scale-105 ${
                        checkedIngredients.has(ing.id)
                          ? 'bg-green-500/40 border-green-400/60'
                          : 'bg-green-500/20 border-green-400/30 hover:bg-green-500/30'
                      }`}
                      style={{ animationDelay: `${idx * 0.1}s` }}
                      onClick={() => toggleIngredient(ing.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* NEW: Checkbox indicator */}
                          <div className={`w-5 h-5 rounded-full border-2 border-green-400 flex items-center justify-center transition-all duration-300 ${
                            checkedIngredients.has(ing.id) ? 'bg-green-400' : ''
                          }`}>
                            {checkedIngredients.has(ing.id) && (
                              <FaCheck className="text-white text-xs" />
                            )}
                          </div>
                          <span className={`font-medium transition-all duration-300 ${
                            checkedIngredients.has(ing.id)
                              ? 'text-green-200 line-through'
                              : 'text-green-100'
                          }`}>
                            {ing.ingredientName}
                          </span>
                        </div>
                        <span className="text-green-200 text-sm font-medium bg-green-500/30 px-3 py-1 rounded-full">
                          {ing.quantity} {ing.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions Section - unchanged for now */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <FaClock className="text-purple-400" />
                  Instructions
                </h3>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <p className="text-white/90 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                    {recipe.instructions}
                  </p>
                </div>
              </div>
            </div>

            {/* Recipe Tips */}
            <div className="mt-8 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl border border-yellow-400/20 p-6">
              <h4 className="text-yellow-200 font-bold text-lg mb-3 flex items-center gap-2">
                💡 Cooking Tips
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-yellow-100/80 text-sm">
                <div>• Read all instructions before starting</div>
                <div>• Prep ingredients first</div>
                <div>• Taste and adjust seasonings as needed</div>
                <div>• Don't be afraid to customize!</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;