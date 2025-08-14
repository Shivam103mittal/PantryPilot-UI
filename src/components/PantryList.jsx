import React, { useEffect, useState } from "react";
import { getPantryIngredients } from "../api";

export default function PantryList({ refreshTrigger }) {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const data = await getPantryIngredients();
        setIngredients(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [refreshTrigger]); // Re-fetch whenever refreshTrigger changes

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Pantry Ingredients</h2>
      {ingredients.length === 0 ? (
        <p>No ingredients in pantry</p>
      ) : (
        <ul className="list-disc pl-5">
          {ingredients.map((item) => (
            <li key={item.id}>
              {item.ingredientName} - {item.quantity} {item.unit}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
