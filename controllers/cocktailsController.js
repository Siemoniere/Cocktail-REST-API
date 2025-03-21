const pool = require('../config/database');

exports.getAllCocktails = async (req, res) => {
    const { ingredient, hasAlcohol, sortBy } = req.query;  // Parametry do filtrowania i sortowania
    let whereClause = [];
    let queryParams = [];

    try {
        // Budowanie zapytania z filtrowaniem
        if (ingredient) {
            whereClause.push("ingredients.name LIKE ?");
            queryParams.push(`%${ingredient}%`);
        }

        if (hasAlcohol !== undefined) {
            whereClause.push("cocktails.category = ?");
            queryParams.push(hasAlcohol === 'true' ? 'Cocktail with Alcohol' : 'Cocktail without Alcohol');
        }

        // Dodawanie warunków do zapytania
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

        // Sortowanie wyników
        if (sortBy) {
            if (sortBy === 'name') {
                query += " ORDER BY cocktails.name ASC";
            } else if (sortBy === 'category') {
                query += " ORDER BY cocktails.category ASC";
            } // Możesz dodać więcej warunków sortowania tutaj
        }

        // Wykonanie zapytania
        const [rows] = await pool.query(query, queryParams);

        const cocktails = [];

        // Grupowanie składników dla każdego koktajlu
        rows.forEach(row => {
            let cocktail = cocktails.find(c => c.id === row.cocktail_id);
            if (!cocktail) {
                cocktail = {
                    id: row.cocktail_id,
                    name: row.cocktail_name,
                    category: row.category,
                    recipe: row.recipe,
                    ingredients: []
                };
                cocktails.push(cocktail);
            }

            cocktail.ingredients.push({
                id: row.ingredient_id,
                name: row.ingredient_name,
                quantity: row.quantity,
                unit: row.unit
            });
        });

        res.status(200).json(cocktails);
    } catch (error) {
        console.error("🔥 Błąd przy pobieraniu koktajli:", error);
        res.status(500).json({ message: 'Błąd serwera', error: error.message });
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
            return res.status(404).json({ message: 'Koktajl nie znaleziony' });
        }

        // Tworzenie obiektu koktajlu z listą składników
        const cocktail = {
            id: rows[0].cocktail_id,
            name: rows[0].cocktail_name,
            category: rows[0].category,
            recipe: rows[0].recipe,
            ingredients: []
        };

        rows.forEach(row => {
            cocktail.ingredients.push({
                id: row.ingredient_id,
                name: row.ingredient_name,
                quantity: row.quantity,
                unit: row.unit
            });
        });

        res.status(200).json(cocktail);
    } catch (error) {
        console.error("🔥 Błąd przy pobieraniu koktajlu:", error);
        res.status(500).json({ message: 'Błąd serwera', error: error.message });
    }
};


exports.createCocktail = async (req, res) => {
    const { name, category, recipe, ingredients } = req.body; // ingredients to tablica obiektów z { name, quantity, unit }

    // Sprawdzenie, czy wszystkie pola są przekazane
    if (!name || !category || !recipe || !ingredients || ingredients.length === 0) {
        return res.status(400).json({ message: 'Wszystkie pola są wymagane, w tym składniki' });
    }

    // Sprawdzenie, czy składniki istnieją w bazie na podstawie nazwy
    try {
        const ingredientNames = ingredients.map(ingredient => ingredient.name); // Lista nazw składników
        const [existingIngredients] = await pool.query(
            'SELECT id, name FROM ingredients WHERE name IN (?)', 
            [ingredientNames]
        );

        // Jeśli któreś składniki nie istnieją, zwróć błąd
        if (existingIngredients.length !== ingredients.length) {
            return res.status(400).json({ message: 'Chleujsie! Najpierw ogarnij sobie składniki' });
        }

        // Dodaj koktajl
        const [result] = await pool.query(
            'INSERT INTO cocktails (name, category, recipe) VALUES (?, ?, ?)', 
            [name, category, recipe]
        );

        const cocktailId = result.insertId;

        // Mapowanie składników do odpowiednich id
        const values = ingredients.map(ingredient => {
            // Znalezienie id składnika po nazwie
            const ingredientRecord = existingIngredients.find(i => i.name === ingredient.name);
            return [
                cocktailId, 
                ingredientRecord.id,  // Teraz używamy id składnika
                ingredient.quantity, 
                ingredient.unit
            ];
        });

        // Dodaj składniki do tabeli cocktail_ingredient
        await pool.query(
            'INSERT INTO cocktail_ingredient (cocktail_id, ingredient_id, quantity, unit) VALUES ?', 
            [values]
        );

        res.status(201).json({ id: cocktailId, message: 'Dodano koktajl z składnikami' });
    } catch (error) {
        console.error("🔥 Błąd przy dodawaniu koktajlu:", error);
        res.status(500).json({ message: 'Błąd serwera', error: error.message });
    }
};


exports.updateCocktail = async (req, res) => {
    const { id } = req.params;  // ID koktajlu, który chcemy zaktualizować
    const { name, category, recipe, ingredients } = req.body; // ingredients to tablica obiektów z { name, quantity, unit }

    // Sprawdzenie, czy wszystkie dane zostały przekazane
    if (!name || !category || !recipe || !ingredients || ingredients.length === 0) {
        return res.status(400).json({ message: 'Wszystkie pola są wymagane, w tym składniki' });
    }

    try {
        // Sprawdź, czy koktajl istnieje
        const [cocktail] = await pool.query('SELECT * FROM cocktails WHERE id = ?', [id]);
        if (cocktail.length === 0) {
            return res.status(404).json({ message: 'Koktajl nie istnieje' });
        }

        // Zaktualizuj dane koktajlu
        await pool.query(
            'UPDATE cocktails SET name = ?, category = ?, recipe = ? WHERE id = ?',
            [name, category, recipe, id]
        );

        // Znajdź ID składników na podstawie ich nazw
        const ingredientNames = ingredients.map(ingredient => ingredient.name); // Lista nazw składników
        const [existingIngredients] = await pool.query(
            'SELECT id, name FROM ingredients WHERE name IN (?)',
            [ingredientNames]
        );

        // Jeśli któreś składniki nie istnieją, zwróć błąd
        if (existingIngredients.length !== ingredients.length) {
            return res.status(400).json({ message: 'Niektóre składniki są niepoprawne' });
        }

        // Usuń istniejące składniki powiązane z koktajlem
        await pool.query(
            'DELETE FROM cocktail_ingredient WHERE cocktail_id = ?',
            [id]
        );

        // Przygotowanie składników do dodania do tabeli cocktail_ingredient
        const values = ingredients.map(ingredient => {
            const ingredientRecord = existingIngredients.find(i => i.name === ingredient.name);
            return [
                id,  // cocktail_id
                ingredientRecord.id,  // ingredient_id
                ingredient.quantity, 
                ingredient.unit
            ];
        });

        // Dodaj nowe składniki do tabeli cocktail_ingredient
        await pool.query(
            'INSERT INTO cocktail_ingredient (cocktail_id, ingredient_id, quantity, unit) VALUES ?',
            [values]
        );

        res.status(200).json({ message: 'Koktajl zaktualizowany z nowymi składnikami' });
    } catch (error) {
        console.error("🔥 Błąd przy aktualizacji koktajlu:", error);
        res.status(500).json({ message: 'Błąd serwera', error: error.message });
    }
};



exports.deleteCocktail = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM cocktails WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Nie znaleziono' });
        res.json({ message: 'Usunięto' });
    } catch (error) {
        res.status(500).json({ message: 'Błąd serwera' });
    }
};
