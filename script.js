const ROLES = {
    GUEST: 0,
    COLLABORATOR: 1,
    MODERATOR: 2,
    ADMIN: 3
};

let users = JSON.parse(localStorage.getItem('users')) || [
    { username: 'pgsystems', password: 'Coco8520', role: ROLES.ADMIN, banned: false },
];

let articles = JSON.parse(localStorage.getItem('articles')) || [
    { title: 'Bienvenido', content: 'Bienvenido a TechnoWiki.', author: 'admin', history: [] }
];

let currentUser = null;
let currentArticleIndex = 0;

function saveData() {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('articles', JSON.stringify(articles));
}

function login() {
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const loginError = document.getElementById('loginError');

    const user = users.find(u => u.username === usernameInput && u.password === passwordInput);

    if (user) {
        if (user.banned) {
            loginError.textContent = 'Usuario baneado. No puede iniciar sesión.';
            return;
        }

        currentUser = user;
        loginError.textContent = '';
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('editorSection').style.display = 'block';
        updateUserInterface();
    } else {
        loginError.textContent = 'Credenciales incorrectas. Intenta de nuevo.';
    }
}

function register() {
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const loginError = document.getElementById('loginError');

    if (users.find(u => u.username === usernameInput)) {
        loginError.textContent = 'El nombre de usuario ya está en uso.';
        return;
    }

    users.push({ username: usernameInput, password: passwordInput, role: ROLES.COLLABORATOR, banned: false });
    saveData();
    loginError.textContent = 'Registro exitoso. Ahora puedes iniciar sesión.';
}

function enterAsGuest() {
    currentUser = { username: 'Invitado', role: ROLES.GUEST };
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('editorSection').style.display = 'block';
    updateUserInterface();
}

function logout() {
    currentUser = null;
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('editorSection').style.display = 'none';
}

function updateUserInterface() {
    const userInfo = document.getElementById('userInfo');
    const editorControls = document.getElementById('editorControls');
    const adminPanel = document.getElementById('adminPanel');
    const createSection = document.getElementById('createSection');

    userInfo.textContent = `Usuario: ${currentUser.username} | Rol: ${Object.keys(ROLES)[currentUser.role]}`;
    document.getElementById('mainEditor').value = articles[currentArticleIndex].content;

    editorControls.style.display = currentUser.role >= ROLES.COLLABORATOR ? 'block' : 'none';
    adminPanel.style.display = currentUser.role === ROLES.ADMIN ? 'block' : 'none';
    createSection.style.display = currentUser.role >= ROLES.MODERATOR ? 'block' : 'none';

    updateVersionSelect();
    updateUserManagement();
}

function updateVersionSelect() {
    const versionSelect = document.getElementById('versionSelect');
    versionSelect.innerHTML = '';

    articles[currentArticleIndex].history.forEach((_, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `Versión ${index + 1}`;
        versionSelect.appendChild(option);
    });
}

function updateUserManagement() {
    const userManagement = document.getElementById('userManagement');
    userManagement.innerHTML = '';

    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.username;
        option.textContent = `${user.username} (Rol: ${Object.keys(ROLES)[user.role]})`;
        userManagement.appendChild(option);
    });
}

function saveEdit() {
    const editArea = document.getElementById('editArea').value;
    if (editArea.trim() === '') return alert('No puedes guardar un cambio vacío.');

    const article = articles[currentArticleIndex];
    article.history.push(article.content);
    article.content = editArea;

    saveData();
    document.getElementById('mainEditor').value = article.content;
    alert('Edición guardada exitosamente.');
    updateVersionSelect();
}

function proposeEdit() {
    if (currentUser.role < ROLES.COLLABORATOR) {
        alert('No tienes permiso para proponer ediciones.');
        return;
    }

    alert('Tu propuesta de edición ha sido enviada para revisión.');
}

function viewVersion() {
    const versionSelect = document.getElementById('versionSelect');
    const selectedVersion = versionSelect.value;

    if (selectedVersion !== '') {
        document.getElementById('mainEditor').value = articles[currentArticleIndex].history[selectedVersion];
    }
}

function searchArticles() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    const results = articles.filter(a => a.title.toLowerCase().includes(query));

    if (results.length === 0) {
        searchResults.textContent = 'No se encontraron resultados.';
    } else {
        results.forEach(article => {
            const div = document.createElement('div');
            div.textContent = article.title;
            div.onclick = () => {
                currentArticleIndex = articles.indexOf(article);
                document.getElementById('mainEditor').value = article.content;
                updateUserInterface();
            };
            searchResults.appendChild(div);
        });
    }
}

function createSection() {
    const sectionTitle = document.getElementById('sectionTitle').value;
    const sectionContent = document.getElementById('sectionContent').value;

    if (!sectionTitle || !sectionContent) {
        alert('Por favor completa todos los campos.');
        return;
    }

    articles.push({ title: sectionTitle, content: sectionContent, author: currentUser.username, history: [] });
    saveData();
    alert('Nuevo apartado creado exitosamente.');
}

function banUser() {
    const userManagement = document.getElementById('userManagement');
    const selectedUser = users.find(u => u.username === userManagement.value);

    if (selectedUser) {
        selectedUser.banned = true;
        saveData();
        alert(`${selectedUser.username} ha sido baneado.`);
    }
}

function promoteUser() {
    const userManagement = document.getElementById('userManagement');
    const selectedUser = users.find(u => u.username === userManagement.value);

    if (selectedUser && selectedUser.role < ROLES.ADMIN) {
        selectedUser.role++;
        saveData();
        alert(`${selectedUser.username} ha sido promovido.`);
    }
}

function changeRole() {
    const userManagement = document.getElementById('userManagement');
    const selectedUser = users.find(u => u.username === userManagement.value);

    if (selectedUser) {
        const newRole = prompt('Introduce el nuevo rol (0: Invitado, 1: Colaborador, 2: Moderador, 3: Admin):');

        if (newRole !== null && !isNaN(newRole) && newRole >= 0 && newRole <= 3) {
            selectedUser.role = parseInt(newRole);
            saveData();
            alert(`El rol de ${selectedUser.username} ha sido cambiado.`);
        } else {
            alert('Rol inválido.');
        }
    }
}
