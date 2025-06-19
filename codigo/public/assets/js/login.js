const LOGIN_URL = "login.html";
const API_URL = `/usuarios`;

let usuarioCorrente = {};

// Gera UUID...
function generateUUID() {
    var d = new Date().getTime();
    var d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;
        if (d > 0) {
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function initLoginApp() {
    const usuarioCorrenteJSON = localStorage.getItem('usuarioCorrente');
    if (usuarioCorrenteJSON) {
        usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
    }
}

async function loginUser(login, senha) {
    try {
        const res = await fetch(`${API_URL}?login=${login}&senha=${senha}`);
        const users = await res.json();

        if (users.length > 0) {
            const usuario = users[0];
            usuarioCorrente = {
                id: usuario.id,
                login: usuario.login,
                email: usuario.email,
                nome: usuario.nome
            };
            localStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.error("Erro ao tentar logar:", err);
        return false;
    }
}

async function addUser(nome, login, senha, email) {
    const novoUsuario = {
        id: generateUUID(),
        login,
        senha,
        nome,
        email
    };

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novoUsuario)
        });

        if (res.ok) {
            console.log("Usuário criado com sucesso.");
        } else {
            console.error("Erro ao criar usuário.");
            alert("Erro ao salvar o usuário. Verifique o console.");
        }
    } catch (err) {
        console.error("Erro de rede ao adicionar usuário:", err);
        alert("Erro ao salvar o usuário. Verifique o console.");
    }
}

async function processaFormLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const resultadoLogin = await loginUser(username, password);

    if (resultadoLogin) {
        window.location.href = 'index.html';
    } else {
        alert('Usuário ou senha incorretos');
    }
}

function salvaLogin(event) {
    event.preventDefault();

    const login = document.getElementById('txt_login').value.trim();
    const nome = document.getElementById('txt_nome').value.trim();
    const email = document.getElementById('txt_email').value.trim();
    const senha = document.getElementById('txt_senha').value;
    const senha2 = document.getElementById('txt_senha2').value;

    if (!login || !nome || !email || !senha || !senha2) {
        alert('Preencha todos os campos.');
        return;
    }

    if (senha !== senha2) {
        alert('As senhas informadas não conferem.');
        return;
    }

    addUser(nome, login, senha, email);
    alert('Usuário salvo com sucesso. Proceda com o login.');

    const modalEl = document.getElementById('loginModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    modalInstance.hide();
}

function logoutUser() {
    usuarioCorrente = {};
    localStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));
    window.location = LOGIN_URL;
}

initLoginApp();

document.getElementById('login-form').addEventListener('submit', processaFormLogin);
document.getElementById('btn_salvar').addEventListener('click', salvaLogin);

document.getElementById('openModalBtn').addEventListener('click', () => {
    const modal = new bootstrap.Modal(document.getElementById('loginModal'));
    modal.show();
});
