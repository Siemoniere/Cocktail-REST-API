const express = require('express');
const cocktailsRoutes = require('./routes/cocktail');
const ingredientsRoutes = require('./routes/ingredientsRoutes');

const app = express();
const PORT = 3006;

// Middleware do parsowania JSON
app.use(express.json());

// Podpięcie tras
app.use('/cocktails', cocktailsRoutes);
app.use('/ingredients', ingredientsRoutes);

app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});
