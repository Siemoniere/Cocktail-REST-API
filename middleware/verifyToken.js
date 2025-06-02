const jwt = require("jsonwebtoken");

// Middleware weryfikujący token JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Brak tokenu" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Nieprawidłowy token" });
    }

    req.user = decoded; // Zapisujemy dane użytkownika w obiekcie 'req'
    next();
  });
};

module.exports = verifyToken;
