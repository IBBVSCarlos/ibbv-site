// eventos.js
document.addEventListener("DOMContentLoaded", () => {
  fetch("assets/eventos.json")
    .then(response => response.json())
    .then(eventos => {
      const container = document.getElementById("lista-eventos");
      eventos.forEach(evento => {
        const eventoDiv = document.createElement("div");
        eventoDiv.className = "evento-item";

        const imagem = document.createElement("img");
        imagem.src = evento.imagem;
        imagem.alt = `Cartaz do evento: ${evento.titulo}`;
        imagem.className = "evento-cartaz";

        const botao = document.createElement("a");
        botao.href = evento.linkInscricao;
        botao.textContent = "Inscreva-se";
        botao.className = "btn-inscricao";
        botao.target = "_blank";
        botao.rel = "noopener";

        eventoDiv.appendChild(imagem);
        eventoDiv.appendChild(botao);
        container.appendChild(eventoDiv);
      });
    })
    .catch(error => {
      console.error("Erro ao carregar eventos:", error);
      document.getElementById("lista-eventos").textContent = "Não foi possível carregar os eventos.";
    });
});
