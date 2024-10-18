// Use the quizdb database
use('quizdb');

// Drop the existing questions collection if it exists
db.questions.drop();

// Create the questions collection
db.createCollection('questions');

// Insert sample data
db.questions.insertMany([
  {
    category: 'Allgemein',
    question: 'In Deutschland dürfen Menschen offen etwas gegen die Regierung sagen, weil…',
    options: [
      'hier Religionsfreiheit gilt.',
      'die Menschen Steuern zahlen.',
      'die Menschen das Wahlrecht haben.',
      'hier Meinungsfreiheit gilt.',
    ],
    answer: 'hier Meinungsfreiheit gilt.',
    difficulty: 'easy',
  },
  {
    category: 'Allgemein',
    question: 'In Deutschland gibt es vier Jahreszeiten. Welche sind das?',
    options: [
      'Sommer, Herbst, Winter, Frühling',
      'Sommer, Herbst, Winter, Vorfrühling',
      'Frühherbst, Spätherbst, Winter, Sommer',
      'Frühlingsanfang, Frühling, Sommer, Winter',
    ],
    answer: 'Sommer, Herbst, Winter, Frühling',
    difficulty: 'easy',
  },
  {
    category: 'Bayern',
    question: 'Welches Volksfest ist weltbekannt und findet jährlich in München statt?',
    options: ['Cannstatter Wasen', 'Oktoberfest', 'Hamburger Dom', 'Bremer Freimarkt'],
    answer: 'Oktoberfest',
    difficulty: 'medium',
  },
]);

// Create indexes for faster queries
db.questions.createIndex({ category: 1 });
db.questions.createIndex({ difficulty: 1 });

// Verify the data
print(db.questions.find().toArray());
