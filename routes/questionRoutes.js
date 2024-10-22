const express = require('express');
const router = express.Router();
const { Question, QuestionV2 } = require('../models/Question.js');

router.get('/', async (req, res, next) => {
  try {
    const questions = await Question.find().lean();
    res.json(questions);
  } catch (error) {
    next(error);
  }
});

router.get('/v2', async (req, res, next) => {
  try {
    console.log('Attempting to fetch questions_v2');
    const questions_v2 = await QuestionV2.find().lean();
    console.log(`Fetched ${questions_v2.length} questions`);
    res.json(questions_v2);
  } catch (error) {
    console.error('Error fetching questions_v2:', error);
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
