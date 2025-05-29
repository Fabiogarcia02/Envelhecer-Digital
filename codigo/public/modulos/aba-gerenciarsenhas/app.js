const senhas = [
  {
    nome: "Banco 01",
    descricao: "Senha do aplicativo do banco",
    senha: "senha1234",
    plataforma: "Plataforma X",
    imageApp: "imagens/logo_banco.png",
    videoLink: "https://www.youtube.com/watch?v=123456",
    pdf: "arquivos/banco01.pdf"
  },
  {
    nome: "Rede Social 02",
    descricao: "Senha da rede social principal",
    senha: "senha5678",
    plataforma: "Plataforma Y",
    imageApp: "imagens/logo_rede.png",
    videoLink: "https://www.youtube.com/watch?v=abcdef",
    pdf: "arquivos/rede02.pdf"
  },
  {
    nome: "Banco 02",
    descricao: "Senha do segundo banco",
    senha: "senha9999",
    plataforma: "Plataforma Z",
    imageApp: "imagens/logo_banco2.png",
    videoLink: "https://www.youtube.com/watch?v=ghijkl",
    pdf: "arquivos/banco02.pdf"
  }
];

function gerarCards() {
  const container = document.getElementById("cardsContainer");

  senhas.forEach(senha => {
    const videoId = new URL(senha.videoLink).searchParams.get("v");

    const card = document.createElement("section");
    card.classList.add("card");

    card.innerHTML = `
      <span class="plataforma">${senha.plataforma}</span>
      <div class="card-content">
        <img class="Logo_APPs" src="${senha.imageApp}" alt="">
        <div class="middle-content">
          <h2>${senha.nome}</h2>
          <p>${senha.descricao}</p>
        </div>
        <div class="pdf_conteiner">
          <a href="#" class="video-link" data-video-id="${videoId}">
            <button class="video-btn"></button>
          </a>
          <a href="${senha.pdf}" target="_blank">
            <img class="Logo_PDF" src="imagens/logo_pdf-2.0.png" alt="PDF">
            <p>PDF</p>
          </a>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  document.querySelectorAll('.video-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const videoId = this.getAttribute('data-video-id');
      openVideoModal(videoId);
    });
  });

  document.querySelector('.close-modal').addEventListener('click', closeVideoModal);

  document.getElementById('videoModal').addEventListener('click', function (e) {
    if (e.target === this) {
      closeVideoModal();
    }
  });
}

function openVideoModal(videoId) {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoFrame');

  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  modal.style.display = 'flex';
}

function closeVideoModal() {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoFrame');

  iframe.src = '';
  modal.style.display = 'none';
}

function voltarHome() {
  window.location.href = "index.html";
}

window.onload = gerarCards;
