const express = require('express');
const router = express.Router();
const { Category } = require('../models/Category');

router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find().lean();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

router.post('/:category', async (req, res, next) => {
  try {
    const { category } = req.params;
    const newQuestion = req.body;

    const updatedCategory = await Category.findOneAndUpdate(
      { category },
      {
        $push: { questions: newQuestion },
        $inc: { questionsNumber: 1 },
      },
      { new: true, upsert: true }
    );

    res.status(201).json(updatedCategory);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
