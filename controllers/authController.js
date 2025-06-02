const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");

// Funkcja generująca token JWT
const generateToken = (user) => {
  const payload = {
    userId: user.id,
    role: user.role, // Przechowywanie roli użytkownika
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }); // Token wygasa po 1 godzinie
};

// Funkcja logowania
exports.login = async (req, res) => {
  const { email, password } = req.body; // Oczekujemy danych logowania w ciele zapytania

  try {
    // Sprawdzamy, czy użytkownik istnieje w bazie danych
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Użytkownik nie znaleziony" });
    }

    const user = rows[0]; // Użytkownik z bazy danych

    // Sprawdzamy, czy hasło jest poprawne
    const isMatch = await bcrypt.compare(password, user.password); // Porównanie hasła

    if (!isMatch) {
      return res.status(400).json({ message: "Nieprawidłowe hasło" });
    }

    // Generujemy token JWT
    const token = generateToken(user);

    // Zwracamy token
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};
