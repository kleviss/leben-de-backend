const express = require('express');
const router = express.Router();
const { Category } = require('../models/Category');
const mongoose = require('mongoose');
const slugify = require('slugify');

// GET ALL
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find().lean();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// POST
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

// CREATE
router.post('/', async (req, res, next) => {
  try {
    const newCategory = req.body;

    // Generate _id from the name
    newCategory._id = slugify(newCategory.name, { lower: true, strict: true });

    const createdCategory = await Category.create(newCategory);
    res.status(201).json(createdCategory);
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      res.status(400).json({ message: 'A category with this name already exists' });
    } else {
      next(error);
    }
  }
});

// PATCH
router.patch('/:identifier', async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let query = { _id: identifier };

    const updatedCategory = await Category.findOneAndUpdate(query, req.body, { new: true });

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(updatedCategory);
  } catch (error) {
    next(error);
  }
});

// DELETE
router.delete('/:identifier', async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const deletedCategory = await Category.findOneAndDelete({ _id: identifier });
    res.json(deletedCategory);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
