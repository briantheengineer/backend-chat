import { Router } from "express";
import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    const emailNormalized = email.toLowerCase().trim();

    const userAlreadyExists = await prisma.user.findUnique({
      where: { email: emailNormalized },
    });

    if (userAlreadyExists) {
      return res.status(409).json({ error: "Email já cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: emailNormalized,
        name,
        password: hashedPassword,
      },
    });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha obrigatórios" });
    }

    const emailNormalized = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: emailNormalized },
    });

    if (!user) {
      return res.status(401).json({ error: "Email ou senha incorreta" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Email ou senha incorreta" });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
