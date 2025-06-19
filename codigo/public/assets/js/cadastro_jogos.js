const API_URL = "http://localhost:3000/jogos";
function displayMessage(msg) {
    const div = document.getElementById("msg");
    if (div) {
        div.innerHTML = `<div class="alert alert-warning">${msg}</div>`;
    } else {
        alert(msg); 
    }
}


document.addEventListener("DOMContentLoaded", function () {
    const selectTipo = document.getElementById("inputTipo");

    const camposMemoria = document.querySelectorAll(".camposMemoria");
    const camposCacaPalavras = document.querySelectorAll(".camposCacaPalavras");
    const camposQuiz = document.querySelectorAll(".camposQuiz");

    function esconderTodos() {
        camposMemoria.forEach(el => el.style.display = "none");
        camposCacaPalavras.forEach(el => el.style.display = "none");
        camposQuiz.forEach(el => el.style.display = "none");
    }

    function mostrarCamposDoTipo(tipo) {
        if (tipo === "jogo-memoria") {
            camposMemoria.forEach(el => el.style.display = "flex");
        } else if (tipo === "caca-palavras") {
            camposCacaPalavras.forEach(el => el.style.display = "flex");
        } else if (tipo === "quiz") {
            camposQuiz.forEach(el => el.style.display = "flex");
        }
    }
    
    // Oculta todos os campos ao carregar
    esconderTodos();
    
    // Verifica se algum tipo já está selecionado
    if (selectTipo.value) {
        mostrarCamposDoTipo(selectTipo.value);
    }
    selectTipo.addEventListener("change", function () {
        esconderTodos();
        mostrarCamposDoTipo(this.value);
    
        // Busque e exiba os níveis do tipo selecionado
        fetch(API_URL)
    .then(res => {
        if (!res.ok) throw new Error("Erro HTTP: " + res.status);
        return res.json();
    })
    .then(jogos => {
        const tipoSelecionado = selectTipo.value.toLowerCase().trim();
        const jogoSelecionado = jogos.find(j => j.tipo.toLowerCase().trim() === tipoSelecionado);

        if (jogoSelecionado) {
            exibirNiveis(jogoSelecionado);
        } else {
            displayMessage("Tipo de jogo não encontrado.");
        }

    })
    .catch((erro) => {
        console.error("Erro no fetch:", erro);
        displayMessage("Erro ao carregar os dados do jogo.");
    });
    });
});

function obterDadosNivel() {
    const tipo = document.getElementById("inputTipo").value;
    const nivel = document.getElementById("inputNivel").value;

    if (!tipo) return null;

    if (tipo === "jogo-memoria") {
        const cartas = [];
        for (let i = 1; i <= 12; i++) {
            const imagem = document.getElementById(`inputImagem${i}`).value;
            const descricao = document.getElementById(`inputDesc${i}`).value;
            cartas.push({ imagem, descricao });
        }
        return { tipo, nivel, cartas };

    } else if (tipo === "caca-palavras") {
        const palavras = [];
        for (let i = 1; i <= 8; i++) {
            const palavra = document.getElementById(`inputPalavras${i}`).value;
            if (palavra) palavras.push(palavra);
        }
        return { tipo, nivel, palavras };

    } else if (tipo === "quiz") {
        const pergunta = document.getElementById("inputPergunta").value;
        const respostaCorreta = document.getElementById("inputRespostaCorreta").value;

        const respostasIncorretas = [];
        for (let i = 1; i <= 5; i++) {
            const campo = document.getElementById(`inputRespostaIncorreta${i}`);
            if (campo && campo.value) {
                respostasIncorretas.push(campo.value);
            }
        }

        return {
            tipo,
            nivel,
            pergunta,
            respostaCorreta,
            respostasIncorretas
        };
    }

    return null;
}


function insertNivel() {
    const dados = obterDadosNivel();
    
    if (!dados) {
        displayMessage("Dados inválidos.");
        return;
    }
    
    fetch(API_URL)
    .then(res => res.json())
    .then(jogos => {
        const jogo = jogos.find(j => j.tipo === dados.tipo);
        
        if (!jogo) {
            displayMessage("Tipo de jogo não encontrado.");
            return;
        }
        
        if (!dados.nivel) {
            dados.nivel = (jogo.niveis.length + 1).toString();
        }
            const niveis = jogo.niveis || [];

            const nivelExistente = niveis.find(n => n.nivel === dados.nivel);
            if (nivelExistente) {
                displayMessage(`O nível ${dados.nivel} já existe para esse tipo de jogo.`);
                return;
            }

            let novoNivel = {};
            if (dados.tipo === "jogo-memoria") {
                novoNivel = { nivel: jogo.niveis.length + 1, cartas: dados.cartas };
            } else if (dados.tipo === "caca-palavras") {
                novoNivel = {
                    id: jogo.niveis.length + 1,
                    titulo: "Caça-palavras",
                    nivel: jogo.niveis.length + 1 , 
                    palavras: dados.palavras 
                };
            } else if (dados.tipo === "quiz") {
                const respostas = [
                { texto: dados.respostaCorreta, correta: true },
                    ...dados.respostasIncorretas.map(texto => ({ texto, correta: false }))
                ];

                novoNivel = {
                    id: jogo.niveis.length + 1,
                    nivel: jogo.niveis.length + 1,
                    pergunta: dados.pergunta,
                    respostas
                };
            }

            // Atualiza o jogo com o novo nível
            jogo.niveis.push(novoNivel);

            fetch(`${API_URL}/${jogo.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jogo)
            })
            .then(() => {
                displayMessage(`Nível ${novoNivel.nivel} adicionado com sucesso!`);
                limparFormularioNivel();
                exibirNiveis(jogo);
            })
            .catch(() => displayMessage("Erro ao salvar o nível.")); 
    });
}

function limparFormularioNivel() {
    const tipo = document.getElementById("inputTipo").value;
    document.getElementById("form-jogo").reset();
    document.getElementById("inputTipo").value = tipo;
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btnInsert").addEventListener("click", insertNivel);
    document.getElementById("btnUpdate").addEventListener("click", updateNivel);
    document.getElementById("btnDelete").addEventListener("click", deleteNivel);
    document.getElementById("btnClear").addEventListener("click", limparFormularioNivel);
});

function updateNivel() {
    const dados = obterDadosNivel();
    if (!dados) {
        displayMessage("Dados inválidos.");
        return;
    }

    fetch(API_URL)
        .then(res => res.json())
        .then(jogos => {
            const jogo = jogos.find(j => j.tipo === dados.tipo);
            if (!jogo) {
                displayMessage("Tipo de jogo não encontrado.");
                return;
            }

            const index = jogo.niveis.findIndex(n => String(n.nivel).trim() === String(dados.nivel).trim());
            if (index === -1) {
                displayMessage("Nível não encontrado.");
                return;
            }

            let nivelAtualizado = {};
            if (dados.tipo === "jogo-memoria") {
                nivelAtualizado = { nivel: dados.nivel, cartas: dados.cartas };
            } else if (dados.tipo === "caca-palavras") {
                nivelAtualizado = { nivel: dados.nivel, palavras: dados.palavras };
            } else if (dados.tipo === "quiz") {
                    nivelAtualizado = {
                    nivel: dados.nivel,
                    pergunta: dados.pergunta,
                    respostas: [
                        { texto: dados.respostaCorreta, correta: true },
                        ...dados.respostasIncorretas.map(texto => ({ texto, correta: false }))
                    ]
                };
            }

            jogo.niveis[index] = nivelAtualizado;

            fetch(`${API_URL}/${jogo.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jogo)
            })
            .then(() => {
                displayMessage("Nível alterado com sucesso.");
                limparFormularioNivel();
                exibirNiveis(jogo)
            })
            .catch(() => displayMessage("Erro ao atualizar o nível."));
        })
        .catch(() => displayMessage("Erro ao buscar os dados."));
}

function deleteNivel() {
    const tipo = document.getElementById("inputTipo").value;
    const nivel = parseInt(document.getElementById("inputNivel").value);

    if (!tipo || isNaN(nivel)) {
        displayMessage("Preencha o tipo e o número do nível para excluir.");
        return;
    }

    fetch(API_URL)
        .then(res => res.json())
        .then(jogos => {
            const jogo = jogos.find(j => j.tipo === tipo);
            if (!jogo) {
                displayMessage("Tipo de jogo não encontrado.");
                return;
            }
            const novosNiveis = jogo.niveis.filter(n => {
                const numNivel = parseInt(n.nivel);
                return isNaN(numNivel) || numNivel !== nivel;
            });

            if (novosNiveis.length === jogo.niveis.length) {
                displayMessage("Nível não encontrado.");
                return;
            }

            jogo.niveis = novosNiveis;

            fetch(`${API_URL}/${jogo.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jogo)
            })
            .then(() => {
                displayMessage("Nível excluído com sucesso.");
                limparFormularioNivel();
                exibirNiveis(jogo)
                
            })
            .catch(() => displayMessage("Erro ao excluir o nível."));
        })
        .catch(() => displayMessage("Erro ao acessar os dados."));
}

function exibirNiveis(jogo) {
    const container = document.getElementById("grid-jogos");
    container.innerHTML = ""; // Limpa tudo

    if (jogo.tipo === "jogo-memoria") {
        const tabelaImagens = document.createElement("table");
        tabelaImagens.id = "grid-memoria-imagens";
        const tabelaDescricoes = document.createElement("table");
        tabelaDescricoes.id = "grid-memoria-descricoes";

        // Cabeçalho Imagens
        const theadImg = document.createElement("thead");
        const trImgHead = document.createElement("tr");
        trImgHead.innerHTML = "<th>Nível</th>";
        for (let i = 1; i <= 12; i++) {
            trImgHead.innerHTML += `<th>Img ${i}</th>`;
        }
        theadImg.appendChild(trImgHead);
        tabelaImagens.appendChild(theadImg);

        // Cabeçalho Descrições
        const theadDesc = document.createElement("thead");
        const trDescHead = document.createElement("tr");
        trDescHead.innerHTML = "<th>Nível</th>";
        for (let i = 1; i <= 12; i++) {
            trDescHead.innerHTML += `<th>Desc ${i}</th>`;
        }
        theadDesc.appendChild(trDescHead);
        tabelaDescricoes.appendChild(theadDesc);

        const tbodyImg = document.createElement("tbody");
        const tbodyDesc = document.createElement("tbody");

        jogo.niveis.forEach((nivel) => {
            const trImg = document.createElement("tr");
            const trDesc = document.createElement("tr");

            trImg.style.cursor = "pointer";
            trDesc.style.cursor = "pointer";

            trImg.innerHTML = `<td>${nivel.nivel}</td>`;
            trDesc.innerHTML = `<td>${nivel.nivel}</td>`;

            for (let i = 0; i < 12; i++) {
                const carta = nivel.cartas[i] || { imagem: "", descricao: "" };
                trImg.innerHTML += `<td>${carta.imagem}</td>`;
                trDesc.innerHTML += `<td>${carta.descricao}</td>`;
            }

            trImg.addEventListener("click", () => preencherFormularioNivel(jogo.tipo, nivel));
            trDesc.addEventListener("click", () => preencherFormularioNivel(jogo.tipo, nivel));

            tbodyImg.appendChild(trImg);
            tbodyDesc.appendChild(trDesc);
        });

        tabelaImagens.appendChild(tbodyImg);
        tabelaDescricoes.appendChild(tbodyDesc);

        container.appendChild(document.createElement("h4")).innerText = "Imagens";
        container.appendChild(tabelaImagens);
        container.appendChild(document.createElement("h4")).innerText = "Descrições";
        container.appendChild(tabelaDescricoes);

    } else {
        const tabela = document.createElement("table");
        const thead = document.createElement("thead");
        const trHead = document.createElement("tr");

        if (jogo.tipo === "caca-palavras") {
            trHead.innerHTML += "<th>Nível</th>";
            for (let i = 1; i <= 8; i++) {
                trHead.innerHTML += `<th>Palavra ${i}</th>`;
            }
        } else if (jogo.tipo === "quiz") {
            trHead.innerHTML += `
                <th>Nível</th>
                <th>Pergunta</th>
                <th>Resposta Correta</th>
            `;
            for (let i = 1; i <= 5; i++) {
                trHead.innerHTML += `<th>Resposta Incorreta ${i}</th>`;
            }
        }

        thead.appendChild(trHead);
        tabela.appendChild(thead);

        const tbody = document.createElement("tbody");

        jogo.niveis.forEach((nivel) => {
            const tr = document.createElement("tr");
            tr.style.cursor = "pointer";
            tr.addEventListener("click", () => preencherFormularioNivel(jogo.tipo, nivel));
            if (jogo.tipo === "caca-palavras") {
                tr.innerHTML += `<td>${nivel.nivel}</td>`;
                for (let i = 0; i < 8; i++) {
                    tr.innerHTML += `<td>${nivel.palavras[i] || ""}</td>`;
                }
            } else if (jogo.tipo === "quiz") {
                // Aqui pega a resposta correta e as incorretas do array 'respostas'
                if (Array.isArray(nivel.respostas)) {
                const correta = nivel.respostas.find(r => r.correta)?.texto || "";
                const incorretas = nivel.respostas.filter(r => !r.correta).map(r => r.texto);

                tr.innerHTML += `<td>${nivel.nivel}</td>`;
                tr.innerHTML += `<td>${nivel.pergunta}</td>`;
                tr.innerHTML += `<td>${correta}</td>`;

                for (let i = 0; i < 5; i++) {
                    tr.innerHTML += `<td>${incorretas[i] || ""}</td>`;
                }
            }
        }
        tbody.appendChild(tr);
    });

        tabela.appendChild(tbody);
        container.appendChild(tabela);
    }
}

function preencherFormularioNivel(tipo, nivel) {
    document.getElementById("inputNivel").value = nivel.nivel;
    document.getElementById("inputTipo").value = tipo;

    if (tipo === "jogo-memoria") {
        nivel.cartas.forEach((carta, i) => {
            document.getElementById(`inputImagem${i+1}`).value = carta.imagem;
            document.getElementById(`inputDesc${i+1}`).value = carta.descricao;
        });
    } else if (tipo === "caca-palavras") {
        nivel.palavras.forEach((palavra, i) => {
            document.getElementById(`inputPalavras${i+1}`).value = palavra;
        });
    } else if (tipo === "quiz") {
        document.getElementById("inputPergunta").value = nivel.pergunta;
        const correta = nivel.respostas.find(r => r.correta);
        const incorretas = nivel.respostas.filter(r => !r.correta);

        document.getElementById("inputRespostaCorreta").value = correta?.texto || "";

        for (let i = 0; i < 5; i++) {
            const campo = document.getElementById(`inputRespostaIncorreta${i + 1}`);
            if (campo) campo.value = incorretas[i]?.texto || "";
        }
    }
}
