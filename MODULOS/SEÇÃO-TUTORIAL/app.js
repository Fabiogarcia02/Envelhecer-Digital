const videos = [
    {
        plataforma: "Santander",
        imageApp: "imagens/Logo_Santander.png",
        description: "Tutorial completo com passo a passo da recarga no Santander.",
        videoLink: "https://www.youtube.com/watch?v=vPcdWETgu3A",
        pdf: "PDFs/Tutorial_Santander.pdf"
    },
    {
        plataforma: "Itaú",
        imageApp: "imagens/Logo_Itaú.png",
        description: "Aprenda como baixar o app do Itaú em poucos passos.",
        videoLink: "https://www.youtube.com/watch?v=TPx7pEuMkvo",
        pdf: "PDFs/Tutorial_Itaú.pdf"
    },
    {
        plataforma: "Banco do Brasil",
        imageApp: "imagens/Logo_Banco_do_Brasil.png",
        description: "Veja como instalar e acessar o aplicativo do Banco do Bransil.",
        videoLink: "https://www.youtube.com/watch?v=hhe2dRRks98",
        pdf: "PDFs/Tutorial_Banco_do_Brasil.pdf"
    },
    {
        plataforma: "INSS",
        imageApp: "imagens/Logo_INSS.png",
        description: "Guia prático para acessar o app Meu INSS.",
        videoLink: "https://www.youtube.com/watch?v=2ztRnE4AYUE",
        pdf: "PDFs/Tutorial_INSS.pdf"
    }
];

function gerarCards() {
    const container = document.getElementById("cardsContainer");

    videos.forEach(video => {
        const videoId = new URL(video.videoLink).searchParams.get("v");
        const thumbUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;

        const card = document.createElement("section");
        card.classList.add("card");

        card.innerHTML = `
            <span class="plataforma">${video.plataforma}</span>
            <div class="card-content">
                <img class="Logo_APPs" src="${video.imageApp}" alt="">
                <div class="middle-content">
                    <a href="${video.videoLink}" target="_blank">
                        <img src="${thumbUrl}" alt="Thumbnail do vídeo" class="video-thumb">
                    </a>
                    <small>${video.description}</small>
                </div>
                <div class="pdf_conteiner">
                    <a href="${video.pdf}" class="pdf-link" target="_blank">
                        <img class="Logo_PDF" src="imagens/Logo_PDF.png" alt="">
                        <p>PDF</p>
                    </a>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

function voltarHome() {
    window.location.href = "index.html";
}

window.onload = gerarCards;
