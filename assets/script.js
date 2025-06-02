// script.js
// script para ativar o PWA
if ("serviceWorker" in navigator) {
   navigator.serviceWorker.register("./service-worker.js")
    .then(() => console.log("✅ Service Worker registrado com sucesso!"))
    .catch((error) => console.log("⚠️ Erro ao registrar Service Worker:", error));
}

function solicitarPermissaoNotificacao() {
  if ("Notification" in window && "serviceWorker" in navigator) {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("✅ Permissão para notificações concedida!");
      } else {
        console.log("⚠️ Permissão negada pelo usuário.");
      }
    });
  }
}

// Chamamos a função quando o site carrega
document.addEventListener("DOMContentLoaded", solicitarPermissaoNotificacao);


// funçao para o header - semana atual
function definirSemanaReferencia() {
  const hoje = new Date();
  const diaSemana = hoje.getDay(); // 0 = Domingo, 6 = Sábado


  // Efeito de luz no logo do header 
document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("logoEffectShown")) {
    const light = document.querySelector(".light-effect");

    // Aplica a animação apenas uma vez
    light.style.animation = "moveLight 2s linear forwards";

    light.addEventListener("animationend", () => {
      setTimeout(() => {
        light.remove(); // Remove o efeito após executar
      }, 500);
    });

    // Salva no localStorage para não repetir na próxima vez
    localStorage.setItem("logoEffectShown", "true");
  }
});



  // scrool na area visivel
window.addEventListener("load", () => {
  const sections = document.querySelectorAll(".section-box");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show");
    }
  });
}, { threshold: 0.05 }); // Agora ativa quando apenas 5% do container estiver visível

sections.forEach((section) => observer.observe(section));

});


  // Último domingo
  const domingo = new Date(hoje);
  domingo.setDate(hoje.getDate() - diaSemana);
  
  // Próximo sábado
  const sabado = new Date(domingo);
  sabado.setDate(domingo.getDate() + 6);

  // Pegando o dia e o mês
  const diaInicio = domingo.getDate();
  const mesInicio = domingo.toLocaleDateString('pt-BR', { month: 'long' });
  const diaFim = sabado.getDate();
  const mesFim = sabado.toLocaleDateString('pt-BR', { month: 'long' });

  // Se ambos os dias estão no mesmo mês, não repete o nome
  const periodo = mesInicio === mesFim 
    ? `Semana de ${diaInicio} a ${diaFim} de ${mesInicio}`
    : `Semana de ${diaInicio} de ${mesInicio} a ${diaFim} de ${mesFim}`;

  document.getElementById("semana-referencia").textContent = periodo;
}

// Chamando a função quando a página carrega
document.addEventListener("DOMContentLoaded", definirSemanaReferencia);


//versiculo do dia
async function carregarVersiculo() {
  try {
    const response = await fetch("./data/versiculos.json");
    if (!response.ok) throw new Error("❌ Erro ao carregar versículo.");

    const versiculos = await response.json();
    const hoje = new Date().toISOString().slice(0, 10);

    const versiculoDoDia = versiculos.find(v => v.data === hoje);

    if (!versiculoDoDia) {
      console.log("🚨 Nenhum versículo encontrado para hoje!");
      document.querySelector("#versiculo-conteudo").innerHTML = "<p>❌ Nenhum versículo encontrado para hoje.</p>";
      return;
    }

    document.querySelector("#versiculo-conteudo").innerHTML = `
      <p><strong>${versiculoDoDia.texto}</strong></p>
      <p><em>${versiculoDoDia.referencia}</em></p>
      <p>${versiculoDoDia.comentario}</p>
    `;

    console.log("✅ Versículo do dia carregado!");
  } catch (error) {
    console.error(error.message);
    document.querySelector("#versiculo-conteudo").innerHTML = "<p>❌ Erro ao carregar versículo.</p>";
  }
}

// Chama a função ao carregar a página
document.addEventListener("DOMContentLoaded", carregarVersiculo);



// Função para formatar a data no formato "dd/mm"
function formatDate(date) {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${d}/${m}`;
}

// Função para obter os aniversariantes da semana
async function carregarAniversariantesSemana() {
  try {
    const res = await fetch('data/aniversariantes.json');
    const aniversariantes = await res.json();

    const hoje = new Date();
    const diaSemana = hoje.getDay();

    // Definir o início e fim da semana antes de usar nos logs
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - diaSemana);

    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 7);

    // Agora os logs vão funcionar sem erro
    console.log("Início da semana:", inicioSemana.toDateString());
    console.log("Fim da semana:", fimSemana.toDateString());
    console.log("Aniversariantes carregados:", aniversariantes);

    const lista = document.getElementById("lista-aniversariantes");
    if (!lista) return;

    // Array com emojis Unicode aleatórios
    const emojis = ["🎉", "🎂", "🥳", "🎊", "🍰", "🎈", "✨", "😃"];

    // Filtrar os aniversariantes dentro do intervalo correto
const aniversariantesSemana = aniversariantes.filter(item => {
  const [dia, mes] = item.data.split('/').map(Number);
  const dataAniv = new Date(hoje.getFullYear(), mes - 1, dia);

  // Ajuste para garantir que a comparação use apenas a data (sem horário)
  const dataAnivSemHorario = new Date(dataAniv.getFullYear(), dataAniv.getMonth(), dataAniv.getDate());
  const inicioSemanaSemHorario = new Date(inicioSemana.getFullYear(), inicioSemana.getMonth(), inicioSemana.getDate());
  const fimSemanaSemHorario = new Date(fimSemana.getFullYear(), fimSemana.getMonth(), fimSemana.getDate());

  return dataAnivSemHorario >= inicioSemanaSemHorario && dataAnivSemHorario <= fimSemanaSemHorario;
});


    console.log("Aniversariantes filtrados:", aniversariantesSemana); // Agora está definido antes do log!

    // Exibir aniversariantes na lista
    lista.innerHTML = aniversariantesSemana.length
      ? aniversariantesSemana.map(p => {
          const [dia, mes] = p.data.split('/').map(Number);
          const dataAniv = new Date(hoje.getFullYear(), mes - 1, dia);
          const hojeTexto = (dataAniv.getDate() === hoje.getDate() &&
                             dataAniv.getMonth() === hoje.getMonth() &&
                             dataAniv.getFullYear() === hoje.getFullYear()) 
            ? " <strong>(hoje!)</strong>" 
            : "";

          // Escolhe um emoji aleatório
          const emojiAleatorio = emojis[Math.floor(Math.random() * emojis.length)];

          return `<li>${emojiAleatorio} ${p.nome}${hojeTexto}</li>`;
        }).join('')
      : '<li>Nenhum aniversariante nesta semana.</li>';

  } catch (error) {
    console.error("Erro ao carregar aniversariantes:", error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
//  await carregarVersiculoDoDia();
    await carregarAniversariantesSemana();
  } catch (error) {
    console.error("Erro ao carregar o conteúdo:", error);
  }
});

// Função para carregar a Escala de Ministérios
async function carregarEscalaMinisterios() {
  try {
    const res = await fetch('data/escalamin.json');
    if (!res.ok) throw new Error("Erro ao carregar JSON");

    const escala = await res.json();
    if (!escala.length) throw new Error("Nenhuma escala disponível");

    const listaEscala = document.getElementById("lista-escala");
    if (!listaEscala) return;

    listaEscala.innerHTML = escala.map(ministerio => `
      <li><strong>${ministerio.ministerio}</strong>
        <ul>
          ${ministerio.escalados.map(pessoa => `<li>${pessoa.dia}: ${pessoa.nome}</li>`).join('')}
        </ul>
      </li>
    `).join('');
  } catch (error) {
    console.error("Erro ao carregar escala de ministérios:", error);
    document.getElementById("lista-escala").innerHTML = '<li>Erro ao carregar escala.</li>';
  }
}


document.addEventListener("DOMContentLoaded", carregarEscalaMinisterios);

// Avisos IBBV
function carregarAvisos() {
  fetch('data/avisosibbv.json')
    .then(response => response.json())
    .then(data => {
      const listaAvisos = document.getElementById('lista-avisos');

      if (!listaAvisos || !data.avisos || !data.avisos.length) {
        console.warn("Nenhum aviso encontrado.");
        return;
      }

      listaAvisos.innerHTML = ""; // Limpa avisos anteriores

      data.avisos.forEach(aviso => {
        const li = document.createElement('li');
        li.classList.add('aviso-item');

        const texto = document.createElement('p');
        texto.textContent = aviso.texto; // 🚀 Corrigido: agora exibe apenas o texto do aviso
        li.appendChild(texto);

        if (aviso.imagem) {
          const img = document.createElement('img');
          img.src = `img/${aviso.imagem}`; // Ajustado para a nova pasta
          img.alt = "Imagem do aviso";
          img.classList.add('aviso-img');
          li.appendChild(img);
        }

        listaAvisos.appendChild(li);
      });
    })
    .catch(error => {
      console.error('Erro ao carregar os avisos:', error);
    });
}

// Chamar a função ao carregar a página
document.addEventListener("DOMContentLoaded", carregarAvisos);


  // Função para o pix
function copiarPix() {
    const chavePix = "57722761000174";
    navigator.clipboard.writeText(chavePix).then(() => {
        const mensagemPix = document.createElement("p");
        mensagemPix.style.color = "#006600";
        mensagemPix.style.fontWeight = "bold";
        mensagemPix.textContent = "Chave Pix copiada!";
        
        const pixLink = document.querySelector(".pix-link");
        pixLink.appendChild(mensagemPix); // Adiciona mensagem temporária
        
        setTimeout(() => mensagemPix.classList.add("fade-out"), 2000);
        setTimeout(() => mensagemPix.remove(), 2500);
 
    }).catch(() => {
        alert("Erro ao copiar. Copie manualmente: " + chavePix);
    });
}

// Chama as funções quando o DOM for carregado
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await carregarVersiculoDoDia();
    await carregarAniversariantesSemana();
/*    await loadColunaPastor(); -- Já está chamado no coluna_pastor.js */
  } catch (error) {
    console.error("Erro ao carregar o conteúdo:", error);
  }
});
carregarAniversariantesSemana();
