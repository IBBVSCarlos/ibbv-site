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
          const executa = new Date(ano, mes - 1, dia, 0, 0, 0, 0);
          const expira = new Date(ano, mes - 1, dia, 23, 59, 59, 999);

          // Publica imediatamente, expira no fim do dia definido
          return hoje <= expira;
        })
        .sort((a, b) => new Date(a.executaEm) - new Date(b.executaEm));

      if (eventosValidos.length === 0) {
        container.innerHTML = "<p>Nenhum evento disponível.</p>";
        return;
      }

      container.innerHTML = eventosValidos.map(evento => {
        return `
          <div class="evento-item">
            <p class="evento-titulo">${evento.titulo}</p>
            ${evento.imagem && evento.imagem.trim() !== "" 
              ? `<img src="${evento.imagem}" alt="Cartaz do evento: ${evento.titulo}" class="evento-cartaz" onclick="ampliarImagem('${evento.imagem}')">` 
              : ""
            }
            <div class="evento-botoes">
              ${evento.linkInscricao && evento.linkInscricao.trim() !== "" 
                ? `<a href="${evento.linkInscricao}" target="_blank" class="btn-evento">📝 Inscreva-se</a>` 
                : ""
              }
              ${evento.linkAgenda && evento.linkAgenda.trim() !== "" 
                ? `<a href="${evento.linkAgenda}" target="_blank" class="btn-evento">📅 Agendar</a>` 
                : ""
              }
            </div>
          </div>
        `;
      }).join("");
    })
    .catch(err => console.error("Erro ao carregar eventos:", err));
});
