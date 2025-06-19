// =======================
// Script do Carrossel de Personas
// =======================
const slider = document.getElementById('slider');
const personas = slider.querySelectorAll('.persona');
let index = 0;

// Função que mostra o slide atual e esconde os outros
function showSlide(i) {
    slider.style.transform = `translateX(-${i * 100}%)`;

    personas.forEach((persona, idx) => {
        if (idx === i) {
            persona.classList.add('active');
        } else {
            persona.classList.remove('active');
        }
    });
}

// Inicializa o primeiro slide
showSlide(index);

// Troca automática a cada 10 segundos
setInterval(() => {
    index = (index + 1) % personas.length;
    showSlide(index);
}, 10000);

// =======================
// Script da FAQ (Dúvidas Frequentes)
// =======================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        item.classList.toggle('active');
    });
});
