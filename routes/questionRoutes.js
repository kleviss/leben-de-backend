const express = require('express');
const router = express.Router();
const { Question, QuestionV2 } = require('../models/Question.js');
const uploaders = require('../middleware/uploadImage');

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

router.patch(
  '/v2/:id',
  uploaders.question.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
  ]),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Parse arrays if they're strings
      if (typeof updateData.options === 'string') {
        updateData.options = JSON.parse(updateData.options);
      }
      if (typeof updateData.images === 'string') {
        updateData.images = JSON.parse(updateData.images);
      }

      // Handle new image uploads
      if (req.files) {
        const uploadedImages = Object.values(req.files)
          .flat()
          .map(
            (file) =>
              `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.key}`
          );

        // If there are existing images, combine them with new uploads
        updateData.images = [...(updateData.images || []), ...uploadedImages];
      }

      // If hasImages is false, clear the images array
      if (updateData.hasImages === 'false') {
        updateData.images = [];
      }

      const updatedQuestion = await QuestionV2.findByIdAndUpdate(id, updateData, { new: true });

      if (!updatedQuestion) {
        return res.status(404).json({ message: 'Question not found' });
      }

      res.json(updatedQuestion);
    } catch (error) {
      console.error('Error updating question:', error);
      res.status(500).json({
        message: 'An error occurred while updating the question',
        error: error.message,
      });
    }
  }
);

router.post(
  '/v2',
  uploaders.question.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
  ]),
  async (req, res, next) => {
    try {
      const questionData = req.body;

      // Parse string arrays back to actual arrays if they were stringified
      if (typeof questionData.options === 'string') {
        questionData.options = JSON.parse(questionData.options);
      }

      // Handle uploaded images
      if (req.files) {
        questionData.images = Object.values(req.files)
          .flat()
          .map(
            (file) =>
              `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.key}`
          );
      }

      const newQuestion = await QuestionV2.create(questionData);
      res.status(201).json(newQuestion);
    } catch (error) {
      console.error('Error creating question:', error);
      res.status(500).json({
        message: 'An error occurred while creating the question',
        error: error.message,
      });
    }
  }
);

router.patch('/v2/:id/images', uploaders.question.array('images', 5), async (req, res, next) => {
  try {
    const { id } = req.params;
    const question = await QuestionV2.findById(id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (!question.images) {
      question.images = [];
    }

    // Add all uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(
        (file) =>
          `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.key}`
      );
      question.images.push(...newImages);
    }

    await question.save();
    res.json(question);
  } catch (error) {
    console.error('Error updating question images:', error);
    res.status(500).json({
      message: 'An error occurred while updating the question images',
      error: error.message,
    });
  }
});

module.exports = router;
