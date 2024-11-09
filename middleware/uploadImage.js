const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Create a function that returns configured multer middleware
const createUploader = (folderPath) => {
  return multer({
    storage: multerS3({
      s3: s3Client,
      bucket: process.env.AWS_BUCKET_NAME,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, `${folderPath}/` + Date.now().toString() + '-' + file.originalname);
      },
    }),
  });
};

// Create specific uploaders for different purposes
const uploaders = {
  category: createUploader('category-images'),
  question: createUploader('question-images'),
};

module.exports = uploaders;
