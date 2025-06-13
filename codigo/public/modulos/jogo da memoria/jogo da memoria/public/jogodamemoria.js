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
let pontosPorPar = 10; // será ajustado ao carregar as cartas

window.addEventListener("DOMContentLoaded", () => {
  backgroundMusic.volume = 0.03; // 3% do volume
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

    // RANKING GLOBAL: mais pontos, menor tempo (visual pódio + lista, só nome)
    const rankingGlobalDiv = document.getElementById("ranking-global");
    let globalSorted = data
      .slice()
      .sort((a, b) => {
        if (b.pontuacao !== a.pontuacao) {
          return b.pontuacao - a.pontuacao;
        }
        return (a.tempo || 99999) - (b.tempo || 99999);
      });

    const trofeus = [
      '<span class="trophy">🏆</span>',
      '<span class="trophy">🥈</span>',
      '<span class="trophy">🥉</span>'
    ];
    let podiumHTML = '<div class="ranking-list">';
    for (let i = 0; i < 3; i++) {
      const user = globalSorted[i];
      if (!user) continue;
      let podiumClass = i === 0 ? "first" : i === 1 ? "second" : "third";
      podiumHTML += `
        <div class="ranking-podium ${podiumClass}">
          ${trofeus[i] || ""}
          <div style="font-size:14px;opacity:0.8">${i === 0 ? "Primeiro" : i === 1 ? "Segundo" : "Terceiro"} lugar</div>
          <div style="font-size:18px;margin:6px 0 2px 0">${user.nome}</div>
        </div>
      `;
    }
    podiumHTML += '</div>';

    // Exibe a lista do 4º em diante só se houver mais de 3 usuários
    let restHTML = '';
    if (globalSorted.length > 3) {
      restHTML = '<div class="ranking-rest">';
      for (let i = 3; i < globalSorted.length && i < 10; i++) {
        restHTML += `<p>${globalSorted[i].nome}</p>`;
      }
      if (globalSorted.length > 10) {
        restHTML += `<a href="#">Ver mais</a>`;
      }
      restHTML += '</div>';
    }
    rankingGlobalDiv.innerHTML = podiumHTML + restHTML;

    // NOVA TABELA COMPLETA
    const rankingTabelaDiv = document.getElementById("ranking-tabela");
    let tabelaHTML = `
      <table class="ranking-global-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Pontos</th>
            <th>Tempo (s)</th>
          </tr>
        </thead>
        <tbody>
          ${globalSorted.map((item, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${item.nome}</td>
              <td>${item.pontuacao}</td>
              <td>${item.tempo || 0}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
    rankingTabelaDiv.innerHTML = tabelaHTML || "Sem dados ainda.";

    // Ranking Pontuação: apenas nome do usuário e lista só se houver mais de 3
    const rankingDiv = document.getElementById("ranking");
    if (!data.length) {
      rankingDiv.innerText = "Nenhuma pontuação registrada ainda.";
      return;
    }
    const sorted = data.slice().sort((a, b) => b.pontuacao - a.pontuacao);
    let podiumHTML2 = '<div class="ranking-list">';
    for (let i = 0; i < 3; i++) {
      const user = sorted[i];
      if (!user) continue;
      let podiumClass = i === 0 ? "first" : i === 1 ? "second" : "third";
      podiumHTML2 += `
        <div class="ranking-podium ${podiumClass}">
          ${trofeus[i] || ""}
          <div style="font-size:14px;opacity:0.8">${i === 0 ? "Primeiro" : i === 1 ? "Segundo" : "Terceiro"} lugar</div>
          <div style="font-size:18px;margin:6px 0 2px 0">${user.nome}</div>
        </div>
      `;
    }
    podiumHTML2 += '</div>';

    let restHTML2 = '';
    if (sorted.length > 3) {
      restHTML2 = '<div class="ranking-rest">';
      for (let i = 3; i < sorted.length && i < 10; i++) {
        restHTML2 += `<p>${sorted[i].nome}</p>`;
      }
      if (sorted.length > 10) {
        restHTML2 += `<a href="#">Ver mais</a>`;
      }
      restHTML2 += '</div>';
    }
    rankingDiv.innerHTML = podiumHTML2 + restHTML2;

    // Ranking por tempo (apenas quem fez 100 pontos)
    const rankingTempoDiv = document.getElementById("ranking-tempo");
    let tempoSorted = data
      .filter(item => item.pontuacao === 100 && typeof item.tempo === "number")
      .sort((a, b) => a.tempo - b.tempo);

    let podiumHTML3 = '<div class="ranking-list">';
    for (let i = 0; i < 3; i++) {
      const user = tempoSorted[i];
      if (!user) continue;
      let podiumClass = i === 0 ? "first" : i === 1 ? "second" : "third";
      podiumHTML3 += `
        <div class="ranking-podium ${podiumClass}">
          ${trofeus[i] || ""}
          <div style="font-size:14px;opacity:0.8">${i === 0 ? "Primeiro" : i === 1 ? "Segundo" : "Terceiro"} lugar</div>
          <div style="font-size:18px;margin:6px 0 2px 0">${user.nome}</div>
        </div>
      `;
    }
    podiumHTML3 += '</div>';

    let restHTML3 = '';
    if (tempoSorted.length > 3) {
      restHTML3 = '<div class="ranking-rest">';
      for (let i = 3; i < tempoSorted.length && i < 10; i++) {
        restHTML3 += `<p>${tempoSorted[i].nome}</p>`;
      }
      if (tempoSorted.length > 10) {
        restHTML3 += `<a href="#">Ver mais</a>`;
      }
      restHTML3 += '</div>';
    }
    rankingTempoDiv.innerHTML = (tempoSorted.length === 0)
      ? "Sem dados de tempo ainda."
      : podiumHTML3 + restHTML3;

  } catch (err) {
    document.getElementById("ranking-global").innerText = "Erro ao carregar ranking global.";
    document.getElementById("ranking-tabela").innerText = "Erro ao carregar tabela.";
    document.getElementById("ranking").innerText = "Erro ao carregar ranking.";
    document.getElementById("ranking-tempo").innerText = "Erro ao carregar ranking de tempo.";
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

    // Calcula quantos pontos cada par vale para fechar em 100
    const totalPares = data.length;
    pontosPorPar = Math.floor(100 / totalPares);

    score = 0;
    erros = 0;
    atualizarPontuacao();
    document.getElementById("erros").innerText = `Erros: ${erros}`;
    gameBoard.innerHTML = "";
    renderCards(cardsData);
    startTimer(240);
  } catch (err) {
    console.error("Erro ao carregar cartas:", err);
    alert("Erro ao carregar cartas do jogo.");
  }
}

function atualizarPontuacao() {
  let pontosFinais = Math.max(0, score - erros * 0.5);
  document.getElementById("score").innerText = `Pontos: ${pontosFinais}`;
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
        score += pontosPorPar;
        if (score > 100) score = 100;
        atualizarPontuacao();
        if (score > bestScore) {
          bestScore = score;
          localStorage.setItem("bestScore", bestScore);
          document.getElementById("melhor-pontuacao").innerText = `Melhor pontuação: ${bestScore}`;
          carregarRanking();
        }
        // Se chegou a 100 pontos, para o jogo e salva o tempo
        if (score >= 100) {
          clearInterval(timerInterval);
          alert("Parabéns! Você atingiu 100 pontos!");
          salvarPontuacao();
        }
      } else {
        errorSound.play();
        erros++;
        document.getElementById("erros").innerText = `Erros: ${erros}`;
        atualizarPontuacao();
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
  const pontosFinais = Math.max(0, score - erros * 0.5);

  fetch("http://localhost:3000/ranking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome,
      pontuacao: pontosFinais,
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