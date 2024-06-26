const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some(user => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    // Rückgabe der Bücherliste als JSON
    return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  const result = Object.values(books).filter(book => book.author.toLowerCase() === author);
  if (result.length > 0) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  const result = Object.values(books).filter(book => book.title.toLowerCase().includes(title));
  if (result.length > 0) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "No reviews found for this book" });
  }
});

//task 10

// Creating a promise method to get the list of books
const getBooks = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books);
        }, 6000);
    });
};

// Console log before calling the promise
console.log("Before calling promise");

// Get the book list available in the shop using Promises
public_users.get('/', function (req, res) {
    getBooks()
        .then((bookList) => {
            console.log("From Callback: Promise resolved");
            return res.status(200).json(bookList);
        })
        .catch((error) => {
            return res.status(500).json({ message: "Error fetching books list" });
        });
});

// Console log after calling the promise
console.log("After calling promise");

//task 11
// Creating a promise method to get book details based on ISBN
const getBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const book = books[isbn];
            if (book) {
                resolve(book);
            } else {
                reject("Book not found");
            }
        }, 6000);
    });
};

// Console log before calling the promise
console.log("Before calling promise");

// Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    getBookByISBN(isbn)
        .then((book) => {
            console.log("From Callback: Promise resolved");
            return res.status(200).json(book);
        })
        .catch((error) => {
            return res.status(404).json({ message: error });
        });
});

// Console log after calling the promise
console.log("After calling promise");

//task 12
// Creating a promise method to get book details based on author
const getBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const result = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
            if (result.length > 0) {
                resolve(result);
            } else {
                reject("No books found by this author");
            }
        }, 6000);
    });
};

// Console log before calling the promise
console.log("Before calling promise");

// Get book details based on author using Promises
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    getBooksByAuthor(author)
        .then((books) => {
            console.log("From Callback: Promise resolved");
            return res.status(200).json(books);
        })
        .catch((error) => {
            return res.status(404).json({ message: error });
        });
});

// Console log after calling the promise
console.log("After calling promise");

//task 13
// Creating a promise method to get book details based on title
const getBooksByTitle = (title) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const result = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
            if (result.length > 0) {
                resolve(result);
            } else {
                reject("No books found with this title");
            }
        }, 6000);
    });
};

// Console log before calling the promise
console.log("Before calling promise");

// Get book details based on title using Promises
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    getBooksByTitle(title)
        .then((books) => {
            console.log("From Callback: Promise resolved");
            return res.status(200).json(books);
        })
        .catch((error) => {
            return res.status(404).json({ message: error });
        });
});

// Console log after calling the promise
console.log("After calling promise");

module.exports.general = public_users;
