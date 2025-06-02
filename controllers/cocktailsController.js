const pool = require("../config/database");

exports.getAllCocktails = async (req, res) => {
  const { ingredient, hasAlcohol, sortBy, page = 1, limit = 100 } = req.query; // parametry do filtrowania, sortowania i paginacji
  let whereClause = [];
  let queryParams = [];

  try {
    if (ingredient) {
      whereClause.push("ingredients.name LIKE ?");
      queryParams.push(`%${ingredient}%`);
    }

    if (hasAlcohol !== undefined) {
      whereClause.push("cocktails.category = ?");
      queryParams.push(
        hasAlcohol === "true"
          ? "Cocktail with Alcohol"
          : "Cocktail without Alcohol"
      );
    }

    let query = `
            SELECT cocktails.id AS cocktail_id, cocktails.name AS cocktail_name, 
                   cocktails.category, cocktails.recipe,
                   ingredients.id AS ingredient_id, ingredients.name AS ingredient_name, 
                   cocktail_ingredient.quantity, cocktail_ingredient.unit
            FROM cocktails
            JOIN cocktail_ingredient ON cocktails.id = cocktail_ingredient.cocktail_id
            JOIN ingredients ON cocktail_ingredient.ingredient_id = ingredients.id
        `;

    if (whereClause.length > 0) {
      query += " WHERE " + whereClause.join(" AND ");
    }

    if (sortBy) {
      if (sortBy === "name") {
        query += " ORDER BY cocktails.name ASC";
      } else if (sortBy === "category") {
        query += " ORDER BY cocktails.category ASC";
      }
    }

    // Paginacja: obliczamy offset i limit
    const offset = (page - 1) * limit; // Liczba rekordów do pominięcia
    query += ` LIMIT ? OFFSET ?`; // Poprawiona składnia LIMIT i OFFSET
    queryParams.push(Number(limit), Number(offset)); // Przypisanie liczb, a nie ciągów

    // Wykonanie zapytania
    const [rows] = await pool.query(query, queryParams);
    const cocktails = [];

    rows.forEach((row) => {
      let cocktail = cocktails.find((c) => c.id === row.cocktail_id);
      if (!cocktail) {
        cocktail = {
          id: row.cocktail_id,
          name: row.cocktail_name,
          category: row.category,
          recipe: row.recipe,
          ingredients: [],
        };
        cocktails.push(cocktail);
      }

      cocktail.ingredients.push({
        id: row.ingredient_id,
        name: row.ingredient_name,
        quantity: row.quantity,
        unit: row.unit,
      });
    });

    res.status(200).json(cocktails);
  } catch (error) {
    console.error("Błąd przy pobieraniu koktajli:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
};

exports.getCocktailById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT cocktails.id AS cocktail_id, cocktails.name AS cocktail_name, 
                    cocktails.category, cocktails.recipe,
                    ingredients.id AS ingredient_id, ingredients.name AS ingredient_name, 
                    cocktail_ingredient.quantity, cocktail_ingredient.unit
             FROM cocktails
             JOIN cocktail_ingredient ON cocktails.id = cocktail_ingredient.cocktail_id
             JOIN ingredients ON cocktail_ingredient.ingredient_id = ingredients.id
             WHERE cocktails.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Koktajl nie znaleziony" });
    }

    const cocktail = {
      id: rows[0].cocktail_id,
      name: rows[0].cocktail_name,
      category: rows[0].category,
      recipe: rows[0].recipe,
      ingredients: [],
    };

    rows.forEach((row) => {
      cocktail.ingredients.push({
        id: row.ingredient_id,
        name: row.ingredient_name,
        quantity: row.quantity,
        unit: row.unit,
      });
    });

    res.status(200).json(cocktail);
  } catch (error) {
    console.error("Błąd przy pobieraniu koktajlu:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
};

exports.createCocktail = async (req, res) => {
  const { name, category, recipe, ingredients } = req.body;

  if (
    !name ||
    !category ||
    !recipe ||
    !ingredients ||
    ingredients.length === 0
  ) {
    return res
      .status(400)
      .json({ message: "Wszystkie pola są wymagane, w tym składniki" });
  }

  try {
    const ingredientNames = ingredients.map((ingredient) => ingredient.name);
    const [existingIngredients] = await pool.query(
      "SELECT id, name FROM ingredients WHERE name IN (?)",
      [ingredientNames]
    );

    if (existingIngredients.length !== ingredients.length) {
      return res
        .status(400)
        .json({ message: "Chleujsie! Najpierw ogarnij sobie składniki" });
    }

    const [result] = await pool.query(
      "INSERT INTO cocktails (name, category, recipe) VALUES (?, ?, ?)",
      [name, category, recipe]
    );

    const cocktailId = result.insertId;

    const values = ingredients.map((ingredient) => {
      const ingredientRecord = existingIngredients.find(
        (i) => i.name === ingredient.name
      );
      return [
        cocktailId,
        ingredientRecord.id,
        ingredient.quantity,
        ingredient.unit,
      ];
    });

    await pool.query(
      "INSERT INTO cocktail_ingredient (cocktail_id, ingredient_id, quantity, unit) VALUES ?",
      [values]
    );

    res
      .status(201)
      .json({ id: cocktailId, message: "Dodano koktajl z składnikami" });
  } catch (error) {
    console.error("Błąd przy dodawaniu koktajlu:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
};

exports.updateCocktail = async (req, res) => {
  const { id } = req.params;
  const { name, category, recipe, ingredients } = req.body;

  if (
    !name ||
    !category ||
    !recipe ||
    !ingredients ||
    ingredients.length === 0
  ) {
    return res
      .status(400)
      .json({ message: "Wszystkie pola są wymagane, w tym składniki" });
  }

  try {
    const [cocktail] = await pool.query(
      "SELECT * FROM cocktails WHERE id = ?",
      [id]
    );
    if (cocktail.length === 0) {
      return res.status(404).json({ message: "Koktajl nie istnieje" });
    }

    await pool.query(
      "UPDATE cocktails SET name = ?, category = ?, recipe = ? WHERE id = ?",
      [name, category, recipe, id]
    );

    const ingredientNames = ingredients.map((ingredient) => ingredient.name);
    const [existingIngredients] = await pool.query(
      "SELECT id, name FROM ingredients WHERE name IN (?)",
      [ingredientNames]
    );

    if (existingIngredients.length !== ingredients.length) {
      return res
        .status(400)
        .json({ message: "Niektóre składniki są niepoprawne" });
    }

    await pool.query("DELETE FROM cocktail_ingredient WHERE cocktail_id = ?", [
      id,
    ]);

    const values = ingredients.map((ingredient) => {
      const ingredientRecord = existingIngredients.find(
        (i) => i.name === ingredient.name
      );
      return [id, ingredientRecord.id, ingredient.quantity, ingredient.unit];
    });

    await pool.query(
      "INSERT INTO cocktail_ingredient (cocktail_id, ingredient_id, quantity, unit) VALUES ?",
      [values]
    );

    res
      .status(200)
      .json({ message: "Koktajl zaktualizowany z nowymi składnikami" });
  } catch (error) {
    console.error("Błąd przy aktualizacji koktajlu:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
};

exports.deleteCocktail = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM cocktails WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Nie znaleziono" });
    res.json({ message: "Usunięto" });
  } catch (error) {
    res.status(500).json({ message: "Błąd serwera" });
  }
};
