// Seleciona o container onde os comentários aparecem
const comentariosContainer = document.querySelector('.comentario-conteiner-recente section');

function exibirComentario(texto) {

  const p = document.createElement('p');
  p.classList.add('comentario-p-recente');
  p.textContent = texto;

  const btnExcluir = document.createElement('button');
  btnExcluir.textContent = 'Excluir';
  btnExcluir.style.marginLeft = '10px';
  btnExcluir.style.backgroundColor = '#ff4c4c';
  btnExcluir.style.border = 'none';
  btnExcluir.style.color = 'white';
  btnExcluir.style.borderRadius = '8px';
  btnExcluir.style.cursor = 'pointer';
  btnExcluir.style.padding = '2px 8px';

  btnExcluir.addEventListener('click', () => {
    comentariosContainer.removeChild(p);
    comentariosContainer.removeChild(btnExcluir);
  });


  comentariosContainer.appendChild(p);
  comentariosContainer.appendChild(btnExcluir);
}

document.querySelector('.comentario-button').addEventListener('click', () => {
  const inputNomeJogo = document.querySelector('.comentario-form input[type="text"]');
  const inputNota = document.querySelector('.comentario-form input[type="number"]');
  const textareaComentario = document.querySelector('.comentario-form textarea');

  const nomeJogo = inputNomeJogo.value.trim();
  const nota = inputNota.value.trim();
  const comentario = textareaComentario.value.trim();

  if (!nomeJogo || !nota || !comentario) {
    alert('Por favor, preencha todos os campos antes de enviar.');
    return;
  }

  const textoExibir = `Jogo: ${nomeJogo} | Nota: ${nota} | Comentário: ${comentario}`;
  exibirComentario(textoExibir);
  inputNomeJogo.value = '';
  inputNota.value = '';
  textareaComentario.value = '';
});
