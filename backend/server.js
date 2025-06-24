const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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
    res.status(500).send("Erro ao conectar ao Google Apps Script.");
  }
});

app.listen(PORT, () => {
  console.log(`Proxy CORS rodando na porta ${PORT}`);
});
