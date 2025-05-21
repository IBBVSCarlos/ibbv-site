document.addEventListener("DOMContentLoaded", () => {
  fetch("data/coluna_pastor.json")
    .then(res => res.json())
    .then(data => {
      const titulo = document.querySelector("#coluna-pastor h2");
      const artigo = document.getElementById("mensagem-pastor");
      titulo.textContent = data.titulo;
      data.mensagem.forEach(paragrafo => {
        const p = document.createElement("p");
        p.textContent = paragrafo;
        artigo.appendChild(p);
      });
    })
    .catch(error => {
      console.error("Erro ao carregar a Coluna do Pastor:", error);
    });
});
