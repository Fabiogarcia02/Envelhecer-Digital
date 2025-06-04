const tam = 20;
const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZÁÀÂÃÉÊÍÓÔÕÚÜÇ";
const matriz = Array.from({length: tam}, ()=> Array(tam).fill(""));

window.onload = () =>{
    let container = document.getElementById("containerCacaPalavras");
    container.innerHTML = "";
    for (let x = 0; x < letras.length; x++) {
        for (let y = 0; y < letras.length; y++) {
            if (matriz[x][y] == "") {
                matriz[x][y] = letras[Math.floor(Math.random() * letras.length)];
                container.innerHTML += `<span>${matriz[x][y]}</span>`;
            }
        }        
    }
}