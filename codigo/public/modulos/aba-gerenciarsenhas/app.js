document.addEventListener('DOMContentLoaded', function() {
    const API_URL = '/passwords';
    const modal = document.getElementById('addModal');
    const addBtn = document.getElementById('addNewCard');
    const closeBtn = document.getElementsByClassName('close')[0];
    const form = document.getElementById('passwordForm');

    addBtn.onclick = () => modal.style.display = 'block';
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (event) => event.target === modal ? modal.style.display = 'none' : null;

    // Carrega as senhas ao iniciar
    loadPasswords();

    //carregar senhas
    async function loadPasswords() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            renderPasswords(data);
        } catch (error) {
            console.error('Erro ao carregar senhas:', error);
            alert('Erro ao carregar senhas. Verifique se o json-server está rodando.');
        }
    }

    // Mostra as senhas na tela
    function renderPasswords(passwords) {
    const container = document.querySelector('.password-container');

    const cards = container.querySelectorAll('.password-card');
    cards.forEach(card => card.remove());

    passwords.forEach(password => {
        const card = createPasswordCard(password);
        container.appendChild(card);
    });
}

    // Cria um card de senha
    function createPasswordCard(password) {
        const card = document.createElement('div');
        card.className = 'password-card';
        card.dataset.id = password.id;

        card.innerHTML = `
            <div class="service-logo">
                <i class="fas fa-key"></i>
            </div>
            <div class="service-info">
                <div class="service-name">${password.serviceName}</div>
                <div class="service-description">${password.serviceDescription}</div>
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
        `;

        // Adiciona os eventos ao card
        addCardEvents(card, password);
        return card;
    }

    // Adiciona eventos a um card
    function addCardEvents(card, password) {
        const revealBtn = card.querySelector('.reveal');
        const deleteBtn = card.querySelector('.delete');
        const passwordElement = card.querySelector('.password');

        //mostrar/ocultar senha
        revealBtn.addEventListener('click', () => {
            if (passwordElement.classList.contains('masked')) {
                passwordElement.textContent = password.password;
                passwordElement.classList.remove('masked');
                revealBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
                revealBtn.title = "Ocultar senha";
            } else {
                passwordElement.textContent = '••••••••';
                passwordElement.classList.add('masked');
                revealBtn.innerHTML = '<i class="fas fa-eye"></i>';
                revealBtn.title = "Mostrar senha";
            }
        });

        //deletar senha
        deleteBtn.addEventListener('click', async () => {
            if (confirm(`Tem certeza que deseja excluir a senha de ${password.serviceName}?`)) {
                try {
                    await deletePassword(password.id);
                    card.remove();
                } catch (error) {
                    console.error('Erro ao excluir senha:', error);
                    alert('Erro ao excluir senha.');
                }
            }
        });
    }

    //adicionar nova senha
    async function addPassword(password) {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(password)
        });
        return response.json();
    }

    //deletar senha
    async function deletePassword(id) {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
    }

    // Evento do formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newPassword = {
            serviceName: document.getElementById('serviceName').value,
            serviceDescription: document.getElementById('serviceDescription').value,
            password: document.getElementById('password').value
        };

        try {
            await addPassword(newPassword);
            await loadPasswords();
            modal.style.display = 'none';
            form.reset();
        } catch (error) {
            console.error('Erro ao adicionar senha:', error);
            alert('Erro ao adicionar senha.');
        }
    });
});