let perguntaAtual = null;
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
    const resposta = await fetch("/jogos");
    const dados = await resposta.json();

    const jogoQuiz = dados.find(j => j.tipo === "quiz");
    if (!jogoQuiz) return;

    if (nivelAtual > jogoQuiz.niveis.length) {
      perguntaAtual = null;
      renderQuiz(); // mostra tela de finalização
      return;
    }
    const nivel = jogoQuiz.niveis.find(n => n.nivel === nivelAtual);

    if (!nivel || !nivel.pergunta || !Array.isArray(nivel.respostas)) {
      console.error("Nível não encontrado ou incompleto.");
      perguntaAtual = null;
      renderQuiz(); // mostra tela de finalização
      return;
    }

    perguntaAtual = {
      pergunta: nivel.pergunta,
      respostas: nivel.respostas
    };

    renderQuiz();

    // Inicializa erros nos níveis (caso estejam ausentes)
    let atualizou = false;
    for (let i = 0; i < jogoQuiz.niveis.length; i++) {
      if (jogoQuiz.niveis[i].erros === undefined) {
        jogoQuiz.niveis[i].erros = 0;
        atualizou = true;
      }
    }

    // Só envia para o backend se houve atualização
    if (atualizou) {
      await fetch(`/jogos/${jogoQuiz.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jogoQuiz)
      });
    }

  } catch (erro) {
    console.log("Erro ao carregar as perguntas:", erro);
  }
}

function renderQuiz() {
  let container = document.querySelector(".container");

  if (!perguntaAtual) {
    container.innerHTML = `
      <header><h1>QUIZ FINALIZADO</h1></header>
      <section class="question-box">
        <h2>Parabéns!</h2>
        <p class="question-text">Você acertou <strong>${pontuacaoTotal}</strong> perguntas.</p>
      </section>
      <footer>
        <button class="next-button" onclick="reiniciarQuiz()">Refazer Quiz</button>
      </footer>
    `;
    verificarConquistas();
    return;
  }

  container.innerHTML = `
    <header><h1>QUIZ</h1></header>
    <section class="question-box">
      <h2>PERGUNTA ${nivelAtual}</h2>
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
  if (perguntaAtual.respondido) return;

  perguntaAtual.respondido = true;

  if (perguntaAtual.respostas[indiceResposta].correta) {
    pontuacaoTotal++;
    alert("✅ Acertou! +1 ponto");
  } else {
    alert("❌ Errou. Nenhum ponto.");

    // Atualizar backend com erro na pergunta
    registrarErro(nivelAtual);
  }
}

async function registrarErro(nivel) {
  try {
    const resposta = await fetch("/jogos");
    const dados = await resposta.json();

    const jogoQuiz = dados.find(j => j.tipo === "quiz");
    if (!jogoQuiz) return;

    const nivelIndex = jogoQuiz.niveis.findIndex(n => n.nivel === nivel);
    if (nivelIndex === -1) return;

    const nivelObj = jogoQuiz.niveis[nivelIndex];
    const novosErros = (nivelObj.erros || 0) + 1;

    // Atualiza o objeto no backend
    jogoQuiz.niveis[nivelIndex].erros = novosErros;

    // PATCH ou PUT do jogo inteiro (porque 'niveis' é um array dentro do objeto do jogo)
    await fetch(`/jogos/${jogoQuiz.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jogoQuiz)
    });

  } catch (erro) {
    console.error("Erro ao registrar erro no backend:", erro);
  }
}

function avancar() {
  nivelAtual++;
  carregarQuiz();
}

function reiniciarQuiz() {
  nivelAtual = 1;
  pontuacaoTotal = 0;
  carregarQuiz();
}

function lerTexto(texto) {
  const voz = window.speechSynthesis;
  if (voz.speaking) voz.cancel();
  const fala = new SpeechSynthesisUtterance(texto);
  fala.lang = "pt-BR";
  voz.speak(fala);
}

async function verificarConquistas() {
  const conquistasExistentes = await fetch(`/conquistasUsuarios?idUsuario=${String(idUsuario)}`)
    .then(res => res.json())
    .catch(() => []);

  const idsExistentes = conquistasExistentes.map(c => Number(c.idAchievement));

  const dados = await fetch(`/jogos`).then(r => r.json());
  const jogoQuiz = dados.find(j => j.tipo === "quiz");
  if (!jogoQuiz || !Array.isArray(jogoQuiz.niveis)) return;
  const novasConquistas = [];

  if (pontuacaoTotal >= 5) {
    novasConquistas.push(1);
  }
  
  for (const idAchievement of novasConquistas) {
    const idGerado = Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    await fetch(`/conquistasUsuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: idGerado,
        idUsuario: idUsuario,
        idAchievement: Number(idAchievement)
      })
    });
  }
}
