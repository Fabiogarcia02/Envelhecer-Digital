document.addEventListener('DOMContentLoaded', function() {
    const passwords = {
        "Banko Irsesta": "b4nk0!r$",
        "Rede Social": "s0c!@lM3d!@",
        "Iznus platamain": "!znu$P@55"
    };
    
    function addCardEventListeners(card) {
        const revealBtn = card.querySelector('.reveal');
        const deleteBtn = card.querySelector('.delete');
        const serviceName = card.querySelector('.service-name').textContent;
        
        if (!passwords[serviceName]) {
            passwords[serviceName] = "NovaSenha123";
        }
        
        revealBtn.addEventListener('click', function() {
            const passwordElement = card.querySelector('.password');
            
            if (passwordElement.classList.contains('masked')) {
                passwordElement.textContent = passwords[serviceName];
                passwordElement.classList.remove('masked');
                this.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                passwordElement.textContent = '••••••••';
                passwordElement.classList.add('masked');
                this.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
        
        deleteBtn.addEventListener('click', function() {
            if (confirm(`Tem certeza que deseja excluir a senha de ${serviceName}?`)) {
                card.style.transform = 'translateX(100%)';
                card.style.opacity = '0';
                
                setTimeout(() => {
                    card.remove();
                    delete passwords[serviceName];
                }, 300);
            }
        });
    }
    
    document.querySelectorAll('.password-card').forEach(card => {
        addCardEventListeners(card);
    });
    
    document.getElementById('addNewCard').addEventListener('click', function() {
        const newCardHTML = `
        <div class="password-card">
            <div class="service-logo">
                <i class="fas fa-plus-circle"></i>
            </div>
            <div class="service-info">
                <div class="service-name">Novo Serviço</div>
                <div class="service-description">Descrição do novo serviço</div>
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
        
        const container = document.querySelector('.password-container');
        const firstCard = document.querySelector('.password-card');
        if (firstCard) {
            firstCard.insertAdjacentHTML('beforebegin', newCardHTML);
        } else {
            const lastTitle = document.querySelector('.platform-title:last-of-type') || 
                              document.querySelector('.header-container');
            lastTitle.insertAdjacentHTML('afterend', newCardHTML);
        }
        
        const newCard = document.querySelector('.password-card:first-of-type');
        addCardEventListeners(newCard);
    });
}); 