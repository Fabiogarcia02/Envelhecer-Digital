let perguntas = [];
let perguntaAtual = 0;

async function carregarPerguntas() {
  const res = await fetch('http://localhost:3000/quiz');
  perguntas = await res.json();
  renderQuiz(0);
}

function responder(indiceResposta) {
  const pergunta = perguntas[perguntaAtual];
  const resposta = pergunta.respostas[indiceResposta];

  if (resposta.correta) {
    alert(" Acertou! +1 ponto");
  } else {
    alert(" Errou. Nenhum ponto.");
  }

  perguntaAtual++;
  renderQuiz(perguntaAtual);
}

function renderQuiz(index) {
  const pergunta = perguntas[index];
  const container = document.querySelector(".container");

  if (!pergunta) {
    container.innerHTML = `<h2>Você concluiu o quiz!</h2>`;
    return;
  }

  container.innerHTML = `
    <header>
      <h1>QUIZ</h1>
    </header>
    <section class="question-box">
      <h2>PERGUNTA ${pergunta.id}</h2>
      <p class="question-text" onmouseover="lerTexto(this.innerText)">${pergunta.pergunta}</p>
    </section>
    <div class="options-grid">
      ${pergunta.respostas.map((r, i) => `
        <button class="icon-button" onmouseover="lerTexto('${r.texto}')" onclick="responder(${i})">${r.texto}</button>
      `).join('')}
    </div>
    <footer>
      <button class="next-button" onclick="renderQuiz(${index + 1})">PRÓXIMO</button>
    </footer>
  `;
}

function lerTexto(texto) {
  const synth = window.speechSynthesis;
  if (synth.speaking) synth.cancel();
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = "pt-BR";
  synth.speak(utterance);
}

window.onload = carregarPerguntas;
