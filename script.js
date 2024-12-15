async function fetchJSON(url, method = "GET", body = null) {
    const options = { method, headers: { "Content-Type": "application/json" } };
    if (body) options.body = JSON.stringify(body);
    const response = await fetch(url, options);
    return await response.json();
}

// Load articles from the server
async function loadArticles() {
    const articlesPanel = document.getElementById("articlesPanel");
    articlesPanel.style.display = "block";
    document.getElementById("createPanel").style.display = "none";
    document.getElementById("adminPanel").style.display = "none";

    const articles = await fetchJSON("/articles");
    articlesPanel.innerHTML = articles
        .map(article => `<div><h3>${article.title}</h3><p>${article.content}</p></div>`)
        .join("");
}

// Create a new article
async function createArticle() {
    const title = document.getElementById("articleTitle").value;
    const content = document.getElementById("articleContent").value;

    if (!title || !content) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const result = await fetchJSON("/articles", "POST", { title, content });
    if (result.success) {
        alert("Artículo creado exitosamente.");
        loadArticles();
    }
}

// Show/hide panels
function showCreatePanel() {
    document.getElementById("createPanel").style.display = "block";
    document.getElementById("articlesPanel").style.display = "none";
    document.getElementById("adminPanel").style.display = "none";
}

function showAdminPanel() {
    document.getElementById("adminPanel").style.display = "block";
    document.getElementById("articlesPanel").style.display = "none";
    document.getElementById("createPanel").style.display = "none";
}

function logout() {
    alert("Sesión cerrada.");
}
