const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'ria@12345',
  database: 'recipes',
  connectionLimit: 10
});

// Middleware to parse JSON bodies
app.use(express.json());

// Route to save recipe to the database
// Handle POST request to save recipe
app.post('/save-recipe', (req, res) => {
  const { username, recipeId } = req.body;

  // Insert recipe into MySQL database
  pool.query(
      'INSERT INTO saved_recipes (username, recipeId) VALUES (?, ?)',
      [username, recipeId],
      (error, results) => {
          if (error) {
              console.error('Error saving recipe:', error);
              res.status(500).json({ success: false, error: 'Error saving recipe' });
          } else {
              res.json({ success: true });
          }
      }
  );
});

// Handle GET request to retrieve saved recipes
app.get('/get-saved-recipes', (req, res) => {
  const username = req.query.username;

  // Query MySQL database for saved recipes
  pool.query(
      'SELECT * FROM saved_recipes WHERE username = ?',
      [username],
      (error, results) => {
          if (error) {
              console.error('Error retrieving saved recipes:', error);
              res.status(500).json({ success: false, error: 'Error retrieving saved recipes' });
          } else {
              res.json({ success: true, recipes: results });
          }
      }
  );
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
