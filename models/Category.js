const mongoose = require('mongoose');

/**
 * Category Schema
 * @name: String
 * @label: String
 * @img: String
 * @description: String
 */
const categorySchema = new mongoose.Schema({
  name: String,
  label: String,
  img: String,
  description: String,
});

const Category = mongoose.model('Category', categorySchema, 'categories');

module.exports = { Category };
