import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buscarVersiculoDoDia() {
  console.log("🚀 Iniciando o processo de scraping...");

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto("https://biblia.novageracao.org/acf");

  await page.waitForTimeout(3000); // Aguarda o carregamento da página

  // 🔍 Selecionando o versículo corretamente
  const elemento = await page.$(".content h2");
  if (!elemento) {
    console.error("❌ Elemento do versículo não encontrado! Verifique se a estrutura do site mudou.");
    await browser.close();
    return;
  }

  const versiculo = await page.evaluate(() => {
    const elemento = document.querySelector(".content h2");
    const referencia = elemento ? elemento.querySelector("small") : null;

    return elemento ? {
      texto: elemento.innerText.replace(referencia?.innerText || "", "").replace(/\s+/g, " ").trim(),
      referencia: referencia ? referencia.innerText.trim() : "Referência não encontrada"
    } : null;
  });

  if (!versiculo) {
    console.error("❌ Erro ao buscar versículo do dia.");
    await browser.close();
    return;
  }

  const hoje = new Date().toISOString().slice(0, 10);
  const novoVersiculo = {
    data: hoje,
    livro: "Versículo do Dia",
    capitulo: "",
    versiculo: "",
    texto: versiculo.texto,
    referencia: versiculo.referencia,
    comentario: "Reflexão automática",
    categoria: "Diário",
    fonte: "https://biblia.novageracao.org/acf",
    favorito: false
  };

  if (!fs.existsSync("data")) {
    fs.mkdirSync("data");
  }

  const jsonPath = path.join(__dirname, "data/versiculos.json");

  let versiculos = [];
  if (fs.existsSync(jsonPath)) {
    versiculos = JSON.parse(fs.readFileSync(jsonPath));
  }

  console.log("📂 Conteúdo atual do JSON:", JSON.stringify(versiculos, null, 2));
  console.log("✏️ Tentando salvar este novo versículo:", JSON.stringify(novoVersiculo, null, 2));

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
