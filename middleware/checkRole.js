// Middleware do sprawdzania roli użytkownika
const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Brak uprawnień" });
    }
    next();
  };
};

module.exports = checkRole;
