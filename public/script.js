function carregarRanking() {
fetch("/ranking")
    .then(res => res.json())
    .then(data => {
      const rankingDiv = document.getElementById("ranking");
      if (!data.length) {
        rankingDiv.innerText = "Nenhuma pontuação registrada ainda.";
        return;
      }
      rankingDiv.innerHTML = data.map((item, i) =>
        `<p>${i + 1}. ${item.nome} - ${item.pontuacao} pontos</p>`
      ).join("");
    })
    .catch(err => {
      console.error("Erro ao carregar ranking:", err);
      document.getElementById("ranking").innerText = "Erro ao carregar ranking.";
    });
}

// Chama a função quando o script carregar
carregarRanking();
const cardsData = [
  { type: "img", content: "img/spotify.png", pairId: 1 },
  { type: "text", content: " Rádio na internet onde você pode ouvir músicas de todos os tipos, quando quiser", pairId: 1 },
  { type: "img", content: "img/youtube.png", pairId: 2 },
  { type: "text", content: "Aplicativo para  assistir a vídeos de todos os tipos, a qualquer hora que quiser", pairId: 2 },
  { type: "img", content: "img/netflix.png", pairId: 3 },
  { type: "text", content: "Aplicativo de streaming ", pairId: 3 },
  { type: "img", content: "img/tiktok.png", pairId: 4 },
  { type: "text", content: "Aplicativo onde as pessoas fazem vídeos curtos e divertidos", pairId: 4 },
  { type: "img", content: "img/maps.png", pairId: 5 },
  { type: "text", content: "Ajuda a encontrar lugares e traçar caminhos ", pairId: 5 },
  { type: "img", content: "img/googlefotos.png", pairId: 6 },
  { type: "text", content: "Guarda todas as fotos de forma segura na internet", pairId: 6 },
  { type: "img", content: "img/uber.png", pairId: 7 },
  { type: "text", content: "Aplicativo para pedir carro com motorista, seguro e fácil", pairId: 7 },
  { type: "img", content: "img/ifood.png", pairId: 8 },
  { type: "text", content: " Aplicativo  que serve para pedir comida pronta, sem sair de casa.", pairId: 8 },
  { type: "img", content: "img/instagram.png", pairId: 9 },
  { type: "text", content: "Alicativo para ver e compartilhar fotos, vídeos e mensagens com amigos e familiares ", pairId: 9 },
  { type: "img", content: "img/globoplay.png", pairId: 10 },
  { type: "text", content: "Usado para ver novelas, jornais, programas e filmes da Globo.", pairId: 10 },
  { type: "img", content: "img/amazon.png", pairId: 11 },
  { type: "text", content: "Aplicativo onde  os produtos são entregues na porta da sua casa, um shopping virtual", pairId: 11 },
  { type: "img", content: "img/olx.png", pairId: 12 },
  { type: "text", content: "Um site e aplicativo onde as pessoas podem comprar e vender coisas usadas", pairId: 12 },
];

let gameBoard = document.getElementById("game-board");
let successSound = document.getElementById("success-sound");
let errorSound = document.getElementById("error-sound");
let score = 0;
let bestScore = localStorage.getItem("bestScore") || 0;
document.getElementById("ranking").innerText = `Melhor pontuação: ${bestScore}`;
let firstCard = null;
let lock = false;

function createCard(card, index) {
  const div = document.createElement("div");
  div.classList.add("card");
  div.dataset.pairId = card.pairId;
  div.dataset.type = card.type;
  div.dataset.index = index;
  div.innerHTML = "";
  div.addEventListener("click", handleCardClick);
  return div;
}

function renderCards() {
  let shuffled = cardsData.sort(() => 0.5 - Math.random());
  shuffled.forEach((card, index) => {
    let cardElement = createCard(card, index);
    gameBoard.appendChild(cardElement);
  });
}

function handleCardClick(e) {
  if (lock) return;
  let card = e.currentTarget;
  if (card.classList.contains("flipped") || card.classList.contains("matched")) return;

  let index = card.dataset.index;
  let cardData = cardsData[index];
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
      if (firstId === secondId) {
        successSound.play();
        firstCard.classList.add("matched");
        card.classList.add("matched");
        score++;
        document.getElementById("score").innerText = `Pontos: ${score}`;
        if (score > bestScore) {
          bestScore = score;
          localStorage.setItem("bestScore", bestScore);
          document.getElementById("ranking").innerText = `Melhor pontuação: ${bestScore}`;
        }
      } else {
        errorSound.play();
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
  let time = duration;
  let countdown = setInterval(() => {
    let minutes = String(Math.floor(time / 60)).padStart(2, "0");
    let seconds = String(time % 60).padStart(2, "0");
    timerDisplay.innerText = `Tempo restante: ${minutes}:${seconds}`;
    if (time <= 0) {
      clearInterval(countdown);
      alert("Tempo esgotado! Sua pontuação foi: " + score);
    }
    time--;
  }, 1000);
}

renderCards();
startTimer(240); // 4 minutos

   function salvarPontuacao() {
  const nome = document.getElementById("nome").value.trim();
  if (!nome) {
    alert("Digite seu nome antes de salvar a pontuação.");
    return;
  }

  fetch("http://localhost:3000/ranking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, pontuacao: score }),
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
