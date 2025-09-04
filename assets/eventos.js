// eventos.js
document.addEventListener("DOMContentLoaded", () => {
  fetch("data/eventos.json")
    .then(response => response.json())
    .then(eventos => {
      const container = document.getElementById("lista-eventos");

      // Filtra apenas eventos válidos
      const eventosValidos = eventos.filter(e => 
        e.titulo && e.titulo.trim() !== "" &&
        e.imagem && e.imagem.trim() !== "" &&
        e.linkInscricao && e.linkInscricao.trim() !== ""
      );

      // Se não houver eventos válidos, não exibe nada
      if (eventosValidos.length === 0) {
        return; // não insere nada no HTML
      }

      // Renderiza apenas eventos válidos
      eventosValidos.forEach(evento => {
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
      // opcional: remover mensagem fixa e só logar no console
      // document.getElementById("lista-eventos").textContent = "Não foi possível carregar os eventos.";
    });
});
