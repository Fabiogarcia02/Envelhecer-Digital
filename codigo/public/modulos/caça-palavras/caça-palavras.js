const tam = 20;
const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZÁÀÂÃÉÊÍÓÔÕÚÇ";
const matriz = Array.from({ length: tam }, () => Array(tam).fill(""));
const palavras = ["SENHA", "BRADESCO", "CAIXA", "LOREM", "PASTA"];
let selectPalavra = [];
let selecionado = false;
let startX = null;
let startY = null;
let dirX = null;
let dirY = null;

window.onload = () => {
    for (let i = 0; i < palavras.length; i++) {
        let direcao = Math.floor(Math.random() * 3);
        switch (direcao) {
            case 0:
                insereHorizontal(palavras[i]);
                break;
            case 1:
                insereVertical(palavras[i]);
                break;
            case 2:
                insereDiagonal(palavras[i]);
                break;
        }
    }

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
};

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
    selectPalavra.forEach(el => el.classList.remove("selecionada"));
    selectPalavra = [];
}

function selecionaIntervalo(startX, startY, endX, endY) {
    limpaSelecao();
    let dx = endX - startX;
    let dy = endY - startY;
    const denominador = Math.abs(mdc(dx, dy)) || 1;
    dx = dx / denominador;
    dy = dy / denominador;

    let x = startX;
    let y = startY;
    const letras = document.querySelectorAll(".letra");

    while ((x !== endX || y !== endY) && x >= 0 && x < tam && y >= 0 && y < tam) {
        const index = x * tam + y;
        const el = letras[index];
        if (el) {
            el.classList.add("selecionada");
            selectPalavra.push(el);
        }

        x += dx;
        y += dy;
    }

    if (x === endX && y === endY && x >= 0 && x < tam && y >= 0 && y < tam) {
        const index = x * tam + y;
        const el = letras[index];
        if (el) {
            el.classList.add("selecionada");
            selectPalavra.push(el);
        }
    }
}

document.addEventListener("mousedown", e => {
    if (e.target.classList.contains("letra")){
        const letras = document.querySelectorAll(".letra");
        const index = Array.from(letras).indexOf(e.target);
        startX = Math.floor(index / tam);
        startY = index % tam;
        limpaSelecao();
        e.target.classList.add("selecionada");
        selectPalavra.push(e.target);
        selecionado = true;
    }
});

document.addEventListener("mouseover", e => {
    if (selecionado && e.target.classList.contains("letra")) {
        const letras = document.querySelectorAll(".letra");
        const index = Array.from(letras).indexOf(e.target);
        const x = Math.floor(index / tam);
        const y = index % tam;

        let dx = x - startX;
        let dy = y - startY;
        const denominador = Math.abs(mdc(dx, dy));

        if (denominador !== 0) {
            dx /= denominador;
            dy /= denominador;

            if (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) {
                selecionaIntervalo(startX, startY, x, y);
            }
        }
    }
});


document.addEventListener("mouseup", () => {
    selecionado = false;
    startX = null;
    startY = null;
    selectPalavra = [];
});

