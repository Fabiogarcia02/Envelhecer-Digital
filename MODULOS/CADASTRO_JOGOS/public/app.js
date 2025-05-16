const API_URL = "http://localhost:3000/jogos";


function displayMessage(msg) {
    document.getElementById("msg").innerHTML =
        `<div class="alert alert-warning">${msg}</div>`;
}

// Exibe todos os jogos na tabela
function exibeJogos() {
    fetch(API_URL)
        .then(res => res.json())
        .then(jogos => {
            let tabela = document.getElementById("table-jogos");
            tabela.innerHTML = "";
            jogos.forEach(jogo => {
                tabela.innerHTML += `
                    <tr>
                        <td>${jogo.id}</td>
                        <td>${jogo.nome}</td>
                        <td>${jogo.imagem}</td>
                        <td>${jogo.urlJogo}</td>
                        <td>${jogo.tipo}</td>
                        <td>${jogo.destaques ? 'Sim' : 'Não'}</td>
                        <td>${jogo.habilidades}</td>
                        <td>${jogo.descricao}</td>
                    </tr>`;
            });
        })
        .catch(() => displayMessage("Erro ao carregar os jogos."));
}

// Insere novo jogo
function insertJogo(jogo) {
    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jogo)
    })
    .then(res => res.json())
    .then(() => {
        displayMessage("Jogo inserido com sucesso.");
        exibeJogos();
    })
    .catch(() => displayMessage("Erro ao inserir jogo."));
}

// Altera jogo existente
function updateJogo(id, jogo) {
    fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jogo)
    })
    .then(() => {
        displayMessage("Jogo alterado com sucesso.");
        exibeJogos();
    })
    .catch(() => displayMessage("Erro ao alterar jogo."));
}

// Exclui jogo
function deleteJogo(id) {
    fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    })
    .then(() => {
        displayMessage("Jogo removido com sucesso.");
        exibeJogos();
    })
    .catch(() => displayMessage("Erro ao excluir jogo."));
}

// Coleta os dados do formulário
function obterDadosFormulario() {
    return {
        nome: document.getElementById("inputNome").value,
        imagem: document.getElementById("inputImagem").value,
        urlJogo: document.getElementById("inputURLJogo")?.value,
        tipo: document.getElementById("inputTipo").value,
        destaques: document.getElementById("inputDestaques").value === "1",
        habilidades: document.getElementById("inputHabilidades").value,
        descricao: document.getElementById("inputDesc").value
    };
}

// Limpa o formulário
function limparFormulario() {
    document.getElementById("form-jogo").reset();
    document.getElementById("inputId").value = "";
}

// Inicializa os eventos da interface
document.addEventListener('DOMContentLoaded', () => {
    exibeJogos();

    document.getElementById("btnInsert").addEventListener("click", () => {
        const jogo = obterDadosFormulario();
         if (!jogo.nome.trim() || !jogo.imagem.trim() || !jogo.tipo.trim() || !jogo.habilidades.trim() || !jogo.descricao.trim() || !jogo.urlJogo) {
            displayMessage("Preencha todos os campos");
            return;
        }
        insertJogo(jogo);
        limparFormulario();
    });

    document.getElementById("btnUpdate").addEventListener("click", () => {
        const id = document.getElementById("inputId").value;
        if (!id) return displayMessage("Selecione um jogo para alterar.");
        const jogo = obterDadosFormulario();
        updateJogo(id, jogo);
        limparFormulario();
    });

    document.getElementById("btnDelete").addEventListener("click", () => {
        const id = document.getElementById("inputId").value;
        if (!id) return displayMessage("Selecione um jogo para excluir.");
        deleteJogo(id);
        limparFormulario();
    });

    document.getElementById("btnClear").addEventListener("click", limparFormulario);

    document.querySelector("#table-jogos").addEventListener("click", (event) => {
        if (event.target.tagName === "TD") {
            const linha = event.target.parentElement;
            const colunas = linha.querySelectorAll("td");
            document.getElementById("inputId").value = colunas[0].innerText;
            document.getElementById("inputNome").value = colunas[1].innerText;
            document.getElementById("inputImagem").value = colunas[2].innerText;
            document.getElementById("inputURLJogo").value = colunas[3].innerText;
            document.getElementById("inputTipo").value = colunas[4].innerText;
            document.getElementById("inputDestaques").value = colunas[5].innerText === "Sim" ? "1" : "2";
            document.getElementById("inputHabilidades").value = colunas[6].innerText;
            document.getElementById("inputDesc").value = colunas[7].innerText;
        }
    });

    // Oculta a mensagem após 5 segundos
    const msgElement = document.getElementById("msg");
    if (msgElement) {
        const observer = new MutationObserver(() => {
            setTimeout(() => {
                const alerta = msgElement.querySelector(".alert");
                if (alerta) {
                    alerta.style.transition = "opacity 0.5s";
                    alerta.style.opacity = 0;
                    setTimeout(() => alerta.remove(), 500);
                }
            }, 5000);
        });
        observer.observe(msgElement, { childList: true });
    }
});
