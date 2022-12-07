'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: { type: String },
    comments: [{ type: String }],
    commentcount: { type: Number, default: 0 }
}, { versionKey: false });

module.exports = mongoose.model("bookModel", bookSchema);