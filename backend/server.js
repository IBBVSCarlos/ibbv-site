app.post("/proxy", async (req, res) => {
  const googleAppsScriptURL = "https://script.google.com/macros/s/AKfycbxS86WLc8WdqKEIXTM48ifeBMPbnHXVrM_tsu3dYlYLUQ1uZ0owk53UJmeykUysncfb/exec";

  try {
    console.log("🔄 Recebendo requisição para /proxy...");
    console.log("📤 Enviando dados para Google Apps Script:", req.body);

    const response = await fetch(googleAppsScriptURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.text();
    console.log("✅ Resposta do Google Apps Script:", data);
    res.send(data);
  } catch (error) {
    console.error("❌ Erro ao conectar ao Google Apps Script:", error);
    res.status(500).send("❌ Erro ao conectar ao Google Apps Script.");
  }
});
