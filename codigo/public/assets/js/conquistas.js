const API_URL = 'http://localhost:3000/achievements';
const achievementsGrid = document.getElementById('achievements-grid');
const filterButtons = document.querySelectorAll('.filter-btn');

let allAchievements = [];
let userAchievements = [];

const usuarioCorrente = JSON.parse(localStorage.getItem("usuarioCorrente"));
const idUsuario = usuarioCorrente?.id;

window.onload = () => {
  if (!usuarioCorrente || !usuarioCorrente.id) {
    alert("Você precisa estar logado para ver suas conquistas.");
    window.location.href = 'login.html';
    return;
  }
  fetchAchievements();
};


async function fetchAchievements() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao buscar conquistas');
    allAchievements = await response.json();

    // Buscar conquistas do usuário logado
    const conquistasUsuarioRes = await fetch(`http://localhost:3000/conquistasUsuarios?idUsuario=${encodeURIComponent(idUsuario)}`);
    if (!conquistasUsuarioRes.ok) throw new Error('Erro ao buscar conquistas do usuário');
    const conquistasUsuario = await conquistasUsuarioRes.json();
    const idsUsuario = conquistasUsuario.map(c => String(c.idAchievement));

    // Corrigido: converte c.id para string para garantir comparação correta
    userAchievements = allAchievements.filter(c => idsUsuario.includes(String(c.id)));

    renderAchievements(userAchievements);
    applyFilter('all');

  } catch (error) {
    console.error(error);
    achievementsGrid.innerHTML = `<p>Erro ao carregar conquistas.</p>`;
  }
}

function renderAchievements(achievements) {
  achievementsGrid.innerHTML = '';
  if (achievements.length === 0) {
    achievementsGrid.innerHTML = `<p>Você ainda não desbloqueou nenhuma conquista.</p>`;
    return;
  }

  achievements.forEach((item, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('data-game', item.idJogo); // Corrigido para usar idJogo

    card.style.animationDelay = `${index * 0.05}s`;

    const emojiElem = document.createElement('div');
    emojiElem.classList.add('emoji');
    emojiElem.textContent = item.emoji || '⭐';

    const titleElem = document.createElement('div');
    titleElem.classList.add('title');
    titleElem.textContent = item.title;

    card.appendChild(emojiElem);
    card.appendChild(titleElem);
    achievementsGrid.appendChild(card);
  });
}

function applyFilter(gameKey) {
  filterButtons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-game') === gameKey);
  });

  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    const cardGame = card.getAttribute('data-game');
    const show = gameKey === 'all' || cardGame === gameKey;
    card.classList.toggle('hidden', !show);
  });
}

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const gameKey = btn.getAttribute('data-game');
    applyFilter(gameKey);
  });
});
