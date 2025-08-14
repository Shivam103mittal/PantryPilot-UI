const RECIPE_API_BASE = "http://localhost:8080/api/matching-recipes";

/**
 * Fetch matched recipes from backend.
 * @param {Array} pantryIngredients - Array of objects { ingredientName, quantity, unit }
 * @returns {Promise<{token: string, recipes: Array}>}
 */
export async function fetchMatchedRecipes(pantryIngredients) {
  const res = await fetch(RECIPE_API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pantryIngredients),
  });

  if (!res.ok) throw new Error("Failed to fetch matched recipes");

  return res.json(); // { token: "UUID", recipes: [...] }
}

/**
 * Fetch next batch of recipes for a given token
 * @param {string} token
 * @returns {Promise<{token: string, recipes: Array}>}
 */
export async function fetchNextRecipes(token) {
  const res = await fetch(`${RECIPE_API_BASE}/${token}`);
  if (!res.ok) throw new Error("Failed to fetch next batch of recipes");
  return res.json();
}
