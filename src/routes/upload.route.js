import { Router } from "express";
import multer from "multer";
import cloudinary from "../lib/cloudinary.js";

const router = Router();

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: "Erro ao enviar imagem" });
  }
});

export default router;