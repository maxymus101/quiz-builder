🚀 Quiz Builder Setup Guide
📋 Prerequisites
Make sure you have installed on your computer:

Node.js (version 18 or higher)

npm or yarn

Git

🔧 Setup Steps

1. Clone the Repository
   bash
   git clone <your-repository-url>
   cd quiz-builder
2. Backend Setup
   bash

# Go to backend directory

cd backend

# Install dependencies

npm install

# Set up the database (ONLY FIRST TIME or after schema changes)

npx prisma generate
npx prisma migrate dev --name init

# Start the backend

npm run dev
Backend Check: Open in browser http://localhost:5000/health
You should see: {"status":"OK","message":"Backend is running!"}

3. Frontend Setup
   bash

# Open a new terminal and go to frontend directory

cd frontend

# Install dependencies

npm install

# Start the frontend

npm run dev
Frontend Check: Open in browser http://localhost:3000

⚙️ Configuration
Environment Files
Backend (/backend/.env):

env
DATABASE_URL="file:./dev.db"
PORT=5000
Frontend (/frontend/.env.local):

env
NEXT_PUBLIC_API_URL=http://localhost:5000
🎯 Testing the Application

1. Create Your First Quiz
   Go to the home page: http://localhost:3000

Click "Let's get started"

Fill in:

Quiz Title: "My First Quiz"

Add questions of different types:

True/False

Text Input

Multiple Choice (with several options)

2. View Quizzes
   Go to the "List of Quizzes" page

You'll see your created quiz with the number of questions

You can view details or delete the quiz
