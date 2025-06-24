const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota de teste para verificar se o proxy está funcionando
app.get("/", (req, res) => {
  res.send("✅ Proxy CORS está rodando!");
});

// Rota para encaminhar requisições ao Google Apps Script
app.post("/proxy", async (req, res) => {
  const googleAppsScriptURL = "https://script.google.com/macros/s/AKfycbxS86WLc8WdqKEIXTM48ifeBMPbnHXVrM_tsu3dYlYLUQ1uZ0owk53UJmeykUysncfb/exec";

  try {
    const response = await fetch(googleAppsScriptURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.text();
    res.send(data);
  } catch (error) {
    console.error("❌ Erro ao conectar ao Google Apps Script:", error);
    res.status(500).send("❌ Erro ao conectar ao Google Apps Script.");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy CORS rodando na porta ${PORT}`);
});
