import React, { useState, useEffect } from "react";
import { useUIState } from "../context/UIStateContext";
import {
  FaHeart,
  FaTrash,
  FaUtensils,
  FaClock,
  FaArrowLeft,
  FaSignOutAlt,
  FaSearch,
  FaFilter,
  FaTimes
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

// File: src/components/LikedRecipes.jsx

const LikedRecipes = () => {
  const { likedState, setLikedState } = useUIState();

  const [likedRecipes, setLikedRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(likedState.search || "");
  const [sortBy, setSortBy] = useState(likedState.filter || "title");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);

  const userToken = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  // Restore scroll
  useEffect(() => {
    window.scrollTo(0, likedState.scrollY || 0);
  }, []);

  // Save state before unmount
  useEffect(() => {
    return () => {
      setLikedState({
        scrollY: window.scrollY,
        search: searchTerm,
        filter: sortBy, // treat sortBy as "filter" since that's what you're using
      });
    };
  }, [searchTerm, sortBy, setLikedState]);

  useEffect(() => {
    if (userToken) {
      loadLikedRecipes();
    } else {
      navigate("/");
    }
  }, [userToken, navigate]);

  useEffect(() => {
    filterAndSortRecipes();
  }, [likedRecipes, searchTerm, sortBy]);

  const loadLikedRecipes = async () => {
    setLoading(true);
    setError(""); // Clear previous errors

    console.log("Loading liked recipes..."); // Debug log

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/likes`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      console.log("Response status:", response.status); // Debug log

      if (response.ok) {
        const recipes = await response.json();
        console.log("Loaded recipes:", recipes); // Debug log
        setLikedRecipes(recipes);
        setError("");
      } else {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText); // Debug log
        throw new Error(`Failed to load liked recipes: ${response.status}`);
      }
    } catch (err) {
      console.error("Error loading liked recipes:", err);
      setError(`Failed to load your liked recipes: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortRecipes = () => {
    let filtered = [...likedRecipes];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (recipe.ingredients && recipe.ingredients.some(ingredient =>
          ingredient.ingredientName?.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    // Sort recipes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "ingredients":
          const aIngredientCount = a.ingredients ? a.ingredients.length : 0;
          const bIngredientCount = b.ingredients ? b.ingredients.length : 0;
          return bIngredientCount - aIngredientCount;
        case "prepTime":
          const aPrepTime = a.prepTime || 0;
          const bPrepTime = b.prepTime || 0;
          return aPrepTime - bPrepTime;
        default:
          return 0;
      }
    });

    setFilteredRecipes(filtered);
  };

  const formatPrepTime = (minutes) => {
    if (!minutes || minutes === 0) return "N/A";

    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours} hr${hours > 1 ? 's' : ''}`;
      } else {
        return `${hours} hr${hours > 1 ? 's' : ''} ${remainingMinutes} min`;
      }
    }
  };

  const handleUnlikeRecipe = (recipe, event) => {
    event.stopPropagation(); // Prevent navigation when clicking unlike button
    setRecipeToDelete(recipe);
    setShowConfirmDialog(true);
  };

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipes/${recipeId}`);
  };

  const confirmUnlike = async () => {
    if (!recipeToDelete) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/likes/${recipeToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.ok) {
        setLikedRecipes(prev => prev.filter(recipe => recipe.id !== recipeToDelete.id));
        setError("");
      } else {
        throw new Error("Failed to unlike recipe");
      }
    } catch (err) {
      console.error("Error unliking recipe:", err);
      setError("Failed to remove recipe from favorites. Please try again.");
    } finally {
      setShowConfirmDialog(false);
      setRecipeToDelete(null);
    }
  };

  const cancelUnlike = () => {
    setShowConfirmDialog(false);
    setRecipeToDelete(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  const goBackToMatcher = () => {
    navigate("/recipe-matcher"); // Navigate to home route which is RecipeMatcher
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading your favorite recipes...</p>
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
                <h1 className="text-2xl font-bold text-white">Pantry Pilot</h1>
                <p className="text-white/70 text-sm">Liked Recipes</p>
              </div>
            </div>

            {/* User Info and Actions */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="text-white/90 text-sm text-center sm:text-left">
                Welcome, <span className="font-semibold">{username || 'User'}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={goBackToMatcher}
                  className="bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 text-purple-100 px-4 py-2 rounded-xl hover:bg-purple-500/30 transition-all duration-500 ease-in-out flex items-center gap-2 text-sm font-medium"
                >
                  <FaArrowLeft className="text-sm" />
                  Recipe Matcher
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8">
            {/* Title Section */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <FaHeart className="text-red-400 text-3xl" />
                <h2 className="text-3xl sm:text-4xl font-bold text-white">
                  Your Favorite Recipes
                </h2>
                <FaHeart className="text-red-400 text-3xl" />
              </div>
              <p className="text-white/70 text-lg">
                {likedRecipes.length} recipe{likedRecipes.length !== 1 ? 's' : ''} saved for later
              </p>
            </div>

            {/* Search and Filter Section */}
            {likedRecipes.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                    <input
                      type="text"
                      placeholder="Search recipes by name or ingredients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-500 ease-in-out"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <FaFilter className="text-white/70" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-500 ease-in-out"
                    >
                      <option value="title" className="bg-gray-800">Sort by Name</option>
                      <option value="ingredients" className="bg-gray-800">Sort by Ingredients</option>
                      <option value="prepTime" className="bg-gray-800">Sort by Prep Time</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-100 p-4 rounded-xl mb-6 text-center font-medium">
                {error}
              </div>
            )}

            {/* Recipes Grid */}
            {filteredRecipes.length === 0 ? (
              <div className="text-center py-16">
                <FaHeart className="text-6xl text-white/20 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">
                  {likedRecipes.length === 0 ? "No Favorite Recipes Yet" : "No Recipes Found"}
                </h3>
                <p className="text-white/70 text-lg mb-6">
                  {likedRecipes.length === 0
                    ? "Start exploring recipes and save your favorites!"
                    : "Try adjusting your search or filters"}
                </p>
                <button
                  onClick={goBackToMatcher}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-400/50 transition-all duration-500 ease-in-out transform hover:scale-105 font-semibold flex items-center gap-2 mx-auto"
                >
                  <FaSearch /> Discover Recipes
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe, idx) => (
                  <div
                    key={recipe.id}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl hover:bg-white/15 transform hover:scale-105 transition-all duration-500 ease-in-out group relative cursor-pointer"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                    onClick={() => handleRecipeClick(recipe.id)}
                  >
                    {/* Unlike Button */}
                    <button
                      onClick={(e) => handleUnlikeRecipe(recipe, e)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-red-500/20 backdrop-blur-sm border border-red-500/30 hover:bg-red-500/40 transition-all duration-300 transform hover:scale-110 group z-10"
                      title="Remove from favorites"
                    >
                      <FaTrash className="text-red-400 text-sm group-hover:text-red-300 transition-colors duration-300" />
                    </button>

                    {/* Recipe Content */}
                    <div className="pr-12">
                      <div className="flex items-center gap-2 mb-3">
                        <FaClock className="text-purple-400" />
                        <h4 className="font-bold text-lg text-white">
                          {recipe.title}
                        </h4>
                      </div>

                      {/* Prep Time */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 text-blue-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          <FaClock className="text-xs" />
                          {formatPrepTime(recipe.prepTime)}
                        </div>
                      </div>

                      {/* Recipe Instructions Preview */}
                      {recipe.instructions && (
                        <p className="text-white/70 text-sm mb-4 line-clamp-3">
                          {recipe.instructions.length > 150
                            ? `${recipe.instructions.substring(0, 150)}...`
                            : recipe.instructions}
                        </p>
                      )}

                      {/* Ingredients Count */}
                      {recipe.ingredients && recipe.ingredients.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <FaUtensils className="text-green-400 text-sm" />
                            <span className="text-white/80 text-sm font-medium">
                              {recipe.ingredients.length} ingredient{recipe.ingredients.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {recipe.ingredients.slice(0, 3).map((ingredient, iIdx) => (
                              <span
                                key={iIdx}
                                className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 text-green-200 px-2 py-1 rounded-full text-xs font-medium"
                              >
                                {ingredient.quantity} {ingredient.unit} {ingredient.ingredientName}
                              </span>
                            ))}
                            {recipe.ingredients.length > 3 && (
                              <span className="text-white/60 text-xs px-2 py-1">
                                +{recipe.ingredients.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Click hint */}
                      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-purple-300 text-xs font-medium">Click to view details →</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-md mx-4">
            <div className="text-center">
              <FaTrash className="text-red-400 text-3xl mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">
                Remove from Favorites?
              </h3>
              <p className="text-white/70 mb-6">
                Are you sure you want to remove "{recipeToDelete?.title}" from your favorite recipes?
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={cancelUnlike}
                  className="bg-gray-500/20 backdrop-blur-sm border border-gray-500/30 text-gray-100 px-6 py-3 rounded-xl hover:bg-gray-500/30 transition-all duration-300 font-medium flex items-center gap-2"
                >
                  <FaTimes />
                  Cancel
                </button>
                <button
                  onClick={confirmUnlike}
                  className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-100 px-6 py-3 rounded-xl hover:bg-red-500/40 transition-all duration-300 font-medium flex items-center gap-2"
                >
                  <FaTrash />
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LikedRecipes;