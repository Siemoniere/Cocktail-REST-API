const pool = require('../config/database');

exports.getAllIngredients = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM ingredients');
        res.json(rows);
    } catch (error) {
        console.error("Błąd w bazie danych:", error);
        res.status(500).json({ message: 'Błąd serwera', error: error.message });
    }
};

exports.createIngredient = async (req, res) => {
    try {
        const { name, description, isAlcohol, url } = req.body;
        const [result] = await pool.query(
            'INSERT INTO ingredients (name, description, isAlcohol, url) VALUES (?, ?, ?, ?)',
            [name, description, isAlcohol, url]
        );
        res.json({ id: result.insertId, message: 'Dodano składnik' });
    } catch (error) {
        console.error(" Błąd przy dodawaniu składnika:", error);
        res.status(500).json({ message: 'Błąd serwera', error: error.message });
    }
};

exports.getIngredientById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM ingredients WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Nie znaleziono składnika' });
        res.json(rows[0]);
    } catch (error) {
        console.error(" Błąd w bazie danych:", error);
        res.status(500).json({ message: 'Błąd serwera', error: error.message });
    }
};

exports.updateIngredient = async (req, res) => {
    try {
        const { name, description, isAlcohol, url } = req.body;
        const [result] = await pool.query(
            'UPDATE ingredients SET name = ?, description = ?, isAlcohol = ?, url = ? WHERE id = ?',
            [name, description, isAlcohol, url, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Nie znaleziono składnika' });
        res.json({ message: 'Zaktualizowano składnik' });
    } catch (error) {
        console.error("Błąd przy aktualizacji składnika:", error);
        res.status(500).json({ message: 'Błąd serwera', error: error.message });
    }
};

exports.deleteIngredient = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM ingredients WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Nie znaleziono składnika' });
        res.json({ message: 'Usunięto składnik' });
    } catch (error) {
        console.error("Błąd przy usuwaniu składnika:", error);
        res.status(500).json({ message: 'Błąd serwera', error: error.message });
    }
};
