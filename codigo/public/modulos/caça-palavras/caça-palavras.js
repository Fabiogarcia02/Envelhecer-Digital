const tam = 20;
const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZÁÀÂÃÉÊÍÓÔÕÚÇ";
const matriz = Array.from({length: tam}, () => Array(tam).fill(""));
const palavras = ["SENHA", "BRADESCO", "CAIXA"];
window.onload = () =>{
    for(let i = 0; i < palavras.length; i++ ){   
        inserePalavra(palavras[i]);
    }
    let container = document.getElementById("containerCacaPalavras");
    container.innerHTML = "";
    for (let x = 0; x < tam; x++) {
        for (let y = 0; y < tam; y++) {
            if (matriz[x][y] == "") {
                matriz[x][y] = letras[Math.floor(Math.random() * letras.length)];
            }
        }        
    }

    for (let x = 0; x < tam; x++) {
        for (let y = 0; y < tam; y++) {
                container.innerHTML += `<span>${matriz[x][y]}</span>`;
        }        
    }
}

function inserePalavra(palavra) {
    let inserida = false;
    while (inserida == false) {
        const x = Math.floor(Math.random() * (tam - palavra.length + 1));
        const y = Math.floor(Math.random() * tam );
        if(podeInserir(palavra, x, y, 0, 1)){
            for (let i = 0; i < palavra.length; i++) {
                matriz[y][x+i] = palavra[i];
            }
            inserida = true;
        }
    }
}

function podeInserir(palavra, x, y, dx, dy) {
  for (let i = 0; i < palavra.length; i++) {
    const nx = x + i * dx;
    const ny = y + i * dy;
    if (nx < 0 || nx >= tam || ny < 0 || ny >= tam || (matriz[ny][nx] !== "" && matriz[ny][nx] !== palavra[i])) {
      return false;
    }
  }
  return true;
}