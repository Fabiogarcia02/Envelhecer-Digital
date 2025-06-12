const API_URL = 'http://localhost:3000/achievements';

const achievementsGrid = document.getElementById('achievements-grid');
const filterButtons = document.querySelectorAll('.filter-btn');

let allAchievements = [];

async function fetchAchievements() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Falha ao buscar conquistas: ' + response.status);
    }
    const data = await response.json();
    allAchievements = data;
    renderAchievements(allAchievements);
  } catch (error) {
    console.error(error);
    achievementsGrid.innerHTML = `<p>Erro ao carregar conquistas.</p>`;
  }
}

function renderAchievements(achievements) {
  achievementsGrid.innerHTML = '';
  if (achievements.length === 0) {
    achievementsGrid.innerHTML = `<p>Nenhuma conquista encontrada.</p>`;
    return;
  }
  achievements.forEach((item, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('data-game', item.game);

    // Delay para animação em cascata
    card.style.animationDelay = `${index * 0.05}s`;

    // Emoji
    const emojiElem = document.createElement('div');
    emojiElem.classList.add('emoji');
    emojiElem.textContent = item.emoji || '⭐';

    // Título
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
    if (btn.getAttribute('data-game') === gameKey) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const cards = document.querySelectorAll('.card');
  if (gameKey === 'all') {
    cards.forEach(card => card.classList.remove('hidden'));
  } else {
    cards.forEach(card => {
      if (card.getAttribute('data-game') === gameKey) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }
}

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const gameKey = btn.getAttribute('data-game');
    applyFilter(gameKey);
  });
});

fetchAchievements().then(() => {
  applyFilter('all');
});
