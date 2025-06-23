document.addEventListener('DOMContentLoaded', function () {
      const API_URL = '/passwords';
      const modal = document.getElementById('addModal');
      const addBtn = document.getElementById('addNewCard');
      const closeBtn = document.getElementsByClassName('close')[0];
      const form = document.getElementById('passwordForm');
      const passwordList = document.getElementById('passwordList');
      const modalTitle = document.getElementById('modalTitle');
      const editIdField = document.getElementById('editId');

      addBtn.onclick = () => {
        modal.style.display = 'flex';
        modalTitle.textContent = 'Adicionar Nova Senha';
        form.reset();
        editIdField.value = '';
      };

      closeBtn.onclick = () => modal.style.display = 'none';
      window.onclick = (event) => {
        if (event.target === modal) modal.style.display = 'none';
      };

      loadPasswords();

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

      function renderPasswords(passwords) {
        passwordList.innerHTML = '';
        passwords.forEach(password => {
          const card = createPasswordCard(password);
          passwordList.appendChild(card);
        });
      }

      function createPasswordCard(password) {
        const card = document.createElement('div');
        card.className = 'password-card';
        card.dataset.id = password.id;
        const logoClass = getLogoColorClass(password.serviceName);
        card.innerHTML = `
          <div class="service-logo ${logoClass}">
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
            <button class="action-btn edit" title="Editar senha">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete" title="Excluir senha">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>`;
        addCardEvents(card, password);
        return card;
      }

      function addCardEvents(card, password) {
        const revealBtn = card.querySelector('.reveal');
        const deleteBtn = card.querySelector('.delete');
        const editBtn = card.querySelector('.edit');
        const passwordElement = card.querySelector('.password');

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

        editBtn.addEventListener('click', () => {
          modal.style.display = 'flex';
          modalTitle.textContent = 'Editar Senha';
          document.getElementById('serviceName').value = password.serviceName;
          document.getElementById('serviceDescription').value = password.serviceDescription;
          document.getElementById('password').value = password.password;
          editIdField.value = password.id;
        });
      }

      async function addPassword(password) {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(password)
        });
        return response.json();
      }

      async function updatePassword(id, password) {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(password)
        });
        return response.json();
      }

      async function deletePassword(id) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      }

      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const passwordData = {
          serviceName: document.getElementById('serviceName').value,
          serviceDescription: document.getElementById('serviceDescription').value,
          password: document.getElementById('password').value
        };

        try {
          const editId = editIdField.value;
          if (editId) {
            await updatePassword(editId, passwordData);
          } else {
            await addPassword(passwordData);
          }
          await loadPasswords();
          modal.style.display = 'none';
          form.reset();
        } catch (error) {
          console.error('Erro ao salvar senha:', error);
          alert('Erro ao salvar senha.');
        }
      });
    });

    function getLogoColorClass(name) {
      const nome = name.toLowerCase();
      if (nome.includes("banco")) return "logo-banco";
      if (nome.includes("email") || nome.includes("e-mail")) return "logo-email";
      if (nome.includes("social") || nome.includes("rede")) return "logo-social";
      return "logo-padrao";
    }