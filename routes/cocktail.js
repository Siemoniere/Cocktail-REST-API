const express = require("express");
const router = express.Router();
const cocktailsController = require("../controllers/cocktailsController");
const verifyToken = require("../middleware/verifyToken");
const checkRole = require("../middleware/checkRole");

router.get("/", verifyToken, cocktailsController.getAllCocktails);
router.get("/:id", verifyToken, cocktailsController.getCocktailById);
router.post(
  "/",
  verifyToken,
  checkRole("admin"),
  cocktailsController.createCocktail
);
router.put(
  "/:id",
  verifyToken,
  checkRole("admin"),
  cocktailsController.updateCocktail
);
router.delete(
  "/:id",
  verifyToken,
  checkRole("admin"),
  cocktailsController.deleteCocktail
);

module.exports = router;
