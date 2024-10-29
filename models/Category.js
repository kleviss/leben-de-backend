const mongoose = require('mongoose');

/**
 * Category Schema
 * @name: String
 * @label: String
 * @img: String
 * @description: String
 */
const categorySchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  label: String,
  imageUrl: String,
});

const Category = mongoose.model('Category', categorySchema, 'categories');

module.exports = { Category };
