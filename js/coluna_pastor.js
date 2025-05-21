document.addEventListener("DOMContentLoaded", () => {
  const tituloEl = document.querySelector("#coluna-pastor h2");
  const artigoEl = document.getElementById("mensagem-pastor");

  if (!tituloEl || !artigoEl) {
    console.warn("Elementos da Coluna do Pastor não encontrados no DOM.");
    return;
  }

  fetch("data/coluna_pastor.json")
    .then(res => {
      if (!res.ok) throw new Error("Falha ao buscar o conteúdo.");
      return res.json();
    })
    .then(data => {
      if (!data.titulo || !Array.isArray(data.mensagem)) {
        throw new Error("Formato inválido no arquivo coluna_pastor.json.");
      }

      tituloEl.textContent = data.titulo;
      artigoEl.innerHTML = ''; // Limpa conteúdo anterior, se houver

      data.mensagem.forEach(paragrafo => {
        const p = document.createElement("p");
        p.textContent = paragrafo;
        artigoEl.appendChild(p);
      });
    })
    .catch(error => {
      console.error("Erro ao carregar a Coluna do Pastor:", error);
      artigoEl.innerHTML = '<p class="erro">Não foi possível carregar a mensagem do pastor no momento.</p>';
    });
});
