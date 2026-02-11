import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import deckRoutes from "./routes/deck.routes.js";
import flashcardRoutes from "./routes/flashcard.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

const app = express();

app.use(express.json());

app.use(cors({
  origin: "*",
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/auth", authRoutes);
app.use("/decks", deckRoutes); 
app.use("/flashcards", flashcardRoutes);
app.use("/api/upload", uploadRoutes);

import path from "path";
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
