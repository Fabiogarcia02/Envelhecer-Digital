const tam = 15;
const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZÁÀÂÃÉÊÍÓÔÕÚÇ";
const matriz = Array.from({ length: tam }, () => Array(tam).fill(""));
let listItems = [];
let selectPalavra = [];
let selecionado = false;
let startX = null;
let startY = null;
let dirX = null;
let dirY = null;
let nivelAtual = 1;
let jogosJson = [];
let palavrasEncontradas = 0;
let palavras = [];
let intervaloTempo = null;
let tempoDecorrido = 0;
let pontuacaoAtual = 100;
let usuarioCorrente = null;
let idUsuario = null;

window.onload = () => {
  usuarioCorrente = JSON.parse(localStorage.getItem("usuarioCorrente"));
  if (!usuarioCorrente || !usuarioCorrente.id) {
    alert("Você precisa estar logado para jogar.");
    window.location.href = 'login.html';
    return;
  }
  idUsuario = usuarioCorrente.id;

  fetch("/jogos")
    .then(response => response.json())
    .then(data => {
      jogosJson = data;

      // Depois de carregar os jogos, busca o ranking do usuário
      fetch("/ranking")
        .then(res => res.json())
        .then(rankings => {
          const jogadorRankings = rankings.filter(r =>
            r.idUsuario === usuarioCorrente.id && r.idJogo === "2"
          );

          if (jogadorRankings.length > 0) {
            const maiorNivel = Math.max(...jogadorRankings.map(r => r.nivel));
            nivelAtual = maiorNivel + 1;
          } else {
            nivelAtual = 1;
          }

          carregarNivel(nivelAtual);
          carregarRankings();
        });
    });
};


function carregarNivel(nivel) {
    const jogoCacaPalavras = jogosJson.find(j => j.tipo === "caca-palavras");
    if (!jogoCacaPalavras) return;

    const nivelData = jogoCacaPalavras.niveis.find(n => n.nivel === nivel);
    if (!nivelData) {
        alert("Parabéns! Você concluiu todos os níveis.");
        return;
    }

    nivelAtual = nivel;
    carregarRankings();
    palavras = nivelData.palavras;
    palavrasEncontradas = 0;
    listItems = [];

    for (let x = 0; x < tam; x++) {
        for (let y = 0; y < tam; y++) {
            matriz[x][y] = "";
        }
    }

    const level = document.getElementById("levelTitle");
    level.innerHTML = `Nível - ${nivelAtual}`;

    const listaUl = document.getElementById("listWords");
    listaUl.innerHTML = "";

    palavras.forEach(palavra => {
        let direcao = Math.floor(Math.random() * 3);
        switch (direcao) {
            case 0: insereHorizontal(palavra); break;
            case 1: insereVertical(palavra); break;
            case 2: insereDiagonal(palavra); break;
        }

        let li = document.createElement("li");
        li.textContent = palavra;
        listaUl.appendChild(li);
        listItems.push(li);
    });

    for (let x = 0; x < tam; x++) {
        for (let y = 0; y < tam; y++) {
            if (matriz[x][y] === "") {
                matriz[x][y] = letras[Math.floor(Math.random() * letras.length)];
            }
        }
    }

    let container = document.getElementById("containerCacaPalavras");
    container.innerHTML = "";
    for (let x = 0; x < tam; x++) {
        for (let y = 0; y < tam; y++) {
            container.innerHTML += `<span class="letra">${matriz[x][y]}</span>`;
        }
    }

    iniciarCronometro();
}

function insereHorizontal(palavra) {
    let inserida = false;
    while (!inserida) {
        const x = Math.floor(Math.random() * tam);
        const y = Math.floor(Math.random() * (tam - palavra.length + 1));
        if (podeInserir(palavra, x, y, 0, 1)) {
            for (let i = 0; i < palavra.length; i++) {
                matriz[x][y + i] = palavra[i];
            }
            inserida = true;
        }
    }
}

function insereVertical(palavra) {
    let inserida = false;
    while (!inserida) {
        const x = Math.floor(Math.random() * (tam - palavra.length + 1));
        const y = Math.floor(Math.random() * tam);
        if (podeInserir(palavra, x, y, 1, 0)) {
            for (let i = 0; i < palavra.length; i++) {
                matriz[x + i][y] = palavra[i];
            }
            inserida = true;
        }
    }
}

function insereDiagonal(palavra) {
    let inserida = false;
    while (!inserida) {
        const x = Math.floor(Math.random() * (tam - palavra.length + 1));
        const y = Math.floor(Math.random() * (tam - palavra.length + 1));
        if (podeInserir(palavra, x, y, 1, 1)) {
            for (let i = 0; i < palavra.length; i++) {
                matriz[x + i][y + i] = palavra[i];
            }
            inserida = true;
        }
    }
}

function podeInserir(palavra, x, y, dx, dy) {
    for (let i = 0; i < palavra.length; i++) {
        const nx = x + i * dx;
        const ny = y + i * dy;
        if (
            nx < 0 || nx >= tam || ny < 0 || ny >= tam ||
            (matriz[nx][ny] !== "" && matriz[nx][ny] !== palavra[i])
        ) {
            return false;
        }
    }
    return true;
}

//calcula o máximo divisor comum
function mdc(a, b) {
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function limpaSelecao() {
        selectPalavra.forEach(el => {
        if (!el.classList.contains("fixa")) {
            el.classList.remove("selecionada");
        }
    });
    selectPalavra = [];
}

function selecionaIntervalo(startX, startY, endX, endY) {
    limpaSelecao();
    const letrasSpan = document.querySelectorAll(".letra");
    let dx = endX - startX;
    let dy = endY - startY;
    const divisor = Math.abs(mdc(dx, dy)) || 1;
    dx /= divisor;
    dy /= divisor;

    let x = startX;
    let y = startY;

    while (x !== endX + dx || y !== endY + dy) {
        const index = x * tam + y;
        const el = letrasSpan[index];
        if (el) {
            el.classList.add("selecionada");
            selectPalavra.push(el);
        }
        x += dx;
        y += dy;
    }

}

function getLetraFromEvent(e) {
    let target = e.target;
    if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        target = document.elementFromPoint(touch.clientX, touch.clientY);
    }
    if (target && target.classList && target.classList.contains("letra")) {
        return target;
    }
    return null;
}

function startSelection(e) {
    const letra = getLetraFromEvent(e);
    if (letra) {
        const letrasSpan = document.querySelectorAll(".letra");
        const index = Array.from(letrasSpan).indexOf(letra);
        startX = Math.floor(index / tam);
        startY = index % tam;
        selecionado = true;
        e.preventDefault();
    }
}

function moveSelection(e) {
    if (!selecionado) return;
    const letra = getLetraFromEvent(e);
    if (letra) {
        const letrasSpan = document.querySelectorAll(".letra");
        const index = Array.from(letrasSpan).indexOf(letra);
        const endX = Math.floor(index / tam);
        const endY = index % tam;

        let dx = endX - startX;
        let dy = endY - startY;
        const divisor = Math.abs(mdc(dx, dy));

        if (divisor !== 0) {
            dx /= divisor;
            dy /= divisor;
            if (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) {
                selecionaIntervalo(startX, startY, endX, endY);
            }
        }
        e.preventDefault();
    }
}

function endSelection(e) {
    if (!selecionado) return;
    const palavraSelecionada = selectPalavra.map(span => span.textContent).join("");

    if (!palavras.includes(palavraSelecionada)) {
        limpaSelecao();
    } else {
        for (let i = 0; i < palavras.length; i++) {
            if (palavras[i] === palavraSelecionada && !listItems[i].classList.contains("encontrado")) {
                listItems[i].classList.add("encontrado");
                palavrasEncontradas++;
                break;
            }
        }
    if (palavrasEncontradas === palavras.length) {
        finalizarJogo(); // salva nome e pontuação
        selectPalavra.forEach(el => el.classList.add("fixa"));
    }


        selecionado = false;
        startX = null;
        startY = null;
        selectPalavra = [];
        e.preventDefault();
    }
}


document.addEventListener("mousedown", startSelection);
document.addEventListener("touchstart", startSelection);

document.addEventListener("mouseover", moveSelection);
document.addEventListener("touchmove", moveSelection);

document.addEventListener("mouseup", endSelection);
document.addEventListener("touchend", endSelection);
document.addEventListener("touchmove", function (e) {
  if (selecionado) {
    e.preventDefault();
  }
}, { passive: false });


function formatarTempo(segundos) {
    if (typeof segundos !== "number" || isNaN(segundos)) return "00:00";
    const min = String(Math.floor(segundos / 60)).padStart(2, '0');
    const sec = String(segundos % 60).padStart(2, '0');
    return `${min}:${sec}`;
}


function atualizarCronometro() {
    tempoDecorrido++;
    document.getElementById("cronometro").textContent = formatarTempo(tempoDecorrido);

    // Reduz 10 pontos a cada 30s após 2min
    if (tempoDecorrido > 120) {
        let penalidade = Math.floor((tempoDecorrido - 120) / 30) * 10;
        pontuacaoAtual = Math.max(100 - penalidade, 0);
        document.getElementById("pontuacao").textContent = pontuacaoAtual;
    }
}

function iniciarCronometro() {
    tempoDecorrido = 0;
    pontuacaoAtual = 100;
    document.getElementById("cronometro").textContent = "00:00";
    document.getElementById("pontuacao").textContent = "100";
    clearInterval(intervaloTempo);
    intervaloTempo = setInterval(atualizarCronometro, 1000);
}

function pararCronometro() {
    clearInterval(intervaloTempo);
}

function finalizarJogo() {
  pararCronometro();

  const usuarioCorrente = JSON.parse(localStorage.getItem("usuarioCorrente"));
  if (!usuarioCorrente || !usuarioCorrente.nome) {
    alert("Você precisa estar logado para salvar sua pontuação.");
    return;
  }

  const jogador = {
    nome: usuarioCorrente.nome,
    idUsuario: usuarioCorrente.id,
    pontuacao: pontuacaoAtual,
    tempo: Number(tempoDecorrido),
    data: new Date().toISOString().split("T")[0],
    nivel: nivelAtual,
    idJogo: "2"
  };

  fetch("/ranking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jogador)
  })
    .then(res => res.json())
    .then(() => {
        alert("Pontuação salva com sucesso!");
        selectPalavra.forEach(el => el.classList.add("fixa"));
        verificarConquistas();
        setTimeout(() => {
            carregarNivel(nivelAtual + 1);
        }, 500);
    })
    .catch(err => console.error("Erro ao salvar:", err));
}



function carregarRankings() {
  fetch("/ranking")
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data)) return;

      // Mostra apenas rankings do caça-palavras (idJogo = "2") e do nível atual
      const dataNivelAtual = data.filter(j =>
        j.nivel === nivelAtual && j.idJogo === "2"
      );

      const rankingPontuacao = [...dataNivelAtual].sort((a, b) => b.pontuacao - a.pontuacao);
      const rankingTempo = [...dataNivelAtual].sort((a, b) => a.tempo - b.tempo);
      const rankingTabela = [...dataNivelAtual].sort((a, b) => b.pontuacao - a.pontuacao || a.tempo - b.tempo);

      document.getElementById("ranking").innerHTML = gerarLinhasTabela(rankingPontuacao, "pontuacao");
      document.getElementById("ranking-tempo").innerHTML = gerarLinhasTabela(rankingTempo, "tempo");
      document.getElementById("ranking-global").innerHTML = gerarTabelaCompleta(rankingTabela);
    })
    .catch(err => {
      console.error("Erro ao carregar rankings:", err);
    });
}


function gerarListaRanking(lista) {
  return `<ol>${lista
    .filter(j => typeof j.tempo === 'number')  // Evita registros inválidos
    .slice(0, 5)
    .map(j =>
      `<li>${j.nome} - ${j.pontuacao} pts - ${formatarTempo(j.tempo)}</li>`
    ).join("")
  }</ol>`;
}


function gerarLinhasTabela(lista, tipo) {
  return lista
    .filter(j => typeof j.tempo === 'number')
    .slice(0, 5)
    .map((j, index) => {
      if (tipo === "pontuacao") {
        return `<tr><td>${index + 1}</td><td>${j.nome}</td><td>${j.pontuacao}</td></tr>`;
      } else if (tipo === "tempo") {
        return `<tr><td>${index + 1}</td><td>${j.nome}</td><td>${formatarTempo(j.tempo)}</td></tr>`;
      }
    }).join("");
}

async function verificarConquistas() {
  // Buscar conquistas já obtidas pelo usuário
  const conquistasExistentes = await fetch(`http://localhost:3000/conquistasUsuarios?idUsuario=${idUsuario}`)
    .then(res => res.json())
    .catch(err => []);

  const idsConquistasExistentes = conquistasExistentes.map(c => Number(c.idAchievement));

  // Buscar ranking
  const ranking = await fetch("http://localhost:3000/ranking").then(r => r.json());

  const novasConquistas = [];

  // ID 2 – Top 3 em 5 níveis (jogos 1 ou 2)
  const top3PorNivel = {};
  for (const jogoId of ["1", "2"]) {
    ranking.filter(r => r.idJogo === jogoId).forEach(registro => {
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

  // ID 4 – Completar 10 níveis de caça-palavras (jogo 2)
  const niveisCaca = ranking.filter(r => r.idJogo === "2" && r.idUsuario === idUsuario);
  const niveisUnicos = new Set(niveisCaca.map(j => j.nivel));
  if (niveisUnicos.size >= 10 && !idsConquistasExistentes.includes(4)) {
    novasConquistas.push(4);
  }

  // ID 5 – Terminar rápido (memória até 60s, caça até 90s)
  const rapido = ranking.some(j =>
    (j.idJogo === "2" && j.tempo <= 90 || j.idJogo === "1" && j.tempo <= 60) &&
    j.idUsuario === idUsuario
  );
  if (rapido && !idsConquistasExistentes.includes(5)) {
    novasConquistas.push(5);
  }

  // ID 7 – Caça-palavras: 10 níveis em até 1:50
  const niveisRapidos = ranking.filter(r =>
    r.idJogo === "2" && r.tempo <= 110 && r.idUsuario === idUsuario
  );
  const niveisRapidosUnicos = new Set(niveisRapidos.map(j => j.nivel));
  if (niveisRapidosUnicos.size >= 10 && !idsConquistasExistentes.includes(7)) {
    novasConquistas.push(7);
  }

  // Registrar novas conquistas no backend
  for (const idAchievement of novasConquistas) {
    await fetch("http://localhost:3000/conquistasUsuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idUsuario, idAchievement })
    });
  }
}

