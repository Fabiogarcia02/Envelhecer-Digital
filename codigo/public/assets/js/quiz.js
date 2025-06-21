let quiz = [];
let perguntaIndex = 0;
let pontuacaoTotal = 0;
let nivelAtual = 1;

const usuarioCorrente = JSON.parse(localStorage.getItem("usuarioCorrente"));
window.onload = () => {
  if (!usuarioCorrente || !usuarioCorrente.id) {
    alert("Você precisa estar logado para jogar.");
    window.location.href = 'login.html';
    return;
  }
  carregarQuiz();
}
const idUsuario = usuarioCorrente.id;

async function carregarQuiz() {
  const usuarioCorrente = JSON.parse(localStorage.getItem("usuarioCorrente"));
  if (!usuarioCorrente || !usuarioCorrente.id) {
    alert("Você precisa estar logado para jogar.");
    window.location.href = 'login.html';
    return;
  }
  try {
    const resposta = await fetch("http://localhost:3000/jogos");
    const dados = await resposta.json();

    const jogoQuiz = dados.find(j => j.tipo === "quiz");
    if (!jogoQuiz) return;

    const nivel = jogoQuiz.niveis.find(n => n.nivel === nivelAtual);
    if (!nivel || !nivel.pergunta || !Array.isArray(nivel.respostas)) {
      console.error("Nível não encontrado ou incompleto.");
      return;
    }

    // Converte a pergunta única do nível para um array
    quiz = [
      {
        pergunta: nivel.pergunta,
        respostas: nivel.respostas
      }
    ];

    renderQuiz();
  } catch (erro) {
    console.log("Erro ao carregar as perguntas:", erro);
  }
}


function renderQuiz() {
  let container = document.querySelector(".container");

  if (perguntaIndex >= quiz.length) {
    container.innerHTML = `
      <header><h1>QUIZ FINALIZADO</h1></header>
      <section class="question-box">
        <h2>Parabéns!</h2>
        <p class="question-text">Você acertou <strong>${pontuacaoTotal}</strong> de <strong>${quiz.length}</strong> perguntas.</p>
      </section>
      <footer>
        <button class="next-button" onclick="reiniciarQuiz()">Refazer Quiz</button>
      </footer>
    `;
    verificarConquistas();
    return;
  }

  let perguntaAtual = quiz[perguntaIndex];

  container.innerHTML = `
    <header><h1>QUIZ</h1></header>
    <section class="question-box">
      <h2>PERGUNTA ${perguntaIndex + 1}</h2>
      <p class="question-text" onmouseover="lerTexto(this.innerText)">
        ${perguntaAtual.pergunta}
      </p>
    </section>
    <div class="options-grid">
      ${perguntaAtual.respostas.map((resp, i) => `
        <button class="icon-button" onclick="responder(${i})" onmouseover="lerTexto('${resp.texto}')">
          ${resp.texto}
        </button>
      `).join("")}
    </div>
    <footer>
      <button class="next-button" onclick="avancar()">PRÓXIMO</button>
    </footer>
  `;
}

function responder(indiceResposta) {
  let pergunta = quiz[perguntaIndex];
  if (pergunta.respondido) return;

  pergunta.respondido = true;

  if (pergunta.respostas[indiceResposta].correta) {
    pontuacaoTotal++;
    alert("✅ Acertou! +1 ponto");
  } else {
    alert("❌ Errou. Nenhum ponto.");
  }
}

function avancar() {
  perguntaIndex++;
  renderQuiz();
}

function reiniciarQuiz() {
  perguntaIndex = 0;
  pontuacaoTotal = 0;
  quiz.forEach(p => p.respondido = false);
  renderQuiz();
}

function lerTexto(texto) {
  const voz = window.speechSynthesis;
  if (voz.speaking) voz.cancel();
  const fala = new SpeechSynthesisUtterance(texto);
  fala.lang = "pt-BR";
  voz.speak(fala);
}

async function verificarConquistas() {
  // Buscar conquistas já adquiridas pelo usuário
  const conquistasExistentes = await fetch(`http://localhost:3000/conquistasUsuarios?idUsuario=${idUsuario}`)
    .then(res => res.json())
    .catch(() => []);

  const idsExistentes = conquistasExistentes.map(c => Number(c.idAchievement));

  // Buscar dados do quiz
  const quiz = await fetch("http://localhost:3000/quiz").then(r => r.json());

  const novasConquistas = [];

  // Conquista ID 1 – Sabe tudo (acertar 5 perguntas com no máx. 1 erro cada)
  const quizRespondidas = quiz.filter(q => q.nivel <= 5);
  const acertouSabeTudo = quizRespondidas.every(q => {
    const certa = q.respostas.find(r => r.correta);
    return certa && (certa.erros ?? 0) <= 1;
  });

  if (acertouSabeTudo && !idsExistentes.includes(1)) {
    novasConquistas.push(1);
  }

  // Enviar novas conquistas para o backend
  for (const idAchievement of novasConquistas) {
    await fetch("http://localhost:3000/conquistasUsuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idUsuario, idAchievement })
    });
  }
}
