document.addEventListener('DOMContentLoaded', function() {
  // Elementos do modal
  const modal = document.getElementById('addModal');
  const btn = document.getElementById('addNewCard');
  const span = document.getElementsByClassName('close')[0];
  const form = document.getElementById('passwordForm');

  // Abre o modal
  btn.onclick = function() {
    modal.style.display = 'block';
  }

  // Fecha o modal
  span.onclick = function() {
    modal.style.display = 'none';
  }

  // Fecha o modal ao clicar fora
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  }

  // Carrega os dados do db.json
  async function loadPasswords() {
    try {
      const response = await fetch('db.json');
      const data = await response.json();
      renderPasswords(data);
    } catch (error) {
      console.error('Erro ao carregar senhas:', error);
    }
  }

  // Renderiza os cards na tela
  function renderPasswords(data) {
    const container = document.querySelector('.password-container');
    
    // Limpa os cards existentes (exceto os cabeçalhos)
    document.querySelectorAll('.password-card').forEach(card => card.remove());
    
    // Agrupa por plataforma
    const platforms = {};
    data.forEach(item => {
      if (!platforms[item.platform]) {
        platforms[item.platform] = [];
      }
      platforms[item.platform].push(item);
    });
    
    // Renderiza cada plataforma
    for (const [platform, items] of Object.entries(platforms)) {
      // Adiciona título da plataforma
      const platformTitle = document.createElement('h2');
      platformTitle.className = 'platform-title';
      platformTitle.textContent = platform;
      container.appendChild(platformTitle);
      
      // Adiciona cards da plataforma
      items.forEach(item => {
        const cardHTML = `
          <div class="password-card" data-id="${item.id}">
            <div class="service-logo">
              <i class="fas ${getPlatformIcon(item.platform)}"></i>
            </div>
            <div class="service-info">
              <div class="service-name">${item.serviceName}</div>
              <div class="service-description">${item.serviceDescription}</div>
            </div>
            <div class="password-section">
              <div class="password masked">••••••••</div>
              <button class="action-btn reveal" title="Mostrar senha">
                <i class="fas fa-eye"></i>
              </button>
              <button class="action-btn delete" title="Excluir senha">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
      });
    }
    
    // Adiciona event listeners aos novos cards
    document.querySelectorAll('.password-card').forEach(card => {
      addCardEventListeners(card, data);
    });
  }

  // Função auxiliar para obter ícone baseado na plataforma
  function getPlatformIcon(platform) {
    const icons = {
      'plataforma y': 'fa-university',
      'plataforma z': 'fa-mobile-alt',
      'outros': 'fa-globe'
    };
    return icons[platform] || 'fa-question-circle';
  }

  // Função para adicionar event listeners a um card
  function addCardEventListeners(card, data) {
    const revealBtn = card.querySelector('.reveal');
    const deleteBtn = card.querySelector('.delete');
    const cardId = card.dataset.id;
    const passwordElement = card.querySelector('.password');
    
    // Encontra o item correspondente nos dados
    const item = data.find(i => i.id == cardId);
    
    if (!item) return;
    
    revealBtn.addEventListener('click', function() {
      if (passwordElement.classList.contains('masked')) {
        passwordElement.textContent = item.password;
        passwordElement.classList.remove('masked');
        this.innerHTML = '<i class="fas fa-eye-slash"></i>';
      } else {
        passwordElement.textContent = '••••••••';
        passwordElement.classList.add('masked');
        this.innerHTML = '<i class="fas fa-eye"></i>';
      }
    });
    
    deleteBtn.addEventListener('click', async function() {
      if (confirm(`Tem certeza que deseja excluir a senha de ${item.serviceName}?`)) {
        try {
          // Remove do db.json
          const updatedData = data.filter(i => i.id != cardId);
          await savePasswords(updatedData);
          
          // Remove da tela
          card.style.transform = 'translateX(100%)';
          card.style.opacity = '0';
          setTimeout(() => card.remove(), 300);
        } catch (error) {
          console.error('Erro ao excluir senha:', error);
        }
      }
    });
  }

  // Salva os dados no db.json
  async function savePasswords(data) {
    try {
      const response = await fetch('db.json', {
        method: 'POST', // Em um servidor real seria PUT ou POST
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error) {
      console.error('Erro ao salvar senhas:', error);
    }
  }

  // Manipulador do formulário
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const newItem = {
      id: Date.now(), // ID único baseado no timestamp
      serviceName: document.getElementById('serviceName').value,
      serviceDescription: document.getElementById('serviceDescription').value,
      password: document.getElementById('password').value,
      platform: document.getElementById('platform').value
    };
    
    try {
      // Carrega os dados existentes
      const response = await fetch('db.json');
      let data = await response.json();
      if (!Array.isArray(data)) data = [];
      
      // Adiciona o novo item
      data.push(newItem);
      
      // Salva os dados atualizados
      await savePasswords(data);
      
      // Recarrega a lista
      await loadPasswords();
      
      // Fecha o modal e limpa o formulário
      modal.style.display = 'none';
      form.reset();
    } catch (error) {
      console.error('Erro ao adicionar nova senha:', error);
    }
  });

  // Inicializa a aplicação
  loadPasswords();
});

