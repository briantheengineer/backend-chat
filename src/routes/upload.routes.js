import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "Nenhuma imagem enviada" });

  const url = `${process.env.SERVER_URL || "http://localhost:5000"}/uploads/${file.filename}`;
  res.json({ url });
});

export default router;
