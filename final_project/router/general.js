const express = require('express');
let books = require("./booksdb.js");
const e = require('express');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {

  const { username, password } = req.body;

  if(users.find(user => user.username === username)) {
    return res.status(400).json({message: "Username Already Exists"});
  }
  if (!username) {
    return res.status(400).json({ message: 'Username Required in Body' });
  }
  if (!password) {
    return res.status(400).json({ message: 'Password Required in Body' });
  } else {
    users.push({
        "username": username,
        "password": password
    });
    return res.status(200).json({message: "User Added"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.status(200).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let filtered_books = Object.values(books).filter(book => book.author === author);
    // Send the filtered_users array as the response to the client
    res.send(filtered_books);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let filtered_books = Object.values(books).filter(book => book.title === title);
    // Send the filtered_users array as the response to the client
    res.send(filtered_books);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
