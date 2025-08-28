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
  FaImage,
  FaEye,
} from "react-icons/fa";
import logo from "../assets/logo.png";
import "./animations.css"

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());

  // NEW: Add these state variables for enhanced features
  const [imageView, setImageView] = useState('grid'); // 'grid', 'list', 'minimal'
  const [showImageModal, setShowImageModal] = useState(null);

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
    navigate("/");
  };

  const goBack = () => {
    navigate(-1);
  };

  const toggleIngredient = (ingredientId) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(ingredientId)) {
      newChecked.delete(ingredientId);
    } else {
      newChecked.add(ingredientId);
    }
    setCheckedIngredients(newChecked);
  };

  // NEW: Image Modal Component
  const ImageModal = ({ ingredient, onClose }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 max-w-md w-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white text-xl"
        >
          ×
        </button>
        <img
          src={ingredient.imageUrl}
          alt={ingredient.ingredientName}
          className="w-full h-64 object-cover rounded-xl mb-4"
        />
        <h3 className="text-white font-bold text-lg mb-2">{ingredient.ingredientName}</h3>
        <p className="text-white/70">{ingredient.quantity} {ingredient.unit}</p>
      </div>
    </div>
  );

  // NEW: Enhanced ingredient rendering function
  const renderIngredients = () => {
    if (imageView === 'grid') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recipe.ingredients?.map((ing, idx) => (
            <div
              key={ing.id}
              className={`backdrop-blur-sm border rounded-xl transition-all duration-300 cursor-pointer hover:scale-105 overflow-hidden ${checkedIngredients.has(ing.id)
                  ? 'bg-green-500/40 border-green-400/60'
                  : 'bg-white/10 border-white/20 hover:bg-white/20'
                }`}
              style={{ animationDelay: `${idx * 0.1}s` }}
              onClick={() => toggleIngredient(ing.id)}
            >
              {/* Image Section */}
              <div className="relative h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                {ing.imageUrl && ing.imageUrl !== "Image not available" ? (
                  <>
                    <img
                      src={ing.imageUrl}
                      alt={ing.ingredientName}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowImageModal(ing);
                      }}
                      className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-all"
                    >
                      <FaEye className="text-xs" />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaImage className="text-white/40 text-3xl" />
                  </div>
                )}

                {/* Checkbox overlay */}
                <div className={`absolute top-2 left-2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center transition-all duration-300 ${checkedIngredients.has(ing.id) ? 'bg-green-400' : 'bg-black/30 backdrop-blur-sm'
                  }`}>
                  {checkedIngredients.has(ing.id) && (
                    <FaCheck className="text-white text-xs" />
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4">
                <h4 className={`font-semibold mb-2 transition-all duration-300 ${checkedIngredients.has(ing.id)
                    ? 'text-green-200 line-through'
                    : 'text-white'
                  }`}>
                  {ing.ingredientName}
                </h4>
                <div className="text-white/70 text-sm">
                  {ing.quantity} {ing.unit}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (imageView === 'list') {
      return (
        <div className="space-y-3">
          {recipe.ingredients?.map((ing, idx) => (
            <div
              key={ing.id}
              className={`backdrop-blur-sm border p-4 rounded-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] ${checkedIngredients.has(ing.id)
                  ? 'bg-green-500/40 border-green-400/60'
                  : 'bg-green-500/20 border-green-400/30 hover:bg-green-500/30'
                }`}
              style={{ animationDelay: `${idx * 0.1}s` }}
              onClick={() => toggleIngredient(ing.id)}
            >
              <div className="flex items-center gap-4">
                {/* Checkbox */}
                <div className={`w-5 h-5 rounded-full border-2 border-green-400 flex items-center justify-center transition-all duration-300 ${checkedIngredients.has(ing.id) ? 'bg-green-400' : ''
                  }`}>
                  {checkedIngredients.has(ing.id) && (
                    <FaCheck className="text-white text-xs" />
                  )}
                </div>

                {/* Image */}
                {ing.imageUrl && ing.imageUrl !== "Image not available" ? (
                  <div className="relative">
                    <img
                      src={ing.imageUrl}
                      alt={ing.ingredientName}
                      className="w-12 h-12 rounded-xl object-cover border border-green-400"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowImageModal(ing);
                      }}
                      className="absolute -top-1 -right-1 bg-purple-500 text-white p-1 rounded-full hover:bg-purple-600 transition-all text-xs"
                    >
                      <FaEye />
                    </button>
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-green-400">
                    <FaImage className="text-green-400/40 text-lg" />
                  </div>
                )}

                {/* Text content */}
                <div className="flex-1">
                  <span className={`font-medium transition-all duration-300 ${checkedIngredients.has(ing.id)
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
      );
    }

    // Minimal view
    return (
      <div className="space-y-2">
        {recipe.ingredients?.map((ing, idx) => (
          <div
            key={ing.id}
            className={`backdrop-blur-sm border p-3 rounded-lg transition-all duration-300 cursor-pointer hover:scale-[1.01] ${checkedIngredients.has(ing.id)
                ? 'bg-green-500/40 border-green-400/60'
                : 'bg-green-500/20 border-green-400/30 hover:bg-green-500/30'
              }`}
            onClick={() => toggleIngredient(ing.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border-2 border-green-400 flex items-center justify-center transition-all duration-300 ${checkedIngredients.has(ing.id) ? 'bg-green-400' : ''
                  }`}>
                  {checkedIngredients.has(ing.id) && (
                    <FaCheck className="text-white text-xs" />
                  )}
                </div>
                <span className={`font-medium transition-all duration-300 ${checkedIngredients.has(ing.id)
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
    );
  };

  const formatInstructions = (instructions) => {
    if (!instructions) return [];
    let steps = instructions.split(/\d+\.\s*/).filter(s => s.trim() !== "");
    if (steps.length <= 1) {
      steps = instructions
        .split(".")
        .map(s => s.trim())
        .filter(s => s !== "");
    }
    return steps;
  };

  // Your existing loading, error, and not found states remain the same...
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
      {/* Your existing animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Your existing header remains the same */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4">
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
            {/* Your existing title section */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <FaClock className="text-purple-400 text-3xl" />
                <h2 className="text-3xl sm:text-4xl font-bold text-white">
                  {recipe.title}
                </h2>
                <FaHeart className="text-red-400 text-3xl" />
              </div>
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
              {/* ENHANCED Ingredients Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                {/* Header with view toggles */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <FaUtensils className="text-green-400" />
                      Ingredients
                    </h3>
                    <div className="text-sm text-white/60">
                      {checkedIngredients.size}/{recipe.ingredients?.length || 0} checked
                    </div>
                  </div>

                  {/* View toggle buttons */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => setImageView('grid')}
                      className={`px-2 py-1 rounded-lg text-xs transition-all ${imageView === 'grid'
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => setImageView('list')}
                      className={`px-2 py-1 rounded-lg text-xs transition-all ${imageView === 'list'
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                    >
                      List
                    </button>
                    <button
                      onClick={() => setImageView('minimal')}
                      className={`px-2 py-1 rounded-lg text-xs transition-all ${imageView === 'minimal'
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                    >
                      Minimal
                    </button>
                  </div>
                </div>

                {renderIngredients()}
              </div>

              {/* Your existing Instructions Section remains the same */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <FaClock className="text-purple-400" />
                  Instructions
                </h3>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <ol className="list-decimal list-inside space-y-2 text-white/90 text-sm sm:text-base">
                    {formatInstructions(recipe.instructions).map((step, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            {/* Your existing Recipe Tips section remains the same */}
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

      {/* Image Modal */}
      {showImageModal && (
        <ImageModal
          ingredient={showImageModal}
          onClose={() => setShowImageModal(null)}
        />
      )}
    </div>
  );
};

export default RecipeDetails;