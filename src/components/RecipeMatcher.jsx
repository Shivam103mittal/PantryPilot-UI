import React, { useState } from "react";
import { FaTrash, FaPlus, FaSyncAlt, FaSearch, FaUtensils, FaClock } from "react-icons/fa";
import "./animations.css";

const RecipeMatcher = () => {
  const [ingredientName, setIngredientName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(""); // Error state
  const [loading, setLoading] = useState(false);

  // Quick add ingredients
  const quickIngredients = [
    "chicken", "rice", "tomato", "onion", "garlic", "egg", "cheese", "pasta"
  ];

  // Add ingredient manually with validation
  const addIngredient = () => {
    const qty = parseFloat(quantity);

    // Validation: check ingredient name
    if (!ingredientName.trim()) {
      setError("Ingredient name is required");
      return;
    }

    // Validation: quantity
    if (!quantity || qty <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    // Clear previous error
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
        return [...prev, { ingredientName, quantity: qty, unit, id: Date.now() }];
      }
    });

    setIngredientName("");
    setQuantity("");
    setUnit("pcs");
  };

  // Quick Add button handler
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
        return [...prev, { ingredientName, quantity: 1, unit: "pcs", id: Date.now() }];
      }
    });
  };

  const removeIngredient = (id) => setIngredients((prev) => prev.filter((ing) => ing.id !== id));
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
        headers: { "Content-Type": "application/json" },
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
      const response = await fetch(`/api/matching-recipes/${token}`);
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
    if (e.key === 'Enter') addIngredient();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-start justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-4xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-600"></div>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-3">
            Recipe Matcher
          </h1>
          <p className="text-gray-600 text-lg">Turn your ingredients into delicious recipes</p>
        </div>

        {/* Ingredient Input */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-6 border-2 border-gray-100 transition-all duration-300 hover:border-purple-200">
          {error && (
            <div className="text-red-600 mb-2 font-medium animate-fadeIn">
              {error}
            </div>
          )}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Enter ingredients (e.g., chicken, rice)"
                value={ingredientName}
                onChange={(e) => setIngredientName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-purple-300 focus:border-purple-400 transition-all duration-300 text-lg bg-white"
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
                className="w-20 p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-purple-300 focus:border-purple-400 transition-all duration-300 text-center bg-white"
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-purple-300 focus:border-purple-400 transition-all duration-300 bg-white cursor-pointer"
              >
                <option value="pcs">pcs</option>
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="ml">ml</option>
                <option value="l">l</option>
                <option value="tbsp">tbsp</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={addIngredient}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:scale-105 hover:shadow-lg transform transition-all duration-300 font-semibold"
            >
              <FaPlus /> Add Ingredient
            </button>
            <button
              onClick={clearIngredients}
              className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:scale-105 hover:shadow-lg transform transition-all duration-300 font-semibold"
            >
              <FaTrash /> Clear All
            </button>
          </div>
        </div>

        {/* Quick Add */}
        <div className="mb-6">
          <h3 className="text-center text-gray-700 font-semibold mb-4 text-lg">
            🚀 Quick Add Popular Items
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {quickIngredients.map((ingredient) => (
              <button
                key={ingredient}
                onClick={() => quickAdd(ingredient)}
                className="bg-gray-100 hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-600 hover:text-white text-gray-700 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-md font-medium capitalize"
              >
                {ingredient}
              </button>
            ))}
          </div>
        </div>

        {/* Ingredients Display */}
        <div className="mb-6">
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-6 min-h-24 transition-all duration-300">
            <div className="text-center text-gray-600 font-medium mb-4">
              {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''} added
            </div>
            
            {ingredients.length === 0 ? (
              <div className="text-center text-gray-400 italic text-lg py-4">
                Start adding ingredients to find matching recipes
              </div>
            ) : (
              <div className="flex flex-wrap gap-3 justify-center">
                {ingredients.map((ing) => (
                  <div
                    key={ing.id}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-full flex items-center gap-3 shadow-lg transform transition-all duration-300 hover:scale-105 animate-fadeIn font-medium"
                  >
                    <span>{ing.quantity} {ing.unit} {ing.ingredientName}</span>
                    <button
                      onClick={() => removeIngredient(ing.id)}
                      className="text-white hover:text-red-200 transition-colors duration-200 font-bold"
                    >
                      ×
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
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold py-4 rounded-2xl mb-4 hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
        >
          {loading ? (
            <>
              <FaSyncAlt className="animate-spin" /> Finding Recipes...
            </>
          ) : (
            <>
              <FaSearch /> Find Recipes
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transform -skew-x-12 transition-opacity duration-500"></div>
        </button>

        {/* Message */}
        {message && (
          <div className="text-center bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 font-medium animate-fadeIn">
            {message}
          </div>
        )}

        {/* Recipes Grid */}
        {recipes.length > 0 && (
          <div className="animate-fadeIn">
            <div className="flex items-center justify-center gap-3 mb-6">
              <FaUtensils className="text-purple-600 text-2xl" />
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                Matched Recipes
              </h2>
              <FaUtensils className="text-purple-600 text-2xl" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe, idx) => (
                <div
                  key={idx}
                  className="bg-white border-2 border-gray-100 p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-fadeIn hover:border-purple-200 group"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <FaClock className="text-purple-500 group-hover:text-purple-600 transition-colors duration-300" />
                    <h3 className="font-bold text-xl text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
                      {recipe.title}
                    </h3>
                  </div>
                  
                  {recipe.matchedIngredients?.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-3 font-medium">
                        Matching ingredients ({recipe.matchedIngredients.length}):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {recipe.matchedIngredients.map((mi, miIdx) => (
                          <span
                            key={miIdx}
                            className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 px-3 py-1 rounded-full text-sm transition-all duration-300 hover:from-purple-200 hover:to-indigo-200 font-medium border border-purple-200"
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
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
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
  );
};

export default RecipeMatcher;
