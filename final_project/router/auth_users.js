const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {
        "username": "testuser",
        "password": "password123"
    }
];

// Check if the username is valid
const isValid = (username) => {
    return users.some(user => user.username === username);
};

// Check if the username and password match
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!isValid(username)) {
        return res.status(401).json({ message: "Invalid username" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });
    req.session.token = token;
    req.session.user = username; // Store username in session

    return res.status(200).json({ message: "Login successful", token });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review; // changed from req.query.review to req.body.review

    if (!isbn || !review) {
        return res.status(400).json({ message: "ISBN and review are required" });
    }

    const username = req.session.user; // Get username from session

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book with ISBN not found" });
    }

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Add or update the review
    books[isbn].reviews[username] = review;
    
    return res.status(200).json({
        message: "Review added or updated successfully",
        book: books[isbn],
        user: username
    });
});

// Get book details and reviews based on ISBN
regd_users.get("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    } else {
        return res.status(404).json({ message: "Book with ISBN not found" });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    if (!isbn) {
        return res.status(400).json({ message: "ISBN is required" });
    }

    const username = req.session.user; // Get username from session

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book with ISBN not found" });
    }

    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review by this user not found" });
    }

    // Delete the review
    delete books[isbn].reviews[username];

    return res.status(200).json({
        message: "Review deleted successfully",
        book: books[isbn],
        user: username
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
