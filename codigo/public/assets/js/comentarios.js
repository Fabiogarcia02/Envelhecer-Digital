const comentariosContainer = document.querySelector('.comentarios-lista');
const form = document.querySelector('.comentario-form');

const usuarioCorrente = JSON.parse(sessionStorage.getItem('usuarioCorrente'));
const usuarioId = usuarioCorrente?.id;

function criarComentarioElemento(comentario) {
  const divComentario = document.createElement('div');
  divComentario.classList.add('comentario-item');

  const paragrafo = document.createElement('p');
  paragrafo.classList.add('comentario-p-recente');
  paragrafo.textContent = 
    `Jogo: ${comentario.nomeJogo} | Usuário: ${comentario.nomeUsuario} | Nota: ${comentario.nota} | Comentário: ${comentario.comentario}`;

  // Cria o container dos botões
  const divBotoes = document.createElement('div');
  divBotoes.classList.add('botoes-comentario');

  const botaoExcluir = document.createElement('button');
  botaoExcluir.textContent = 'Excluir';
  botaoExcluir.classList.add('botao-excluir');
  botaoExcluir.addEventListener('click', () => excluirComentario(comentario.id));

  const botaoEditar = document.createElement('button');
  botaoEditar.textContent = 'Editar';
  botaoEditar.classList.add('botao-editar');
  botaoEditar.addEventListener('click', () => prepararEdicao(comentario));

  divBotoes.appendChild(botaoEditar);
  divBotoes.appendChild(botaoExcluir);

  divComentario.appendChild(paragrafo);
  divComentario.appendChild(divBotoes);

  comentariosContainer.appendChild(divComentario);
}

async function carregarComentarios() {
  comentariosContainer.innerHTML = '';

  const [comentarios, usuarios, jogos] = await Promise.all([
    fetch('/comentarios').then(res => res.json()),
    fetch('/usuarios').then(res => res.json()),
    fetch('/jogos').then(res => res.json())
  ]);

  comentarios.forEach(comentario => {
    const usuario = usuarios.find(u => u.id == comentario.idUsuario);
    const jogo = jogos.find(j => j.id == comentario.idJogo);

    const nomeUsuario = usuario ? usuario.nome : 'Desconhecido';
    const nomeJogo = jogo ? jogo.tipo : 'Desconhecido';

    criarComentarioElemento({
      ...comentario,
      nomeUsuario,
      nomeJogo
    });
  });
}

function handleSubmit(event) {
  event.preventDefault();

  const idJogo = document.getElementById('jogo').value;
  const nota = document.getElementById('nota').value.trim();
  const textoComentario = document.getElementById('comentario').value.trim();

  if (!idJogo || !nota || !textoComentario) {
    alert('Preencha todos os campos!');
    return;
  }

  fetch('/comentarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idJogo,
      idUsuario: usuarioId,
      nota,
      comentario: textoComentario
    })
  })
  .then(() => {
    carregarComentarios();
    form.reset();
  })
  .catch(erro => console.log('Erro ao enviar o comentário:', erro));
}

function excluirComentario(id) {
  fetch('/comentarios/' + id, {
    method: 'DELETE'
  })
  .then(() => carregarComentarios())
  .catch(err => console.log('Erro ao excluir:', err));
}

function prepararEdicao(comentario) {
  document.getElementById('jogo').value = comentario.idJogo;
  document.getElementById('nota').value = comentario.nota;
  document.getElementById('comentario').value = comentario.comentario;

  const botao = document.querySelector('.comentario-button');
  botao.textContent = 'Salvar edição';

  function editarComentario(event) {
    event.preventDefault();

    const novoJogo = document.getElementById('jogo').value;
    const novaNota = document.getElementById('nota').value;
    const novoComentario = document.getElementById('comentario').value;

    fetch('/comentarios/' + comentario.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idJogo: novoJogo,
        idUsuario: usuarioId,
        nota: novaNota,
        comentario: novoComentario
      })
    })
    .then(() => {
      carregarComentarios();
      botao.textContent = 'Enviar';
      form.removeEventListener('submit', editarComentario);
      form.addEventListener('submit', handleSubmit);
      form.reset();
    })
    .catch(err => console.log('Erro ao editar:', err));
  }

  form.removeEventListener('submit', handleSubmit);
  form.addEventListener('submit', editarComentario);
}

form.addEventListener('submit', handleSubmit);

carregarComentarios();
