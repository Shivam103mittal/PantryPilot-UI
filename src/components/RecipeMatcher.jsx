import React, { useState } from "react";
import { FaTrash, FaPlus, FaSyncAlt } from "react-icons/fa";
import "./animations.css"; // new file for custom animations

const RecipeMatcher = () => {
  const [ingredientName, setIngredientName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const addIngredient = () => {
    if (!ingredientName || !quantity) return;
    setIngredients([
      ...ingredients,
      { ingredientName, quantity: parseFloat(quantity), unit, id: Date.now() },
    ]);
    setIngredientName("");
    setQuantity("");
    setUnit("pcs");
  };

  const removeIngredient = (id) => {
    setIngredients((prev) => prev.filter((ing) => ing.id !== id));
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-50 to-indigo-50 flex items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          PantryPilot - Recipe Matcher
        </h1>

        {/* Ingredient Input */}
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            type="text"
            placeholder="Ingredient Name"
            value={ingredientName}
            onChange={(e) => setIngredientName(e.target.value)}
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-24 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
          >
            <option value="pcs">pcs</option>
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="ml">ml</option>
            <option value="l">l</option>
            <option value="tbsp">tbsp</option>
          </select>
          <button
            onClick={addIngredient}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:scale-105 transform transition duration-300"
          >
            <FaPlus /> Add
          </button>
          <button
            onClick={clearIngredients}
            className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:scale-105 transform transition duration-300"
          >
            <FaTrash /> Clear All
          </button>
        </div>

        {/* Ingredient Pills */}
        {ingredients.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {ingredients.map((ing) => (
              <div
                key={ing.id}
                className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full flex items-center gap-2 shadow transform transition duration-300 hover:scale-105 animate-fadeIn"
              >
                {ing.ingredientName} - {ing.quantity} {ing.unit}
                <button
                  onClick={() => removeIngredient(ing.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Find Recipes */}
        <button
          onClick={findRecipes}
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg mb-4 hover:bg-indigo-700 transition transform hover:scale-105 flex items-center justify-center gap-2 duration-300"
        >
          <FaSyncAlt /> {loading ? "Finding..." : "Find Recipes"}
        </button>

        {message && (
          <p className="text-center text-red-500 font-semibold mb-4 transition duration-300 animate-pulse">
            {message}
          </p>
        )}

        {/* Recipes Grid */}
        {recipes.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4 transition duration-300 animate-fadeIn">
              Matched Recipes:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recipes.map((recipe, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-xl shadow hover:shadow-lg transform hover:scale-105 transition duration-300 animate-fadeIn"
                >
                  <h3 className="font-bold text-lg text-purple-700 mb-2">
                    {recipe.title}
                  </h3>
                  {recipe.matchedIngredients?.length > 0 && (
                    <ul className="flex flex-wrap gap-2">
                      {recipe.matchedIngredients.map((mi, miIdx) => (
                        <li
                          key={miIdx}
                          className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm transition duration-300 hover:bg-indigo-200"
                        >
                          {mi.ingredientName} - {mi.quantity} {mi.unit}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            {token && (
              <button
                onClick={loadMore}
                className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition transform hover:scale-105 duration-300"
              >
                Load More
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeMatcher;
