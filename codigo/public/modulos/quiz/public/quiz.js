let quiz = [];
let perguntaIndex = 0;
function responder(perguntaId, indiceResposta) {
  const pergunta = quiz.find(q => q.id === perguntaId);
  if (!pergunta) return;

  const correta = pergunta.respostas[indiceResposta].correta;
  
  if (correta) {
    alert(" Acertou! +1 ponto");
  } else {
    alert(" Errou. Nenhum ponto.");
  }

  renderQuiz(perguntaIndex + 1);
}


function renderQuiz(index) {
  const pergunta = quiz[index];
  perguntaIndex = index;

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
      <p class="question-text" onmouseover="lerTexto(this.innerText)">
        ${pergunta.pergunta}
      </p>
    </section>
    <div class="options-grid">
      ${pergunta.respostas.map((r, i) => `
        <button class="icon-button" onmouseover="lerTexto('${r.texto}')" onclick="responder(${pergunta.id}, ${i})">
          ${r.texto}
        </button>
      `).join('')}
    </div>
    <footer>
      <button class="next-button" onclick="renderQuiz(${index + 1})">PRÓXIMO</button>
    </footer>
  `;
}

// iniciando a API 
function lerTexto(texto) {
  const synth = window.speechSynthesis;
  if (synth.speaking) synth.cancel(); 
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = "pt-BR";
  synth.speak(utterance);
}

window.onload = async () => {
  const response = await fetch('/api/quiz');
  quiz = await response.json();
  renderQuiz(0); 
};
