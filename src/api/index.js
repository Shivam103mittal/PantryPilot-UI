export async function getPantryIngredients() {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/pantry`);
  if (!res.ok) throw new Error("Failed to fetch pantry ingredients");
  return res.json();
}

export async function addPantryIngredient(ingredient) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/pantry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ingredient),
  });
  if (!res.ok) throw new Error("Failed to add ingredient");
  return res.json();
}
