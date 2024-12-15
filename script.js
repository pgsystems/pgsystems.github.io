// Cambiar entre paneles
function showPanel(panelId) {
    document.getElementById("homePanel").style.display = "none";
    document.getElementById("createPanel").style.display = "none";
    document.getElementById("adminPanel").style.display = "none";
    document.getElementById(panelId).style.display = "block";
}

// Cargar artículos desde el backend
async function loadArticles() {
    const articles = await fetchJSON("/articles");
    const articlesList = document.getElementById("articlesList");
    articlesList.innerHTML = articles
        .map(article => `<div><h3>${article.title}</h3><p>${article.content}</p></div>`)
        .join("");
}

// Crear nuevo artículo
async function createArticle() {
    const title = document.getElementById("articleTitle").value;
    const content = document.getElementById("articleContent").value;

    if (!title || !content) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const response = await fetchJSON("/articles", "POST", { title, content });
    if (response.success) {
        alert("Artículo creado exitosamente.");
        showPanel("homePanel");
        loadArticles();
    }
}

// Fetch Helper
async function fetchJSON(url, method = "GET", body = null) {
    const options = { method, headers: { "Content-Type": "application/json" } };
    if (body) options.body = JSON.stringify(body);
    const response = await fetch(url, options);
    return response.json();
}

// Cargar usuarios
async function loadUsers() {
    const users = await fetchJSON("/users");
    const usersList = document.getElementById("usersList");
    usersList.innerHTML = users
        .map(user => `<div>${user.username}</div>`)
        .join("");
}
