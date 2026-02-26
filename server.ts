import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "ProfNet API is running" });
  });

  // Mock data for professors
  const professors = [
    { id: 1, name: "Jean Dupont", discipline: "Mathématiques", level: "Lycée", rating: 4.8, availability: "Demain", price: 35, image: "https://picsum.photos/seed/p1/200/200" },
    { id: 2, name: "Marie Curie", discipline: "Physique", level: "Université", rating: 5.0, availability: "Lundi prochain", price: 50, image: "https://picsum.photos/seed/p2/200/200" },
    { id: 3, name: "Luc Besson", discipline: "Cinéma", level: "Tous niveaux", rating: 4.5, availability: "Aujourd'hui", price: 40, image: "https://picsum.photos/seed/p3/200/200" },
    { id: 4, name: "Sophie Germain", discipline: "Mathématiques", level: "Collège", rating: 4.9, availability: "Mardi", price: 30, image: "https://picsum.photos/seed/p4/200/200" },
  ];

  app.get("/api/professors", (req, res) => {
    res.json(professors);
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
