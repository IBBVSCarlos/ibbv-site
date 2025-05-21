document.addEventListener("DOMContentLoaded", () => {
  fetch("data/coluna_pastor.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro ao carregar o arquivo JSON da Coluna do Pastor.");
      }
      return response.json();
    })
    .then(data => {
      const tituloEl = document.querySelector("#coluna-pastor h2");
      const conteudoEl = document.getElementById("conteudo-coluna");
      const assinaturaEl = document.querySelector(".coluna-pastor .assinatura");

      if (!tituloEl || !conteudoEl) {
        console.warn("Elementos esperados não foram encontrados no DOM.");
        return;
      }

      // Preenche o título
      tituloEl.textContent = data.titulo || "Coluna do Pastor";

      // Limpa e preenche os parágrafos
      conteudoEl.innerHTML = "";
      if (Array.isArray(data.mensagem)) {
        data.mensagem.forEach(paragrafo => {
          const p = document.createElement("p");
          p.textContent = paragrafo;
          conteudoEl.appendChild(p);
        });
      }

      // Adiciona assinatura se existir
      if (assinaturaEl && data.assinatura) {
        assinaturaEl.textContent = data.assinatura;
      }

    })
    .catch(error => {
      console.error("Erro ao carregar a Coluna do Pastor:", error.message);
    });
});
