const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;
const DATA_PATH = "data.json";

app.use(express.json());
app.use(express.static("public"));

// Obtener artículos
app.get("/articles", (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
    res.json(data.articles);
});

// Crear artículo
app.post("/articles", (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
    const newArticle = { title: req.body.title, content: req.body.content };
    data.articles.push(newArticle);
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    res.json({ success: true });
});

// Obtener usuarios
app.get("/users", (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
    res.json(data.users);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
