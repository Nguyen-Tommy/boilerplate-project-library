/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose');
const book = require('../models/book');

module.exports = function (app) {

  mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB connection error:"));

  const bookModel = require('../models/book');

  app.route('/api/books')
    .get(function (req, res) {
      bookModel.find({}, (err, data) => {
        if (err)
          return console.log(err);
        let books = [];
        data.forEach(book => {
          books.push({ _id: book._id, title: book.title, commentcount: book.commentcount });
        });
        return res.json(books);
      });
    })

    .post(function (req, res) {
      let title = req.body.title;

      if (!title)
        return res.send('missing required field title');
      let book = new bookModel({ title: title });
      book.save((err, data) => {
        if (err)
          return console.log(err);
        return res.json({ _id: data._id, title: data.title });
      });
    })

    .delete(function (req, res) {
      bookModel.deleteMany({}, (err) => {
        if (err)
          return console.log(err);
        return res.send('complete delete successful');
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id;

      if (!bookid)
        return res.send('missing required field id');
      bookModel.findById(bookid, (err, data) => {
        if (err)
          return res.send('no book exists');
        return res.json({ _id: data._id, title: data.title, comments: data.comments });
      });
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!bookid)
        return res.send('missing required field id');
      else if (!comment)
        return res.send('missing required field comment');
      else {
        bookModel.findById(bookid, (err, data) => {
          if (err)
            return res.send('no book exists');
          data.comments.push(comment);
          data.commentcount = ++data.commentcount
          data.save((err, data) => {
            if (err)
              return console.log(err);
            return res.json({ _id: data._id, title: data.title, comments: data.comments });
          });
        });
      }
    })

    .delete(function (req, res) {
      let bookid = req.params.id;

      if (!bookid)
        return res.send('missing required field id');
      bookModel.findByIdAndDelete(bookid, (err) => {
        if (err)
          return res.send('no book exists');
        return res.send('delete successful');
      });
    });

};
