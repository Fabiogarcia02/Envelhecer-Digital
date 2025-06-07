const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('public')); 
app.use(express.json());

const quiz = require('./quiz.json');

app.get('/api/quiz', (req, res) => {
  res.json(quiz);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
