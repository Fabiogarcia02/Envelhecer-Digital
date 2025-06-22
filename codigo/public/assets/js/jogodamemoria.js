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
let pontosPorPar = 10;
let paresEncontrados = 0;
let totalPares = 0;
let nivelAtualMemoria = 1;
let jogoMemoriaId = 1;
let jogoMemoria = null;
let usuarioCorrente = null;
let idUsuario = null;

window.onload = () =>{
  usuarioCorrente = JSON.parse(localStorage.getItem("usuarioCorrente"));
  if (!usuarioCorrente || !usuarioCorrente.id) {
    alert("Você precisa estar logado para jogar.");
    window.location.href = 'login.html';
    return;
  }
  idUsuario = usuarioCorrente.id;
}

window.addEventListener("DOMContentLoaded", async () => {
  backgroundMusic.volume = 0.03;
  backgroundMusic.play().catch(() => {});

  try {
    const jogos = await fetch("http://localhost:3000/jogos").then(r => r.json());
    jogoMemoria = jogos.find(jogo => jogo.tipo === "jogo-memoria");

    if (!jogoMemoria) throw new Error("Jogo da memória não encontrado.");

    jogoMemoriaId = jogoMemoria.id;
    await carregarRanking();
    await carregarCartas(jogoMemoria); // passa o jogo diretamente
  } catch (err) {
    alert("Erro ao carregar dados do jogo: " + err.message);
  }
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
    const rankingFiltrado = data.filter(item =>
      item.idJogo === jogoMemoriaId && item.nivel === nivelAtualMemoria
    );

    const rankingGlobalDiv = document.getElementById("ranking-global");
    let globalSorted = rankingFiltrado
      .slice()
      .sort((a, b) => b.pontuacao - a.pontuacao || a.tempo - b.tempo);

    const trofeus = ["<span class=\"trophy\">🏆</span>", "<span class=\"trophy\">🥈</span>", "<span class=\"trophy\">🥉</span>"];
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

    let restHTML = '';
    if (globalSorted.length > 3) {
      restHTML = '<div class="ranking-rest">';
      for (let i = 3; i < globalSorted.length && i < 10; i++) {
        restHTML += `<p>${globalSorted[i].nome}</p>`;
      }
      if (globalSorted.length > 10) {
        restHTML += `<a href=\"#\">Ver mais</a>`;
      }
      restHTML += '</div>';
    }
    rankingGlobalDiv.innerHTML = podiumHTML + restHTML;

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

    const rankingDiv = document.getElementById("ranking");
    if (!rankingFiltrado.length) {
      rankingDiv.innerText = "Nenhuma pontuação registrada ainda.";
      return;
    }
    const sorted = rankingFiltrado.slice().sort((a, b) => b.pontuacao - a.pontuacao);
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
        restHTML2 += `<a href=\"#\">Ver mais</a>`;
      }
      restHTML2 += '</div>';
    }
    rankingDiv.innerHTML = podiumHTML2 + restHTML2;

    const rankingTempoDiv = document.getElementById("ranking-tempo");
    let tempoSorted = rankingFiltrado
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
        restHTML3 += `<a href=\"#\">Ver mais</a>`;
      }
      restHTML3 += '</div>';
    }
    rankingTempoDiv.innerHTML = tempoSorted.length === 0
      ? "Sem dados de tempo ainda."
      : podiumHTML3 + restHTML3;

  } catch (err) {
    document.getElementById("ranking-global").innerText = "Erro ao carregar ranking global.";
    document.getElementById("ranking-tabela").innerText = "Erro ao carregar tabela.";
    document.getElementById("ranking").innerText = "Erro ao carregar ranking.";
    document.getElementById("ranking-tempo").innerText = "Erro ao carregar ranking de tempo.";
  }
}

async function carregarCartas(jogoMemoria) {
  
  if (!jogoMemoria) {
    console.error("jogoMemoria está indefinido.");
    alert("Erro ao carregar cartas: dados do jogo não estão disponíveis.");
    return;
  }
  
  try {
    const nivel = jogoMemoria.niveis.find(n => n.nivel === nivelAtualMemoria);
    if (!nivel) {
      alert("Parabéns! Você concluiu todos os níveis!");
      return;
    }
    
    if (!nivel.cartas) {
      throw new Error("Cartas do nível não encontradas.");
    }

    const cartas = nivel.cartas;
    const cardsData = cartas.flatMap(carta => [
      { type: "img", content: carta.imagem, pairId: carta.id },
      { type: "text", content: carta.descricao, pairId: carta.id }
    ]);

    totalPares = cartas.length;
    pontosPorPar = Math.floor(100 / totalPares);

    score = 0;
    erros = 0;
    atualizarPontuacao();
    document.getElementById("erros").innerText = `Erros: ${erros}`;
    gameBoard.innerHTML = "";
    renderCards(cardsData);
    startTimer(240);
    paresEncontrados = 0;

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

      if (String(firstId) === String(secondId) && firstType !== secondType) {
        successSound.play();
        firstCard.classList.add("matched");
        card.classList.add("matched");
        score += pontosPorPar;
        paresEncontrados++;
        if (paresEncontrados >= totalPares) {
          clearInterval(timerInterval);
          alert(`Você encontrou todos os pares do nível ${nivelAtualMemoria}!`);
          salvarPontuacao(avancarNivel);
        }

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

function salvarPontuacao(callback) {
  const usuarioCorrente = JSON.parse(localStorage.getItem("usuarioCorrente"));
  if (!usuarioCorrente || !usuarioCorrente.id || !usuarioCorrente.nome) {
    alert("Você precisa estar logado para salvar sua pontuação.");
    return;
  }

  const tempoGastoAtual = 240 - tempoRestante;
  const pontosFinais = Math.max(0, score - erros * 0.5);

  fetch("http://localhost:3000/ranking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idUsuario: usuarioCorrente.id,
      nome: usuarioCorrente.nome,
      pontuacao: pontosFinais,
      erros,
      tempo: tempoGastoAtual,
      idJogo: jogoMemoriaId,
      nivel: nivelAtualMemoria,
      data: new Date().toISOString().split("T")[0]
    }),
  })
  .then(res => {
    if (!res.ok) throw new Error("Erro ao salvar pontuação");
    alert("Pontuação salva com sucesso!");
    carregarRanking(); // Atualiza ranking
    verificarConquistas();
    if (callback) callback(); // Avança nível
  })
  .catch(err => {
    console.error("Erro:", err);
    alert("Não foi possível salvar a pontuação.");
  });
}

function avancarNivel() {
  nivelAtualMemoria++;
  carregarRanking();
  carregarCartas(jogoMemoria);
}

async function verificarConquistas() {
  // Buscar conquistas já registradas para o usuário
  const conquistasExistentes = await fetch(`http://localhost:3000/conquistasUsuarios?idUsuario=${idUsuario}`)
    .then(res => res.json())
    .catch(() => []);

  const idsConquistasExistentes = conquistasExistentes.map(c => Number(c.idAchievement));

  // Buscar ranking
  const ranking = await fetch("http://localhost:3000/ranking").then(r => r.json());

  const novasConquistas = [];

  // ID 2 – Top 3 em 5 níveis (idJogo = "1" ou "2")
  const top3PorNivel = {};
  for (const jogoId of ["1", "2"]) {
    ranking
      .filter(r => r.idJogo === jogoId)
      .forEach(registro => {
        if (!top3PorNivel[registro.nivel]) top3PorNivel[registro.nivel] = [];
        top3PorNivel[registro.nivel].push(registro);
      });
  }

  const niveisTop3 = Object.values(top3PorNivel).filter(lista =>
    lista.slice(0, 3).some(j => j.idUsuario === idUsuario)
  );
  if (niveisTop3.length >= 5 && !idsConquistasExistentes.includes(2)) {
    novasConquistas.push(2);
  }

  // ID 3 – Encontrar todas cartas com até 18 erros (memória)
  const memoria = ranking.filter(r => r.idJogo === "1" && r.erros <= 18 && r.idUsuario === idUsuario);
  if (memoria.length > 0 && !idsConquistasExistentes.includes(3)) {
    novasConquistas.push(3);
  }

  // ID 5 – Finalizar rápido (memória <= 60s, caça <= 90s)
  const rapido = ranking.some(j =>
    ((j.idJogo === "2" && j.tempo <= 90) || (j.idJogo === "1" && j.tempo <= 60)) &&
    j.idUsuario === idUsuario
  );
  if (rapido && !idsConquistasExistentes.includes(5)) {
    novasConquistas.push(5);
  }

  // ID 6 – Encontrar tudo com até 12 erros (memória)
  const memoria12Erros = ranking.filter(r => r.idJogo === "1" && r.erros <= 12 && r.idUsuario === idUsuario);
  if (memoria12Erros.length > 0 && !idsConquistasExistentes.includes(6)) {
    novasConquistas.push(6);
  }

  // Enviar novas conquistas
  for (const idAchievement of novasConquistas) {
    await fetch("http://localhost:3000/conquistasUsuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idUsuario, idAchievement })
    });
  }
}