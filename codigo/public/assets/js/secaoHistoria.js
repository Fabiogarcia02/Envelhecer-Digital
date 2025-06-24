const slider = document.getElementById('slider');
const personas = slider.querySelectorAll('.persona');
let currentIndex = 0;

function showSlide(index) {
  if(index < 0) index = personas.length - 1;
  if(index >= personas.length) index = 0;
  currentIndex = index;

  slider.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// Troca automática a cada 10 segundos
setInterval(() => {
  showSlide(currentIndex + 1);
}, 10000);

// Inicializa o slider
showSlide(currentIndex);
