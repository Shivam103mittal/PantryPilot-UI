import React, { useState, useEffect } from "react";
import { useUIState } from "../context/UIStateContext";
import {
  FaTrash,
  FaPlus,
  FaSyncAlt,
  FaSearch,
  FaUtensils,
  FaClock,
  FaSignOutAlt,
  FaTimes,
  FaHeart,
  FaRegHeart
} from "react-icons/fa";
import { Range, getTrackBackground } from "react-range";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./animations.css"

const RecipeMatcher = () => {
  const { matcherState, setMatcherState } = useUIState();

  const [ingredientName, setIngredientName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [ingredients, setIngredients] = useState(matcherState.ingredients || []);
  const [recipes, setRecipes] = useState(matcherState.recipes || []);
  const [likedRecipes, setLikedRecipes] = useState(new Set()); // Store liked recipe IDs
  const [likedRecipesCount, setLikedRecipesCount] = useState(0); // Track count for header
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [prepTimeRange, setPrepTimeRange] = useState(matcherState.prepTimeRange || [0, 120]);
  const [noMoreRecipes, setNoMoreRecipes] = useState(false);



  const formatTime = (minutes) => {
    if (minutes === 0) return '0 min';
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMins = minutes % 60;
      if (remainingMins === 0) {
        return `${hours}h`;
      }
      return `${hours}h ${remainingMins}m`;
    }
    return `${minutes} min`;
  };

  const getTimeCategory = (min, max) => {
    if (max <= 15) return "Quick & Easy";
    if (max <= 30) return "Fast Meals";
    if (max <= 60) return "Standard Prep";
    return "Elaborate Cooking";
  };

  const navigate = useNavigate();

  // Restore scroll
  useEffect(() => {
    window.scrollTo(0, matcherState.scrollY || 0);
  }, []);

  // Save state on unmount
  useEffect(() => {
    return () => {
      setMatcherState({
        scrollY: window.scrollY,
        ingredients,
        recipes,
        prepTimeRange,
      });
    };
  }, [ingredients, recipes, prepTimeRange, setMatcherState]);


  const quickIngredients = [
    "chicken",
    "rice",
    "tomato",
    "onion",
    "garlic",
    "egg",
    "cheese",
    "pasta",
  ];

  const userToken = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  // Load liked recipes when component mounts
  useEffect(() => {
    if (userToken) {
      loadLikedRecipes();
    }
  }, [userToken]);

  // Function to load liked recipes from backend
  const loadLikedRecipes = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/likes`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.ok) {
        const likedRecipesData = await response.json();
        const likedIds = new Set(likedRecipesData.map(recipe => recipe.id));
        setLikedRecipes(likedIds);
        setLikedRecipesCount(likedRecipesData.length);
      }
    } catch (err) {
      console.error("Failed to load liked recipes:", err);
    }
  };

  // Function to like a recipe
  const likeRecipe = async (recipeId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/likes/${recipeId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.ok) {
        setLikedRecipes(prev => new Set([...prev, recipeId]));
        setLikedRecipesCount(prev => prev + 1);
      } else {
        console.error("Failed to like recipe");
      }
    } catch (err) {
      console.error("Error liking recipe:", err);
    }
  };

  // Function to unlike a recipe
  const unlikeRecipe = async (recipeId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/likes/${recipeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.ok) {
        setLikedRecipes(prev => {
          const newSet = new Set(prev);
          newSet.delete(recipeId);
          return newSet;
        });
        setLikedRecipesCount(prev => Math.max(0, prev - 1));
      } else {
        console.error("Failed to unlike recipe");
      }
    } catch (err) {
      console.error("Error unliking recipe:", err);
    }
  };

  // Toggle like status
  const toggleLike = (recipeId) => {
    if (likedRecipes.has(recipeId)) {
      unlikeRecipe(recipeId);
    } else {
      likeRecipe(recipeId);
    }
  };

  // Navigate to liked recipes page
  const goToLikedRecipes = () => {
    navigate("/liked-recipes");
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIngredients([]);
    setRecipes([]);
    setPrepTimeRange([0, 120]);
    setMatcherState({
      scrollY: 0,
      ingredients: [],
      recipes: [],
      prepTimeRange: [0, 120],
    });
    navigate("/");
  };

  const addIngredient = () => {
    const qty = parseFloat(quantity);

    if (!ingredientName.trim()) {
      setError("Ingredient name is required");
      return;
    }

    if (!quantity || qty <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    setError("");

    setIngredients((prev) => {
      const existing = prev.find(
        (ing) => ing.ingredientName === ingredientName && ing.unit === unit
      );
      if (existing) {
        return prev.map((ing) =>
          ing.ingredientName === ingredientName && ing.unit === unit
            ? { ...ing, quantity: ing.quantity + qty }
            : ing
        );
      } else {
        return [
          ...prev,
          { ingredientName, quantity: qty, unit, id: Date.now() },
        ];
      }
    });

    setIngredientName("");
    setQuantity("");
    setUnit("pcs");
  };

  const quickAdd = (ingredientName) => {
    setIngredients((prev) => {
      const existing = prev.find((ing) => ing.ingredientName === ingredientName);
      if (existing) {
        return prev.map((ing) =>
          ing.ingredientName === ingredientName
            ? { ...ing, quantity: ing.quantity + 1 }
            : ing
        );
      } else {
        return [
          ...prev,
          { ingredientName, quantity: 1, unit: "pcs", id: Date.now() },
        ];
      }
    });
  };

  const removeIngredient = (id) =>
    setIngredients((prev) => prev.filter((ing) => ing.id !== id));
  const clearIngredients = () => setIngredients([]);

  const findRecipes = async () => {
    if (ingredients.length < 3) {
      setMessage("Add at least three ingredients");
      return;
    }
    setLoading(true);
    setRecipes([]);
    setToken(null);
    setMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/matching-recipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          ingredients,
          minPrepTime: prepTimeRange[0],
          maxPrepTime: prepTimeRange[1],
        }),
      });

      if (!response.ok) throw new Error("Error fetching recipes");
      const data = await response.json();
      setToken(data.token);
      setRecipes(data.recipes || []);
      if (!data.recipes?.length) setMessage("No recipes found");
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch recipes");
    } finally {
      setLoading(false);
    }
  };


  const loadMore = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/matching-recipes/${token}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (!response.ok) throw new Error("Error fetching more recipes");
      const data = await response.json();

      // Filter by prep time
      const filteredRecipes = (data.recipes || []).filter(
        (r) => r.prepTime >= prepTimeRange[0] && r.prepTime <= prepTimeRange[1]
      );

      if (filteredRecipes.length === 0) {
        setMessage("Can’t seem to find more for given ingredients");
        setNoMoreRecipes(true);
        return;
      }

      setRecipes((prev) => [...prev, ...filteredRecipes]);

      // Show AI limit message if present
    } catch (err) {
      console.error(err);
      setMessage("Failed to load more recipes");
    } finally {
      setLoading(false);
    }
  };



  const handleKeyPress = (e) => {
    if (e.key === "Enter") addIngredient();
  };

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
                <p className="text-white/70 text-sm">Recipe Matcher</p>
              </div>
            </div>

            {/* User Info and Actions */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="text-white/90 text-sm text-center sm:text-left">
                Welcome, <span className="font-semibold">{username || 'User'}</span>
              </div>
              <div className="flex space-x-2">
                {/* Liked Recipes Button */}
                <button
                  onClick={goToLikedRecipes}
                  className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-100 px-4 py-2 rounded-xl hover:bg-red-500/30 transition-all duration-500 ease-in-out flex items-center gap-2 text-sm font-medium relative"
                  title="View your favorite recipes"
                >
                  <FaHeart className="text-sm" />
                  <span className="hidden sm:inline">Favorites</span>
                  {likedRecipesCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                      {likedRecipesCount > 99 ? '99+' : likedRecipesCount}
                    </span>
                  )}
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-gray-500/20 backdrop-blur-sm border border-gray-500/30 text-gray-100 px-4 py-2 rounded-xl hover:bg-gray-500/30 transition-all duration-500 ease-in-out flex items-center gap-2 text-sm font-medium"
                >
                  <FaSignOutAlt className="text-sm" />
                  <span className="hidden sm:inline">Logout</span>
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
            {/* Title Section */}
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Recipe Matcher
              </h2>
              <p className="text-white/70 text-lg">
                Turn your ingredients into delicious recipes
              </p>
            </div>

            {/* Ingredient Input Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20 fade-transition">
              {error && (
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-100 p-3 rounded-xl mb-4 text-center text-sm animate-shake animate-fadeInDown">
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Enter ingredient name..."
                    value={ingredientName}
                    onChange={(e) => setIngredientName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-500 ease-in-out"
                  />
                </div>
                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="Qty"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-20 px-3 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-500 ease-in-out text-center"
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="px-4 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-500 ease-in-out"
                  >
                    <option value="pcs" className="bg-gray-800">pcs</option>
                    <option value="g" className="bg-gray-800">g</option>
                    <option value="kg" className="bg-gray-800">kg</option>
                    <option value="ml" className="bg-gray-800">ml</option>
                    <option value="l" className="bg-gray-800">l</option>
                    <option value="tbsp" className="bg-gray-800">tbsp</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={addIngredient}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-400/50 transition-all duration-500 ease-in-out transform hover:scale-105 font-semibold"
                >
                  <FaPlus /> Add Ingredient
                </button>
                <button
                  onClick={clearIngredients}
                  className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-red-400/50 transition-all duration-500 ease-in-out transform hover:scale-105 font-semibold"
                >
                  <FaTrash /> Clear All
                </button>
              </div>
            </div>

            {/* Quick Add Section */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-4 text-center text-lg">
                🚀 Quick Add Popular Items
              </h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {quickIngredients.map((ingredient) => (
                  <button
                    key={ingredient}
                    onClick={() => quickAdd(ingredient)}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-500 ease-in-out transform hover:scale-105 font-medium capitalize"
                  >
                    {ingredient}
                  </button>
                ))}
              </div>
            </div>

            {/* Ingredients Display */}
            <div className="mb-6 fade-transition">
              <div className="bg-white/5 backdrop-blur-sm border-2 border-dashed border-white/20 rounded-2xl p-6 min-h-24 fade-transition">
                <div className="text-center text-white/80 font-medium mb-4 fade-transition">
                  {ingredients.length} ingredient{ingredients.length !== 1 ? "s" : ""} added
                </div>

                {ingredients.length === 0 ? (
                  <div className="text-center text-white/50 italic py-4 fade-transition">
                    Start adding ingredients to find matching recipes
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3 justify-center">
                    {ingredients.map((ing) => (
                      <div
                        key={ing.id}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg transition-all duration-500 ease-in-out hover:scale-105 font-medium animate-fadeIn"
                      >
                        <span>
                          {ing.quantity} {ing.unit} {ing.ingredientName}
                        </span>
                        <button
                          onClick={() => removeIngredient(ing.id)}
                          className="text-white hover:text-red-200 transition-colors duration-300 font-bold"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-white/30">
              <div className="text-center mb-6">
                <h3 className="text-white font-bold mb-2 text-xl tracking-wide">
                  ⏱️ Prep Time Filter
                </h3>
              </div>

              <div className="space-y-6">
                {/* Range Slider */}
                <div className="px-4">
                  <Range
                    values={prepTimeRange}
                    step={5}
                    min={0}
                    max={120}
                    onChange={(values) => setPrepTimeRange(values)}
                    renderTrack={({ props, children }) => (
                      <div
                        {...props}
                        className="w-full h-3 rounded-full shadow-inner transition-all duration-200"
                        style={{
                          background: getTrackBackground({
                            values: prepTimeRange,
                            colors: ["#374151", "#8b5cf6", "#374151"],
                            min: 0,
                            max: 120,
                          }),
                        }}
                      >
                        {children}
                      </div>
                    )}
                    renderThumb={({ props, index, isDragged }) => (
                      <div
                        {...props}
                        className={`w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full shadow-lg border-2 border-white/30 transition-all duration-200 cursor-pointer relative ${isDragged ? 'shadow-xl' : ''
                          }`}

                      >
                        {/* Tooltip stays fixed relative to thumb, doesn't scale with it */}
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gray-900/90 text-white text-xs rounded-lg shadow-lg">
                          {formatTime(prepTimeRange[index])}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-gray-900/90"></div>
                        </div>
                      </div>
                    )}

                  />
                </div>

                {/* Time Display */}
                <div className="flex items-center justify-between px-2">
                  <div className="text-center">
                    <div className="text-white/60 text-xs uppercase tracking-wider mb-1">
                      Minimum
                    </div>
                    <div className="text-white font-bold text-lg">
                      {formatTime(prepTimeRange[0])}
                    </div>
                  </div>

                  <div className="flex-1 mx-4 text-center">
                    <div className="text-white/80 text-sm">
                      Recipes taking between{" "}
                      <span className="font-bold text-purple-300">
                        {formatTime(prepTimeRange[0])}
                      </span>{" "}
                      and{" "}
                      <span className="font-bold text-purple-300">
                        {formatTime(prepTimeRange[1])}
                      </span>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-white/60 text-xs uppercase tracking-wider mb-1">
                      Maximum
                    </div>
                    <div className="text-white font-bold text-lg">
                      {formatTime(prepTimeRange[1])}
                    </div>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="border-t border-white/10 pt-4">
                  <div className="text-white/60 text-xs uppercase tracking-wider mb-3 text-center">
                    Quick Presets
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {[
                      { label: "Under 15 min", range: [0, 15] },
                      { label: "15-30 min", range: [15, 30] },
                      { label: "30-60 min", range: [30, 60] },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => setPrepTimeRange(preset.range)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${prepTimeRange[0] === preset.range[0] && prepTimeRange[1] === preset.range[1]
                            ? 'bg-purple-500 text-white shadow-lg scale-105'
                            : 'bg-white/10 text-white/80 hover:bg-white/20 hover:scale-105'
                          }`}
                      >
                        {preset.label}
                      </button>
                    ))}

                  </div>
                </div>

                {/* Reset Button */}
                {(prepTimeRange[0] !== 0 || prepTimeRange[1] !== 60) && (
                  <div className="text-center">
                    <button
                      onClick={() => setPrepTimeRange([0, 120])}
                      className="text-white/60 hover:text-white text-xs underline transition-colors duration-200"
                    >
                      Reset to default range
                    </button>
                  </div>
                )}
              </div>
            </div>


            {/* Find Recipes Button */}
            <button
              onClick={findRecipes}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-2xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-400/50 transition-all duration-500 ease-in-out transform hover:scale-[1.02] flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group mb-6 fade-transition"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
              {loading ? (
                <div className="animate-fadeInDown">
                  <FaSyncAlt className="animate-spin" /> Finding Recipes...
                </div>
              ) : (
                <>
                  <FaSearch /> Find Recipes
                </>
              )}
            </button>

            {/* Message */}
            {message && (
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-100 p-3 rounded-xl mb-6 text-center font-medium animate-shake animate-fadeInDown">
                {message}
              </div>
            )}

            {/* Recipes Grid */}
            {recipes.length > 0 && (
              <div className="animate-fadeInDown">
                <div className="flex items-center justify-center gap-3 mb-6 animate-fadeIn">
                  <FaUtensils className="text-purple-400 text-2xl" />
                  <h3 className="text-2xl font-bold text-white">
                    Matched Recipes
                  </h3>
                  <FaUtensils className="text-purple-400 text-2xl" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recipes.map((recipe, idx) => (
                    <div
                      key={recipe.id || idx}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl hover:bg-white/15 transform hover:scale-105 transition-all duration-500 ease-in-out group animate-fadeIn fade-transition relative cursor-pointer"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                      onClick={() => navigate(`/recipes/${recipe.id}`)} // 👈 navigate on card click
                    >
                      {/* Like/Unlike Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // 👈 prevent navigation when liking
                          toggleLike(recipe.id);
                        }}

                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
                        title={likedRecipes.has(recipe.id) ? "Unlike recipe" : "Like recipe"}
                      >
                        {likedRecipes.has(recipe.id) ? (
                          <FaHeart className="text-red-400 text-lg" />
                        ) : (
                          <FaRegHeart className="text-white/70 hover:text-red-400 text-lg transition-colors duration-300" />
                        )}
                      </button>

                      <div className="flex items-center gap-2 mb-4 pr-12">
                        <FaClock className="text-purple-400" />
                        <h4 className="font-bold text-lg text-white">
                          {recipe.title}
                        </h4>
                      </div>

                      {recipe.matchedIngredients?.length > 0 && (
                        <div>
                          <p className="text-white/70 text-sm mb-3 font-medium">
                            Matching ingredients ({recipe.matchedIngredients.length}):
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {recipe.matchedIngredients.map((mi, miIdx) => (
                              <span
                                key={miIdx}
                                className="bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 text-purple-200 px-3 py-1 rounded-full text-xs font-medium animate-fadeIn"
                                style={{ animationDelay: `${(idx * 0.1) + (miIdx * 0.05)}s` }}
                              >
                                {mi.quantity} {mi.unit} {mi.ingredientName}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {token && (
                  <div className="text-center mt-8 animate-fadeInDown">
                    <button
                      onClick={loadMore}
                      disabled={loading || noMoreRecipes}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-500 ease-in-out transform hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto fade-transition"
                    >
                      {loading ? (
                        <div className="animate-fadeInDown">
                          <FaSyncAlt className="animate-spin" /> Loading...
                        </div>
                      ) : (
                        <>
                          <FaPlus /> Load More Recipes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeMatcher;