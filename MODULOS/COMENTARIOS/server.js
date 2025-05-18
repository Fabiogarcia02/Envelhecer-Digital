const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

const DB_PATH = path.join(__dirname, "db", "comentarios.json");

app.use(express.json());
app.use(express.static("public"));

app.get("/api/comentarios", (req, res) => {
  const data = fs.readFileSync(DB_PATH, "utf-8");
  res.json(JSON.parse(data));
});

app.post("/api/comentarios", (req, res) => {
  const { jogo, nota, comentario } = req.body;
  const novo = { jogo, nota, comentario };

  const data = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  data.push(novo);
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  res.status(201).json(novo);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
