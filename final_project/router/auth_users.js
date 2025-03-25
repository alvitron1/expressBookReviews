const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    let filtered_users = users.filter((user) => user.username === username);
    return filtered_users.length > 0
}

const authenticatedUser = (username,password)=>{ 
    let foundUser = users.find(user => user.username === username)
    return foundUser.password == password 
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
    if (!username || !isValid(username)) {
        return res.status(400).json({ message: 'Invalid Username' });
    }
    if (!password || !authenticatedUser(username, password)) {
        return res.status(400).json({ message: 'Invalid Password' });
    }

    const token = jwt.sign({ username }, 'mySecret', { expiresIn: '3h' });
    return res.status(200).json({ message: 'Login successful', token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Invalid Authorization' });
    }
    jwt.verify(token, "mySecret", (err, user) => {
        if (!err) {
            const review = req.query.review;
            const isbn = req.params.isbn;

            books[isbn].reviews[user.username] = review;
            return res.status(200).json({ message: "Review Added" })
        } else {
            return res.status(403).json({ message: "User not authenticated" });
        }
    });
});

// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Invalid Authorization' });
    }
    jwt.verify(token, "mySecret", (err, user) => {
        if (!err) {
            const isbn = req.params.isbn;
            delete books[isbn].reviews[user.username];
            return res.status(200).json({ message: "Review Deleted" })
        } else {
            return res.status(403).json({ message: "User not authenticated" });
        }
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
