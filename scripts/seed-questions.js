const mongoose = require("mongoose")
const Question = require("../models/Question")

// Real, meaningful questions for seeding
const sampleQuestions = [
  // General Knowledge Questions
  {
    domain: "General Knowledge",
    category: "Current Affairs",
    difficulty: "Easy",
    question: "Who is the current President of India?",
    options: [
      { text: "Ram Nath Kovind", isCorrect: false },
      { text: "Droupadi Murmu", isCorrect: true },
      { text: "Pranab Mukherjee", isCorrect: false },
      { text: "A.P.J. Abdul Kalam", isCorrect: false },
    ],
    explanation: "Droupadi Murmu is the current President of India, serving since July 2022.",
  },
  {
    domain: "General Knowledge",
    category: "Geography",
    difficulty: "Medium",
    question: "Which is the longest river in the world?",
    options: [
      { text: "Amazon River", isCorrect: true },
      { text: "Nile River", isCorrect: false },
      { text: "Yangtze River", isCorrect: false },
      { text: "Mississippi River", isCorrect: false },
    ],
    explanation: "The Amazon River is considered the longest river in the world at approximately 6,400 km.",
  },
  {
    domain: "General Knowledge",
    category: "History",
    difficulty: "Easy",
    question: "In which year did India gain independence?",
    options: [
      { text: "1945", isCorrect: false },
      { text: "1947", isCorrect: true },
      { text: "1948", isCorrect: false },
      { text: "1950", isCorrect: false },
    ],
    explanation: "India gained independence from British rule on August 15, 1947.",
  },
  {
    domain: "General Knowledge",
    category: "Science",
    difficulty: "Medium",
    question: "What is the chemical symbol for Gold?",
    options: [
      { text: "Go", isCorrect: false },
      { text: "Gd", isCorrect: false },
      { text: "Au", isCorrect: true },
      { text: "Ag", isCorrect: false },
    ],
    explanation: "The chemical symbol for Gold is Au, derived from the Latin word 'aurum'.",
  },
  {
    domain: "General Knowledge",
    category: "Sports",
    difficulty: "Easy",
    question: "How many players are there in a cricket team?",
    options: [
      { text: "10", isCorrect: false },
      { text: "11", isCorrect: true },
      { text: "12", isCorrect: false },
      { text: "13", isCorrect: false },
    ],
    explanation: "A cricket team consists of 11 players on the field at any given time.",
  },

  // Mathematics Questions
  {
    domain: "Mathematics",
    category: "Algebra",
    difficulty: "Easy",
    question: "What is the value of x in the equation 2x + 5 = 15?",
    options: [
      { text: "5", isCorrect: true },
      { text: "10", isCorrect: false },
      { text: "7", isCorrect: false },
      { text: "3", isCorrect: false },
    ],
    explanation: "2x + 5 = 15, so 2x = 10, therefore x = 5.",
  },
  {
    domain: "Mathematics",
    category: "Geometry",
    difficulty: "Medium",
    question: "What is the area of a circle with radius 7 cm? (Use π = 22/7)",
    options: [
      { text: "154 cm²", isCorrect: true },
      { text: "144 cm²", isCorrect: false },
      { text: "164 cm²", isCorrect: false },
      { text: "174 cm²", isCorrect: false },
    ],
    explanation: "Area = πr² = (22/7) × 7² = (22/7) × 49 = 154 cm²",
  },
  {
    domain: "Mathematics",
    category: "Arithmetic",
    difficulty: "Easy",
    question: "What is 15% of 200?",
    options: [
      { text: "25", isCorrect: false },
      { text: "30", isCorrect: true },
      { text: "35", isCorrect: false },
      { text: "40", isCorrect: false },
    ],
    explanation: "15% of 200 = (15/100) × 200 = 30",
  },
  {
    domain: "Mathematics",
    category: "Algebra",
    difficulty: "Medium",
    question: "Solve: 3x - 7 = 2x + 8",
    options: [
      { text: "x = 15", isCorrect: true },
      { text: "x = 12", isCorrect: false },
      { text: "x = 10", isCorrect: false },
      { text: "x = 8", isCorrect: false },
    ],
    explanation: "3x - 7 = 2x + 8 → 3x - 2x = 8 + 7 → x = 15",
  },

  // Aptitude Questions
  {
    domain: "Aptitude",
    category: "Speed and Distance",
    difficulty: "Easy",
    question: "If a train travels 60 km in 1 hour, how far will it travel in 2.5 hours?",
    options: [
      { text: "120 km", isCorrect: false },
      { text: "150 km", isCorrect: true },
      { text: "180 km", isCorrect: false },
      { text: "200 km", isCorrect: false },
    ],
    explanation: "Speed = 60 km/hr, Distance = Speed × Time = 60 × 2.5 = 150 km",
  },
  {
    domain: "Aptitude",
    category: "Percentage",
    difficulty: "Medium",
    question: "What is 25% of 80?",
    options: [
      { text: "15", isCorrect: false },
      { text: "20", isCorrect: true },
      { text: "25", isCorrect: false },
      { text: "30", isCorrect: false },
    ],
    explanation: "25% of 80 = (25/100) × 80 = 20",
  },
  {
    domain: "Aptitude",
    category: "Time and Work",
    difficulty: "Medium",
    question: "If 5 men can complete a work in 10 days, how many days will 10 men take?",
    options: [
      { text: "5 days", isCorrect: true },
      { text: "15 days", isCorrect: false },
      { text: "20 days", isCorrect: false },
      { text: "25 days", isCorrect: false },
    ],
    explanation: "Using inverse proportion: 5 men × 10 days = 10 men × x days, so x = 5 days",
  },
  {
    domain: "Aptitude",
    category: "Profit and Loss",
    difficulty: "Easy",
    question: "If an item is bought for ₹100 and sold for ₹120, what is the profit percentage?",
    options: [
      { text: "15%", isCorrect: false },
      { text: "20%", isCorrect: true },
      { text: "25%", isCorrect: false },
      { text: "30%", isCorrect: false },
    ],
    explanation: "Profit = 120 - 100 = 20, Profit% = (20/100) × 100 = 20%",
  },

  // Reasoning Questions
  {
    domain: "Reasoning",
    category: "Number Series",
    difficulty: "Easy",
    question: "Complete the series: 2, 4, 8, 16, ?",
    options: [
      { text: "24", isCorrect: false },
      { text: "32", isCorrect: true },
      { text: "28", isCorrect: false },
      { text: "20", isCorrect: false },
    ],
    explanation: "Each number is doubled: 2×2=4, 4×2=8, 8×2=16, 16×2=32",
  },
  {
    domain: "Reasoning",
    category: "Coding-Decoding",
    difficulty: "Medium",
    question: "If BOOK is coded as CPPL, how is WORD coded?",
    options: [
      { text: "XPSE", isCorrect: true },
      { text: "XQSE", isCorrect: false },
      { text: "YPSE", isCorrect: false },
      { text: "XPSD", isCorrect: false },
    ],
    explanation: "Each letter is shifted by +1: B→C, O→P, O→P, K→L. So W→X, O→P, R→S, D→E = XPSE",
  },
  {
    domain: "Reasoning",
    category: "Odd One Out",
    difficulty: "Easy",
    question: "Find the odd one out: 3, 5, 7, 9, 12",
    options: [
      { text: "3", isCorrect: false },
      { text: "5", isCorrect: false },
      { text: "9", isCorrect: false },
      { text: "12", isCorrect: true },
    ],
    explanation: "All numbers except 12 are odd numbers. 12 is even.",
  },
  {
    domain: "Reasoning",
    category: "Analogies",
    difficulty: "Medium",
    question: "Book : Author :: Painting : ?",
    options: [
      { text: "Canvas", isCorrect: false },
      { text: "Artist", isCorrect: true },
      { text: "Colors", isCorrect: false },
      { text: "Frame", isCorrect: false },
    ],
    explanation: "A book is created by an author, similarly a painting is created by an artist.",
  },

  // English Questions
  {
    domain: "English",
    category: "Grammar",
    difficulty: "Easy",
    question: "Choose the correct sentence:",
    options: [
      { text: "She don't like coffee", isCorrect: false },
      { text: "She doesn't like coffee", isCorrect: true },
      { text: "She didn't likes coffee", isCorrect: false },
      { text: "She don't likes coffee", isCorrect: false },
    ],
    explanation: 'The correct form is "She doesn\'t like coffee" - third person singular uses "doesn\'t".',
  },
  {
    domain: "English",
    category: "Vocabulary",
    difficulty: "Medium",
    question: 'What is the synonym of "Abundant"?',
    options: [
      { text: "Scarce", isCorrect: false },
      { text: "Plentiful", isCorrect: true },
      { text: "Limited", isCorrect: false },
      { text: "Rare", isCorrect: false },
    ],
    explanation: "Abundant means existing in large quantities; plentiful is the closest synonym.",
  },
  {
    domain: "English",
    category: "Tenses",
    difficulty: "Easy",
    question: 'What is the past tense of "run"?',
    options: [
      { text: "runned", isCorrect: false },
      { text: "ran", isCorrect: true },
      { text: "running", isCorrect: false },
      { text: "runs", isCorrect: false },
    ],
    explanation: 'The past tense of "run" is "ran".',
  },
  {
    domain: "English",
    category: "Antonyms",
    difficulty: "Medium",
    question: 'What is the antonym of "Ancient"?',
    options: [
      { text: "Old", isCorrect: false },
      { text: "Historic", isCorrect: false },
      { text: "Modern", isCorrect: true },
      { text: "Traditional", isCorrect: false },
    ],
    explanation: "Ancient means very old, so its antonym is Modern (contemporary or recent).",
  },
]

// Function to generate additional realistic questions
const generateRealisticQuestions = (domain, difficulty, count) => {
  const questions = []

  const questionSets = {
    "General Knowledge": {
      Easy: [
        {
          question: "What is the capital of France?",
          options: ["London", "Paris", "Berlin", "Madrid"],
          correct: 1,
          explanation: "Paris is the capital and largest city of France.",
        },
        {
          question: "Which planet is known as the Red Planet?",
          options: ["Venus", "Jupiter", "Mars", "Saturn"],
          correct: 2,
          explanation: "Mars is called the Red Planet due to its reddish appearance.",
        },
        {
          question: "How many continents are there?",
          options: ["5", "6", "7", "8"],
          correct: 2,
          explanation:
            "There are 7 continents: Asia, Africa, North America, South America, Antarctica, Europe, and Australia.",
        },
      ],
      Medium: [
        {
          question: "Who wrote the novel 'Pride and Prejudice'?",
          options: ["Charlotte Brontë", "Jane Austen", "Emily Dickinson", "Virginia Woolf"],
          correct: 1,
          explanation: "Jane Austen wrote Pride and Prejudice, published in 1813.",
        },
        {
          question: "What is the largest ocean on Earth?",
          options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
          correct: 3,
          explanation: "The Pacific Ocean is the largest and deepest ocean on Earth.",
        },
      ],
      Hard: [
        {
          question: "In which year was the United Nations established?",
          options: ["1944", "1945", "1946", "1947"],
          correct: 1,
          explanation: "The United Nations was established on October 24, 1945.",
        },
      ],
    },

    
    Mathematics: {
      Easy: [
        {
          question: "What is 12 + 8?",
          options: ["18", "19", "20", "21"],
          correct: 2,
          explanation: "12 + 8 = 20",
        },
        {
          question: "What is 7 × 6?",
          options: ["40", "41", "42", "43"],
          correct: 2,
          explanation: "7 × 6 = 42",
        },
        {
          question: "What is 100 ÷ 4?",
          options: ["20", "25", "30", "35"],
          correct: 1,
          explanation: "100 ÷ 4 = 25",
        },
      ],
      Medium: [
        {
          question: "What is the square root of 144?",
          options: ["10", "11", "12", "13"],
          correct: 2,
          explanation: "√144 = 12 because 12² = 144",
        },
        {
          question: "If x + 3 = 10, what is x?",
          options: ["6", "7", "8", "9"],
          correct: 1,
          explanation: "x + 3 = 10, so x = 10 - 3 = 7",
        },
      ],
      Hard: [
        {
          question: "What is the value of sin(30°)?",
          options: ["1/2", "√3/2", "1", "0"],
          correct: 0,
          explanation: "sin(30°) = 1/2",
        },
      ],
    },



    Aptitude: {
      Easy: [
        {
          question: "A car travels 120 km in 2 hours. What is its speed?",
          options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"],
          correct: 1,
          explanation: "Speed = Distance/Time = 120/2 = 60 km/h",
        },
        {
          question: "What is 20% of 50?",
          options: ["8", "10", "12", "15"],
          correct: 1,
          explanation: "20% of 50 = (20/100) × 50 = 10",
        },
      ],
      Medium: [
        {
          question: "If 3 apples cost ₹15, what is the cost of 7 apples?",
          options: ["₹30", "₹35", "₹40", "₹45"],
          correct: 1,
          explanation: "Cost per apple = 15/3 = ₹5, so 7 apples = 7 × 5 = ₹35",
        },
      ],
      Hard: [
        {
          question: "A sum of money doubles in 8 years at simple interest. In how many years will it triple?",
          options: ["12 years", "16 years", "20 years", "24 years"],
          correct: 1,
          explanation: "If money doubles in 8 years, rate = 12.5% per annum. To triple, it needs 16 years.",
        },
      ],
    },
    Reasoning: {
      Easy: [
        {
          question: "Complete: 1, 4, 7, 10, ?",
          options: ["12", "13", "14", "15"],
          correct: 1,
          explanation: "The series increases by 3 each time: 1+3=4, 4+3=7, 7+3=10, 10+3=13",
        },
        {
          question: "Which is different: Dog, Cat, Lion, Car?",
          options: ["Dog", "Cat", "Lion", "Car"],
          correct: 3,
          explanation: "Car is not an animal, while Dog, Cat, and Lion are animals.",
        },
      ],
      Medium: [
        {
          question: "If CHAIR is coded as 12345, how is RICH coded?",
          options: ["3412", "4312", "4321", "3421"],
          correct: 0,
          explanation: "C=1, H=2, A=3, I=4, R=5. So RICH = 5412 → 3412",
        },
      ],
      Hard: [
        {
          question: "In a certain code, MONDAY is written as NPOEBZ. How is FRIDAY written?",
          options: ["GSJEBZ", "GSJFBZ", "GQJEBZ", "GSJDBZ"],
          correct: 0,
          explanation: "Each letter is shifted by +1 in the alphabet. F→G, R→S, I→J, D→E, A→B, Y→Z",
        },
      ],
    },
    English: {
      Easy: [
        {
          question: "Choose the correct plural of 'Child':",
          options: ["Childs", "Children", "Childes", "Childrens"],
          correct: 1,
          explanation: "The plural of 'child' is 'children'.",
        },
        {
          question: "What is the opposite of 'Hot'?",
          options: ["Warm", "Cool", "Cold", "Mild"],
          correct: 2,
          explanation: "The opposite of 'hot' is 'cold'.",
        },
      ],
      Medium: [
        {
          question: "Choose the correct form: 'I have ___ this book.'",
          options: ["read", "red", "reed", "ride"],
          correct: 0,
          explanation: "The past participle of 'read' is 'read' (pronounced as 'red').",
        },
      ],
      Hard: [
        {
          question: "What is the meaning of 'Ubiquitous'?",
          options: ["Rare", "Present everywhere", "Ancient", "Mysterious"],
          correct: 1,
          explanation: "Ubiquitous means present, appearing, or found everywhere.",
        },
      ],
    },
  }

  const domainQuestions = questionSets[domain]?.[difficulty] || []

  for (let i = 0; i < Math.min(count, domainQuestions.length); i++) {
    const q = domainQuestions[i]
    questions.push({
      domain,
      category: "General",
      difficulty,
      question: q.question,
      options: q.options.map((opt, index) => ({
        text: opt,
        isCorrect: index === q.correct,
      })),
      explanation: q.explanation,
    })
  }

  // Fill remaining with variations if needed
  while (questions.length < count && domainQuestions.length > 0) {
    const baseQ = domainQuestions[questions.length % domainQuestions.length]
    questions.push({
      domain,
      category: "General",
      difficulty,
      question: baseQ.question,
      options: baseQ.options.map((opt, index) => ({
        text: opt,
        isCorrect: index === baseQ.correct,
      })),
      explanation: baseQ.explanation,
    })
  }

  return questions
}

// Main seeding function
const seedQuestions = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/mockpractice"
    await mongoose.connect(mongoUri)
    console.log("Connected to MongoDB:", mongoUri)

    // Clear existing questions
    const deleteResult = await Question.deleteMany({})
    console.log(`Cleared ${deleteResult.deletedCount} existing questions`)

    // Insert sample questions
    const insertedSample = await Question.insertMany(sampleQuestions)
    console.log(`Inserted ${insertedSample.length} sample questions`)

    // Generate additional questions for each domain
    const domains = ["General Knowledge", "Mathematics", "Aptitude", "Reasoning", "English"]
    const difficulties = ["Easy", "Medium", "Hard"]

    for (const domain of domains) {
      for (const difficulty of difficulties) {
        const additionalQuestions = generateRealisticQuestions(domain, difficulty, 15)
        if (additionalQuestions.length > 0) {
          const inserted = await Question.insertMany(additionalQuestions)
          console.log(`Added ${inserted.length} ${difficulty} questions for ${domain}`)
        }
      }
    }

    // Verify the seeding
    const totalQuestions = await Question.countDocuments()
    console.log(`\nTotal questions in database: ${totalQuestions}`)

    // Show count by domain
    for (const domain of domains) {
      const count = await Question.countDocuments({ domain })
      console.log(`${domain}: ${count} questions`)
    }

    console.log("\n✅ Database seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

// Run the seeding
if (require.main === module) {
  seedQuestions()
}

module.exports = { seedQuestions }
