import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// POST /quizzes - Create a new quiz
app.post("/quizzes", async (req, res) => {
  try {
    const { title, questions } = req.body;

    const quiz = await prisma.quiz.create({
      data: {
        title,
        questions: {
          create: questions.map((q: any) => ({
            type: q.type,
            text: q.text,
            options: q.options ? JSON.stringify(q.options) : null,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Failed to create quiz" });
  }
});

// GET /quizzes - Get all quizzes
app.get("/quizzes", async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        questions: true,
      },
    });

    const quizzesWithCount = quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      questionCount: quiz.questions.length,
      createdAt: quiz.createdAt,
    }));

    res.json(quizzesWithCount);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

// GET /quizzes/:id - Get quiz by ID
app.get("/quizzes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: true,
      },
    });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Parse options from JSON string
    const quizWithParsedOptions = {
      ...quiz,
      questions: quiz.questions.map((q) => ({
        ...q,
        options: q.options ? JSON.parse(q.options) : null,
      })),
    };

    res.json(quizWithParsedOptions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
});

// DELETE /quizzes/:id - Delete quiz
app.delete("/quizzes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.quiz.delete({
      where: { id },
    });

    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete quiz" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
