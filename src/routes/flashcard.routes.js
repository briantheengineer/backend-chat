import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import prisma from "../lib/prisma.js";

const router = Router();

// criar flashcard
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { front, back, deckId } = req.body;
    const userId = req.userId;

    if (!front || !back || !deckId) {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    const flashcard = await prisma.flashcard.create({
      data: {
        front,
        back,
        deckId,
        userId
      }
    });

    return res.status(201).json(flashcard);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno" });
  }
});

export default router;
