const cards = Array.from(
  document.querySelectorAll(".container-esboço > [class^='caixaesboço']")
);
const campoBusca = document.getElementById("buscar-esbocos");
const limparBusca = document.querySelector(".limpar-busca");
const resultadoBusca = document.querySelector(".resultado-busca");

// Função para normalizar o texto, removendo acentos e convertendo para minúsculas
function normalizarTexto(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}
// Função para atualizar a busca e filtrar os cards
function atualizarBusca() {
  const termos = normalizarTexto(campoBusca.value.trim())
    .split(/\s+/)
    .filter(Boolean);
  let encontrados = 0;

  cards.forEach((card) => {
    const textoCard = normalizarTexto(card.textContent);
    const corresponde = termos.every((termo) => textoCard.includes(termo));
    card.hidden = !corresponde;
    if (corresponde) encontrados += 1;
  });
// Atualizar a mensagem de resultado da busca
  if (encontrados === 0) {
    resultadoBusca.textContent =
      "Nenhum esboço encontrado. Tente outro tema ou referência.";
  } else {
    resultadoBusca.textContent = `${encontrados} ${
      encontrados === 1 ? "esboço encontrado" : "esboços encontrados"
    }.`;
  }
}
// Lista de livros bíblicos para referência
const livrosBiblicos = [
  "Gênesis", "Êxodo", "Levítico", "Números", "Deuteronômio", "Josué",
  "Juízes", "Rute", "1 Samuel", "2 Samuel", "1 Reis", "2 Reis",
  "1 Crônicas", "2 Crônicas", "Esdras", "Neemias", "Ester", "Jó",
  "Salmos", "Provérbios", "Eclesiastes", "Cantares",
  "Cântico dos Cânticos", "Isaías", "Jeremias", "Lamentações",
  "Ezequiel", "Daniel", "Oseias", "Joel", "Amós", "Obadias", "Jonas",
  "Miqueias", "Naum", "Habacuque", "Sofonias", "Ageu", "Zacarias",
  "Malaquias", "Mateus", "Marcos", "Lucas", "João", "Atos", "Romanos",
  "1 Coríntios", "2 Coríntios", "Gálatas", "Efésios", "Filipenses",
  "Colossenses", "1 Tessalonicenses", "2 Tessalonicenses", "1 Timóteo",
  "2 Timóteo", "Tito", "Filemom", "Hebreus", "Tiago", "1 Pedro",
  "2 Pedro", "1 João", "2 João", "3 João", "Judas", "Apocalipse",
];
livrosBiblicos.sort((a, b) => b.length - a.length);
const livrosRegex = livrosBiblicos
  .map((livro) => livro.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  .join("|");
const referenciaRegex = new RegExp(
  `\\b(${livrosRegex}|Gn)\\s+(\\d{1,3}:\\d{1,3}(?:[-–]\\d{1,3})?)\\b`,
  "gi"
);

function tornarReferenciasClicaveis() {
  cards.forEach((card) => {
    const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
    const nosDeTexto = [];

    while (walker.nextNode()) {
      if (!walker.currentNode.parentElement.closest("a, script, style")) {
        nosDeTexto.push(walker.currentNode);
      }
    }

    nosDeTexto.forEach((no) => {
      const texto = no.nodeValue;
      const regex = new RegExp(referenciaRegex.source, "gi");
      const fragmento = document.createDocumentFragment();
      let indiceFinal = 0;
      let correspondencia;
      let encontrouReferencia = false;

      while ((correspondencia = regex.exec(texto)) !== null) {
        encontrouReferencia = true;
        fragmento.appendChild(
          document.createTextNode(texto.slice(indiceFinal, correspondencia.index))
        );

        const livro =
          correspondencia[1].toLocaleLowerCase("pt-BR") === "gn"
            ? "Gênesis"
            : correspondencia[1];
        const referencia = `${livro} ${correspondencia[2]}`;
        const link = document.createElement("a");
        link.className = "referencia-biblica";
        link.href = `https://www.biblegateway.com/passage/?search=${encodeURIComponent(
          referencia
        )}&version=NVI-PT`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.title = `Abrir ${referencia} na Bíblia NVI (abre em nova aba)`;
        link.textContent = correspondencia[0];
        fragmento.appendChild(link);
        indiceFinal = regex.lastIndex;
      }

      if (encontrouReferencia) {
        fragmento.appendChild(document.createTextNode(texto.slice(indiceFinal)));
        no.replaceWith(fragmento);
      }
    });
  });
}

campoBusca.addEventListener("input", atualizarBusca);
limparBusca.addEventListener("click", () => {
  campoBusca.value = "";
  atualizarBusca();
  campoBusca.focus();
});

const btnTopo = document.getElementById("btn-topo");
window.addEventListener("scroll", () => {
  btnTopo.style.display = window.scrollY > 400 ? "flex" : "none";
});
btnTopo.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const navegacao = document.querySelector(".navegacao");
const menuToggle = document.getElementById("menu-toggle");
const menuLinks = document.getElementById("menu-links");

function definirMenuAberto(aberto) {
  navegacao.classList.toggle("menu-aberto", aberto);
  menuToggle.setAttribute("aria-expanded", String(aberto));
  menuToggle.setAttribute(
    "aria-label",
    aberto ? "Fechar menu" : "Abrir menu"
  );
}
// Fechar o menu ao clicar no botão de alternância
menuToggle.addEventListener("click", () => {
  definirMenuAberto(menuToggle.getAttribute("aria-expanded") !== "true");
});

menuLinks.addEventListener("click", (evento) => {
  if (evento.target.closest("a")) definirMenuAberto(false);
});

document.addEventListener("click", (evento) => {
  if (!navegacao.contains(evento.target)) definirMenuAberto(false);
});
// Fechar o menu ao pressionar a tecla Escape
document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    definirMenuAberto(false);
    menuToggle.focus();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 700) definirMenuAberto(false);
});

tornarReferenciasClicaveis();
atualizarBusca();
