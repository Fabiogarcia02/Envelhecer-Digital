document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('addModal');
    const btn = document.getElementById('addNewCard');
    const span = document.getElementsByClassName('close')[0];
    const form = document.getElementById('passwordForm');

    btn.onclick = function() {
        modal.style.display = 'block';
    }

    span.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    async function loadPasswords() {
    try {
        const response = await fetch('http://localhost:3000/passwords');
        const data = await response.json();
        renderPasswords(data);
    } catch (error) {
        console.error('Erro ao carregar senhas:', error);
    }
}


    function renderPasswords(data) {
        const container = document.querySelector('.password-container');
        const header = document.querySelector('.header-container');
        container.innerHTML = '';
        container.appendChild(header);
        
        data.forEach(item => {
            const cardHTML = `
                <div class="password-card" data-id="${item.id}">
                    <div class="service-logo">
                        <i class="fas fa-key"></i>
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
        
        document.querySelectorAll('.password-card').forEach(card => {
            addCardEventListeners(card, data);
        });
    }

    function addCardEventListeners(card, data) {
        const revealBtn = card.querySelector('.reveal');
        const deleteBtn = card.querySelector('.delete');
        const cardId = card.dataset.id;
        const passwordElement = card.querySelector('.password');
        
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
        
        deleteBtn.addEventListener('click', async function () {
    if (confirm(`Tem certeza que deseja excluir a senha de ${item.serviceName}?`)) {
        try {
            await deletePassword(item.id);
            card.style.transform = 'translateX(100%)';
            card.style.opacity = '0';
            setTimeout(() => card.remove(), 300);
        } catch (error) {
            console.error('Erro ao excluir senha:', error);
        }
    }
});

    }

    async function addPassword(item) {
    try {
        const response = await fetch('http://localhost:3000/passwords', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
        });
        return response.json();
    } catch (error) {
        console.error('Erro ao salvar senha:', error);
    }
}


    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const newItem = {
            id: Date.now(),
            serviceName: document.getElementById('serviceName').value,
            serviceDescription: document.getElementById('serviceDescription').value,
            password: document.getElementById('password').value
        };
        
        try {
            const response = await fetch('db.json');
            let data = await response.json();
            if (!Array.isArray(data)) data = [];
            
            data.push(newItem);
            
            await savePasswords(data);
            await loadPasswords();
            
            modal.style.display = 'none';
            form.reset();
        } catch (error) {
            console.error('Erro ao adicionar nova senha:', error);
        }
    });

    loadPasswords();
});
async function deletePassword(id) {
    try {
        await fetch(`http://localhost:3000/passwords/${id}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error('Erro ao deletar senha:', error);
    }
}
