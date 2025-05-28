const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, "db.json");

// Middleware
app.use(cors());
app.use(express.json());

// Serve arquivos estáticos da pasta 'public' (se você tiver frontend aqui)
app.use(express.static(path.join(__dirname, "public")));

// Rota principal para servir o frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Funções utilitárias para ler e escrever o arquivo db.json
function readDB() {
  try {
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Erro lendo o banco de dados:", err);
    return { ranking: [] };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Erro escrevendo no banco de dados:", err);
  }
}

// GET /ranking retorna o ranking ordenado
app.get("/ranking", (req, res) => {
  const db = readDB();
  const ranking = db.ranking.sort((a, b) => b.pontuacao - a.pontuacao);
  res.json(ranking);
});

// POST /ranking adiciona uma nova pontuação
app.post("/ranking", (req, res) => {
  const { nome, pontuacao } = req.body;

  if (!nome || pontuacao == null) {
    return res.status(400).json({ error: "Nome e pontuação são obrigatórios." });
  }

  const db = readDB();
  db.ranking.push({
    nome,
    pontuacao,
    data: new Date().toISOString().split("T")[0],
  });

  writeDB(db);
  res.status(201).json({ message: "Pontuação salva com sucesso." });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
