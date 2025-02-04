const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Hardcoded user for testing
const fixedUsername = "bro123";
const fixedPassword = "idklol123";

// Serve static files from the "public" folder
app.use(express.static("public"));

// Root route
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Login Endpoint
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === fixedUsername && password === fixedPassword) {
        // Generate a JWT token
        const token = jwt.sign({ username: fixedUsername }, "your-secret-key", {
            expiresIn: "1h",
        });

        res.status(200).json({ token });
    } else {
        res.status(400).json({ message: "Invalid username or password." });
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

