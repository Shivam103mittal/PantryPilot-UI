const API_BASE = "http://localhost:8080/api/pantry";

export async function getPantryIngredients() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch pantry ingredients");
  return res.json();
}

export async function addPantryIngredient(ingredient) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ingredient),
  });
  if (!res.ok) throw new Error("Failed to add ingredient");
  return res.json();
}
