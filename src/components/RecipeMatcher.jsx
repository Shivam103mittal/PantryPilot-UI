import React, { useState } from "react";
import {
  FaTrash,
  FaPlus,
  FaSyncAlt,
  FaSearch,
  FaUtensils,
  FaClock,
  FaSignOutAlt,
  FaTimes
} from "react-icons/fa";
import logo from "../assets/logo.png";


const RecipeMatcher = () => {
  const [ingredientName, setIngredientName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/login"; // redirect to login page
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
    if (!ingredients.length) {
      setMessage("Add at least one ingredient");
      return;
    }
    setLoading(true);
    setRecipes([]);
    setToken(null);
    setMessage("");

    try {
      const response = await fetch("/api/matching-recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(ingredients),
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
      const response = await fetch(`/api/matching-recipes/${token}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (!response.ok) throw new Error("Error fetching more recipes");
      const data = await response.json();
      setRecipes((prev) => [...prev, ...(data.recipes || [])]);
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
                <h1 className="text-2xl font-bold text-white">PantryPilot</h1>
                <p className="text-white/70 text-sm">Recipe Matcher</p>
              </div>
            </div>

            {/* User Info and Logout */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="text-white/90 text-sm text-center sm:text-left">
                Welcome, <span className="font-semibold">{username || 'User'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-100 px-4 py-2 rounded-xl hover:bg-red-500/30 transition-all duration-300 flex items-center gap-2 text-sm font-medium"
              >
                <FaSignOutAlt className="text-sm" />
                Logout
              </button>
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
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20">
              {error && (
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-100 p-3 rounded-xl mb-4 text-center text-sm animate-shake">
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
                    className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
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
                    className="w-20 px-3 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 text-center"
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="px-4 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
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
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-400/50 transition-all duration-300 transform hover:scale-105 font-semibold"
                >
                  <FaPlus /> Add Ingredient
                </button>
                <button
                  onClick={clearIngredients}
                  className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-red-400/50 transition-all duration-300 transform hover:scale-105 font-semibold"
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
                    className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-105 font-medium capitalize"
                  >
                    {ingredient}
                  </button>
                ))}
              </div>
            </div>

            {/* Ingredients Display */}
            <div className="mb-6">
              <div className="bg-white/5 backdrop-blur-sm border-2 border-dashed border-white/20 rounded-2xl p-6 min-h-24">
                <div className="text-center text-white/80 font-medium mb-4">
                  {ingredients.length} ingredient{ingredients.length !== 1 ? "s" : ""} added
                </div>

                {ingredients.length === 0 ? (
                  <div className="text-center text-white/50 italic py-4">
                    Start adding ingredients to find matching recipes
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3 justify-center">
                    {ingredients.map((ing) => (
                      <div
                        key={ing.id}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg transform transition-all duration-300 hover:scale-105 font-medium"
                      >
                        <span>
                          {ing.quantity} {ing.unit} {ing.ingredientName}
                        </span>
                        <button
                          onClick={() => removeIngredient(ing.id)}
                          className="text-white hover:text-red-200 transition-colors duration-200 font-bold"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Find Recipes Button */}
            <button
              onClick={findRecipes}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-2xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-400/50 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group mb-6"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              {loading ? (
                <>
                  <FaSyncAlt className="animate-spin" /> Finding Recipes...
                </>
              ) : (
                <>
                  <FaSearch /> Find Recipes
                </>
              )}
            </button>

            {/* Message */}
            {message && (
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-100 p-3 rounded-xl mb-6 text-center font-medium animate-shake">
                {message}
              </div>
            )}

            {/* Recipes Grid */}
            {recipes.length > 0 && (
              <div>
                <div className="flex items-center justify-center gap-3 mb-6">
                  <FaUtensils className="text-purple-400 text-2xl" />
                  <h3 className="text-2xl font-bold text-white">
                    Matched Recipes
                  </h3>
                  <FaUtensils className="text-purple-400 text-2xl" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recipes.map((recipe, idx) => (
                    <div
                      key={idx}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl hover:bg-white/15 transform hover:scale-105 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-2 mb-4">
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
                                className="bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 text-purple-200 px-3 py-1 rounded-full text-xs font-medium"
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
                  <div className="text-center mt-8">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                    >
                      {loading ? (
                        <>
                          <FaSyncAlt className="animate-spin" /> Loading...
                        </>
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

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default RecipeMatcher;