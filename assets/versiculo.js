import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

async function buscarVersiculoDoDia() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto("https://www.bibliaonline.com.br/acf");

  const versiculo = await page.evaluate(() => {
    return document.querySelector(".versiculo").innerText.trim();
  });

  if (!versiculo) {
    console.error("❌ Erro ao capturar versículo do dia.");
    await browser.close();
    return;
  }

  const hoje = new Date().toISOString().slice(0, 10);
  const novoVersiculo = {
    data: hoje,
    livro: "Versículo do Dia",
    capitulo: "",
    versiculo: "",
    texto: versiculo,
    referencia: "Fonte: Bíblia Online - ACF",
    comentario: "Reflexão automática",
    categoria: "Diário",
    fonte: "https://www.bibliaonline.com.br/acf",
    favorito: false
  };

  const jsonPath = path.join(__dirname, "data/versiculos.json");

  let versiculos = [];
  if (fs.existsSync(jsonPath)) {
    versiculos = JSON.parse(fs.readFileSync(jsonPath));
  }

  const existe = versiculos.some(v => v.data === hoje);
  if (!existe) {
    versiculos.push(novoVersiculo);
    fs.writeFileSync(jsonPath, JSON.stringify(versiculos, null, 2));
    console.log("📖 Versículo do dia salvo com sucesso!");
  } else {
    console.log("✅ O versículo de hoje já está salvo no JSON.");
  }

  await browser.close();
}

// Exportando a função para ser usada em scripts.js
export default buscarVersiculoDoDia;

