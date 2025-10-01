// =====================================
// 🎉 Eventos IBBV (com expiração dinâmica via executaEm)
// =====================================
document.addEventListener("DOMContentLoaded", () => {
  fetch("data/eventos.json")
    .then(res => res.json())
    .then(({ eventos }) => {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const container = document.getElementById("lista-eventos");

      const eventosValidos = eventos
        .filter(evento => {
          if (!evento.executaEm) return false;

          const [ano, mes, dia] = evento.executaEm.split("-").map(Number);
          const expira = new Date(ano, mes - 1, dia, 23, 59, 59, 999);

          return hoje <= expira;
        })
        .sort((a, b) => new Date(a.executaEm) - new Date(b.executaEm));

      if (eventosValidos.length === 0) {
        container.innerHTML = "<p>Nenhum evento disponível.</p>";
        return;
      }

      container.innerHTML = eventosValidos.map(evento => {
        const caminhoImagem = evento.imagem && evento.imagem.trim() !== "" ? evento.imagem : null;

        return `
          <div class="evento-item">
            <p class="evento-titulo">${evento.titulo}</p>
            ${caminhoImagem
              ? `<img src="${caminhoImagem}" alt="Cartaz do evento: ${evento.titulo}" class="evento-cartaz">`
              : ""
            }
            <div class="evento-botoes">
              ${evento.linkInscricao && evento.linkInscricao.trim() !== ""
                ? `<a href="${evento.linkInscricao}" target="_blank" class="btn-evento">📝 Inscreva-se</a>`
                : ""
              }
              ${evento.linkAgenda && evento.linkAgenda.trim() !== ""
                ? `<a href="${evento.linkAgenda}" target="_blank" class="btn-evento">📅 Coloque na Agenda!</a>`
                : ""
              }
            </div>
          </div>
        `;
      }).join("");
    })
    .catch(err => console.error("Erro ao carregar eventos:", err));
});
