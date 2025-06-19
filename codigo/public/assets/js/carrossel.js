// ====================
// Carrossel
// ====================

// Seletores principais
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');
const carousel = document.querySelector('.carousel');
const list = document.querySelector('.list');
const runningTime = document.querySelector('.carousel .timeRunning');

let timeRunning = 3000;       // Tempo de animação das setas (ms)
let timeAutoNext = 7000;      // Tempo para trocar automaticamente (ms)

// Eventos de clique nas setas
nextBtn.onclick = () => showSlider('next');
prevBtn.onclick = () => showSlider('prev');

let runTimeOut;
let runNextAuto = setTimeout(() => {
    nextBtn.click();
}, timeAutoNext);

// Função para resetar a barra de progresso
function resetTimeAnimation() {
    runningTime.style.animation = 'none';
    runningTime.offsetHeight; // Força o reflow
    runningTime.style.animation = null;
    runningTime.style.animation = 'runningTime 7s linear forwards';
}

// Função principal do carrossel
function showSlider(type) {
    const sliderItems = list.querySelectorAll('.carousel .list .item');

    if (type === 'next') {
        list.appendChild(sliderItems[0]);
        carousel.classList.add('next');
    } else {
        list.prepend(sliderItems[sliderItems.length - 1]);
        carousel.classList.add('prev');
    }

    clearTimeout(runTimeOut);

    runTimeOut = setTimeout(() => {
        carousel.classList.remove('next');
        carousel.classList.remove('prev');
    }, timeRunning);

    clearTimeout(runNextAuto);
    runNextAuto = setTimeout(() => {
        nextBtn.click();
    }, timeAutoNext);

    resetTimeAnimation();
}


// ====================
// Página de detalhes dos jogos
// ====================

// Pegando parâmetros da URL
const urlParams = new URLSearchParams(window.location.search);
const id = parseInt(urlParams.get('jogo'));  // Alterei de 'id' para 'jogo' para bater com o seu URL

if (id) {
    fetch('db.json')
        .then(response => response.json())
        .then(data => {
            const jogo = data.jogos.find(j => j.id === id);

            if (jogo) {
                document.getElementById('titulo').textContent = jogo.titulo;
                document.getElementById('imagem').src = jogo.imagem;
                document.getElementById('descricao').textContent = jogo.descricao;
                document.getElementById('link-jogar').href = jogo.link;
            } else {
                document.getElementById('jogo-container').innerHTML = "<p>Jogo não encontrado.</p>";
            }
        })
        .catch(error => {
            console.error('Erro ao carregar dados:', error);
            document.getElementById('jogo-container').innerHTML = "<p>Erro ao carregar os dados.</p>";
        });
}

// Função auxiliar para abrir detalhes (usada nos botões do carrossel)
function verDetalhes(jogoId) {
    window.open(`detalhes-jogos.html?jogo=${jogoId}`, '_blank');
}
