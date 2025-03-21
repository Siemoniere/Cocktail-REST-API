const express = require('express');
const router = express.Router();
const cocktailsController = require('../controllers/cocktailsController');

router.get('/', cocktailsController.getAllCocktails);
router.get('/:id', cocktailsController.getCocktailById);
router.post('/', cocktailsController.createCocktail);
router.put('/:id', cocktailsController.updateCocktail);
router.delete('/:id', cocktailsController.deleteCocktail);

module.exports = router;
