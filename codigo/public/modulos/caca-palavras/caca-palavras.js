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

window.onload = () => {
    fetch("/jogos")
        .then(response => response.json())
        .then(data => {
            jogosJson = data;
            carregarNivel(nivelAtual);
        });
};

function carregarNivel(nivel) {
    const jogo = jogosJson.find(j => j.nivel === nivel);
    if (!jogo) return;

    nivelAtual = nivel;
    palavras = jogo.palavras;
    palavrasEncontradas = 0;
    listItems = [];

    for (let x = 0; x < tam; x++) {
        for (let y = 0; y < tam; y++) {
            matriz[x][y] = "";
        }
    }
    const level = document.getElementById("levelTitle");
    level.innerHTML = `Nivel - ${nivelAtual}`;
    const listaUl = document.getElementById("listWords");
    listaUl.innerHTML = "";

    palavras.forEach(palavra => {
        let direcao = Math.floor(Math.random() * 3);
        switch (direcao) {
            case 0:
                insereHorizontal(palavra);
                break;
            case 1:
                insereVertical(palavra);
                break;
            case 2:
                insereDiagonal(palavra);
                break;
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

        selectPalavra.forEach(el => el.classList.add("fixa"));

        // Verifica se todas as palavras foram encontradas
        if (palavrasEncontradas === palavras.length) {
            setTimeout(() => {
                carregarNivel(nivelAtual + 1); 
            }, 300);
        }
    }

    selecionado = false;
    startX = null;
    startY = null;
    selectPalavra = [];
    e.preventDefault();
}


document.addEventListener("mousedown", startSelection);
document.addEventListener("touchstart", startSelection);

document.addEventListener("mouseover", moveSelection);
document.addEventListener("touchmove", moveSelection);

document.addEventListener("mouseup", endSelection);
document.addEventListener("touchend", endSelection);
