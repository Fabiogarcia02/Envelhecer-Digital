const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Ajusta o caminho do db.json para dentro da pasta server
const DB_PATH = path.join(__dirname, "db.json");

// Serve arquivos estáticos da pasta 'public' que está uma pasta acima de 'server'
app.use(express.static(path.join(__dirname, "..", "public")));

// Habilita o CORS e o JSON parsing
app.use(cors());
app.use(express.json());

// Rota principal para servir o frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// Funções para ler e escrever o banco de dados
function readDB() {
  try {
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Erro lendo o banco de dados:", err);
    return { ranking: [], cartas: [] };
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

// NOVA ROTA: GET /cartas
app.get("/cartas", (req, res) => {
  const db = readDB();
  res.json(db.cartas || []);
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
