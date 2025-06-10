const backgroundMusic = document.getElementById("background-music");
const toggleButton = document.getElementById("toggle-music");

let gameBoard = document.getElementById("game-board");
let successSound = document.getElementById("success-sound");
let errorSound = document.getElementById("error-sound");
let score = 0;
let erros = 0;
let bestScore = Number(localStorage.getItem("bestScore")) || 0;
document.getElementById("melhor-pontuacao").innerText = `Melhor pontuação: ${bestScore}`;
let firstCard = null;
let lock = false;
let timerInterval;
let tempoRestante = 240;

window.addEventListener("DOMContentLoaded", () => {
  backgroundMusic.volume = 0.2;
  backgroundMusic.play().catch(() => {});
  carregarRanking();
  carregarCartas();
});

toggleButton.addEventListener("click", () => {
  if (backgroundMusic.paused) {
    backgroundMusic.play();
    toggleButton.textContent = "🔈 Música";
  } else {
    backgroundMusic.pause();
    toggleButton.textContent = "🔇 Música";
  }
});

async function carregarRanking() {
  try {
    const res = await fetch("http://localhost:3000/ranking");
    const data = await res.json();

    const rankingDiv = document.getElementById("ranking");
    const rankingErrosDiv = document.getElementById("ranking-erros");
    const rankingTempoDiv = document.getElementById("ranking-tempo");

    if (!data.length) {
      rankingDiv.innerText = "Nenhuma pontuação registrada ainda.";
      rankingErrosDiv.innerText = "Nenhum dado de erros.";
      rankingTempoDiv.innerText = "Nenhum dado de tempo.";
      return;
    }

    let rankingHTML = data
      .sort((a, b) => b.pontuacao - a.pontuacao)
      .map((item, i) =>
        `<p>${i + 1}. ${item.nome} - ${item.pontuacao} pontos</p>`
      ).join("");

    let errosHTML = data
      .filter(item => typeof item.erros === "number")
      .sort((a, b) => a.erros - b.erros)
      .map((item, i) =>
        `<p>${i + 1}. ${item.nome} - ${item.erros} erro(s)</p>`
      ).join("");

    let tempoHTML = data
      .filter(item => typeof item.tempo === "number")
      .sort((a, b) => a.tempo - b.tempo)
      .map((item, i) =>
        `<p>${i + 1}. ${item.nome} - ${item.tempo}s</p>`
      ).join("");

    rankingHTML += `<p><strong>Melhor pontuação local:</strong> ${localStorage.getItem("bestScore") || 0}</p>`;

    if (rankingDiv) rankingDiv.innerHTML = rankingHTML;
    if (rankingErrosDiv) rankingErrosDiv.innerHTML = errosHTML || "Sem dados de erros ainda.";
    if (rankingTempoDiv) rankingTempoDiv.innerHTML = tempoHTML || "Sem dados de tempo ainda.";
  } catch (err) {
    console.error("Erro ao carregar ranking:", err);
    if (document.getElementById("ranking")) document.getElementById("ranking").innerText = "Erro ao carregar ranking.";
    if (document.getElementById("ranking-erros")) document.getElementById("ranking-erros").innerText = "Erro ao carregar ranking de erros.";
    if (document.getElementById("ranking-tempo")) document.getElementById("ranking-tempo").innerText = "Erro ao carregar ranking de tempo.";
  }
}

async function carregarCartas() {
  try {
    const res = await fetch("http://localhost:3000/cartas");
    const data = await res.json();

    // Cria pares: uma carta com imagem, outra com texto, ambos com o mesmo id
    const cardsData = data.flatMap(item => [
      { type: "img", content: item.imagem, pairId: item.id },
      { type: "text", content: item.descricao, pairId: item.id }
    ]);

    score = 0;
    erros = 0;
    document.getElementById("score").innerText = `Pontos: ${score}`;
    document.getElementById("erros").innerText = `Erros: ${erros}`;
    gameBoard.innerHTML = "";
    renderCards(cardsData);
    startTimer(240);
  } catch (err) {
    console.error("Erro ao carregar cartas:", err);
    alert("Erro ao carregar cartas do jogo.");
  }
}

function createCard(card, index, cardsData) {
  const div = document.createElement("div");
  div.classList.add("card");
  div.dataset.pairId = card.pairId;
  div.dataset.type = card.type;
  div.dataset.index = index;
  div.innerHTML = "";
  div.addEventListener("click", e => handleCardClick(e, cardsData));
  return div;
}

function renderCards(cardsData) {
  // Embaralha as cartas
  let shuffled = cardsData.sort(() => 0.5 - Math.random());
  gameBoard.innerHTML = "";
  shuffled.forEach((card, index) => {
    let cardElement = createCard(card, index, shuffled);
    gameBoard.appendChild(cardElement);
  });
}

function handleCardClick(e, cardsData) {
  if (lock) return;
  let card = e.currentTarget;
  if (card.classList.contains("flipped") || card.classList.contains("matched")) return;

  let index = card.dataset.index;
  let cardData = cardsData[index];

  card.innerHTML = "";
  card.classList.add("flipped");

  if (cardData.type === "img") {
    card.innerHTML = `<img src="${cardData.content}" style="max-width: 90%; max-height: 90%;">`;
  } else {
    card.innerText = cardData.content;
  }

  if (!firstCard) {
    firstCard = card;
  } else {
    lock = true;
    setTimeout(() => {
      let firstId = firstCard.dataset.pairId;
      let secondId = card.dataset.pairId;
      let firstType = firstCard.dataset.type;
      let secondType = card.dataset.type;

      if (
        String(firstId) === String(secondId) &&
        firstType !== secondType
      ) {
        successSound.play();
        firstCard.classList.add("matched");
        card.classList.add("matched");
        score++;
        document.getElementById("score").innerText = `Pontos: ${score}`;
        if (score > bestScore) {
          bestScore = score;
          localStorage.setItem("bestScore", bestScore);
          document.getElementById("melhor-pontuacao").innerText = `Melhor pontuação: ${bestScore}`;
          carregarRanking();
        }
      } else {
        errorSound.play();
        erros++;
        document.getElementById("erros").innerText = `Erros: ${erros}`;
        firstCard.classList.remove("flipped");
        card.classList.remove("flipped");
        firstCard.innerHTML = "";
        card.innerHTML = "";
      }

      firstCard = null;
      lock = false;
    }, 1000);
  }
}

function startTimer(duration) {
  let timerDisplay = document.getElementById("timer");
  tempoRestante = duration;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    let minutes = String(Math.floor(tempoRestante / 60)).padStart(2, "0");
    let seconds = String(tempoRestante % 60).padStart(2, "0");
    timerDisplay.innerText = `Tempo restante: ${minutes}:${seconds}`;
    if (tempoRestante <= 0) {
      clearInterval(timerInterval);
      alert("Tempo esgotado! Sua pontuação foi: " + score);
    }
    tempoRestante--;
  }, 1000);
}

function salvarPontuacao() {
  const nome = document.getElementById("nome").value.trim();
  if (!nome) {
    alert("Digite seu nome antes de salvar a pontuação.");
    return;
  }

  const tempoGastoAtual = 240 - tempoRestante;

  fetch("http://localhost:3000/ranking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome,
      pontuacao: score,
      erros,
      tempo: tempoGastoAtual,
      data: new Date().toISOString().split("T")[0]
    }),
  })
  .then(res => {
    if (!res.ok) throw new Error("Erro ao salvar pontuação");
    alert("Pontuação salva com sucesso!");
    carregarRanking();
  })
  .catch(err => {
    console.error("Erro:", err);
    alert("Não foi possível salvar a pontuação.");
  });
}