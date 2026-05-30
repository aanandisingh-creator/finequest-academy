const express = require('express');
const cors = require('cors');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize SQLite database file in your backend folder
const dbPath = path.join(__dirname, 'finquest.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Database connection error:', err);
    else console.log('Connected safely to SQLite database!');
});

// Create tables automatically if they don't exist yet
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS user_profile (
        id INTEGER PRIMARY KEY,
        username TEXT,
        level INTEGER,
        xp INTEGER,
        streak INTEGER,
        walletBalance REAL
    )`);

    // Insert our starter profile "Alex_Saver" if the database is completely fresh
    db.get("SELECT * FROM user_profile WHERE id = 1", (err, row) => {
        if (!row) {
            db.run(`INSERT INTO user_profile (id, username, level, xp, streak, walletBalance) 
                    VALUES (1, 'Alex_Saver', 1, 120, 4, 250.00)`);
        }
    });
});

// API route to get user data from the database
app.get('/api/user', (req, res) => {
    db.get("SELECT * FROM user_profile WHERE id = 1", (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
});

// API route to handle transactions and update the database permanently
app.post('/api/expense', async (req, res) => {
    const { text, amount } = req.body;

    try {
        // Send data to Python AI server
        const aiResponse = await axios.post('http://127.0.0.1:8000/predict', { text, amount });
        const { category, game_message, xp_reward } = aiResponse.data;

        // Fetch current user data from database to perform math calculations
        db.get("SELECT * FROM user_profile WHERE id = 1", (err, user) => {
            if (err || !user) return res.status(500).json({ error: "User records missing." });

            let newBalance = user.walletBalance - amount;
            let newXp = user.xp + xp_reward;
            let newLevel = user.level;

            // Level up algorithm (Every 200 XP increases user level)
            if (newXp >= 200) {
                newXp = newXp - 200;
                newLevel += 1;
            }

            // Save calculated changes permanently inside database file
            db.run(`UPDATE user_profile SET walletBalance = ?, xp = ?, level = ? WHERE id = 1`,
                [newBalance, newXp, newLevel],
                function(updateErr) {
                    if (updateErr) return res.status(500).json({ error: "Failed to write database." });
                    
                    // Return fresh updated state back to React frontend screen
                    res.json({
                        message: game_message,
                        user: { id: 1, username: user.username, level: newLevel, xp: newXp, streak: user.streak, walletBalance: newBalance }
                    });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error connecting to processing models." });
    }
});

app.listen(5000, () => console.log('Server listening natively on port 5000 with Database enabled'));