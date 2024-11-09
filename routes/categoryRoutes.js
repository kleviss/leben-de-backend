const express = require('express');
const router = express.Router();
const { Category } = require('../models/Category');
const slugify = require('slugify');
const uploaders = require('../middleware/uploadImage');

// GET ALL
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find().lean();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// CREATE
router.post('/', uploaders.category.single('image'), async (req, res, next) => {
  try {
    const { name, description, label } = req.body;
    const imageUrl = req.file ? req.file.location : null;

    const newCategory = {
      _id: slugify(name, { lower: true, strict: true }),
      name,
      description,
      label,
      imageUrl,
    };

    const createdCategory = await Category.create(newCategory);
    res.status(201).json(createdCategory);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'A category with this name already exists' });
    } else {
      next(error);
    }
  }
});

// PATCH
router.patch('/:identifier', uploaders.category.single('image'), async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const updateData = req.body;

    console.log('Request file:', req.file); // Log the file object

    if (req.file && req.file.key) {
      updateData.imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.file.key}`;
    }

    console.log('Update data:', updateData);

    const updatedCategory = await Category.findOneAndUpdate({ _id: identifier }, updateData, {
      new: true,
    });

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    console.error('Error stack:', error.stack);
    res
      .status(500)
      .json({ message: 'An error occurred while updating the category', error: error.message });
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
