const mongoose = require('mongoose');

/**
 * Question Schema
 * @category: String
 * @question: String
 * @options: [String]
 * @answer: String
 * @difficulty: String
 */
const questionSchema = new mongoose.Schema({
  category: String,
  question: String,
  options: [String],
  answer: String,
  difficulty: String,
});

/**
 * Question Schema V2
 * @categoryId: String
 * @question: String
 * @options: [String]
 * @answer: String
 * @difficulty: String
 * @images: [String]
 */
const questionSchemaV2 = new mongoose.Schema({
  categoryId: String,
  question: String,
  options: [String],
  answer: String,
  difficulty: String,
  images: [String],
});

const Question = mongoose.model('Question', questionSchema, 'questions');
const QuestionV2 = mongoose.model('QuestionV2', questionSchemaV2, 'questions_v2');

module.exports = { Question, QuestionV2 };
