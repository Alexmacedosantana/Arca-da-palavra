
// Verifica se o script já foi carregado para evitar executar bindings duplicados
if (window.__abrirBibliaLoaded) {
  console.warn('Script já carregado — evitando bindings duplicados.');
} else { 
  // Flag global que marca o script como carregado
  window.__abrirBibliaLoaded = true;

  // Lock para evitar que a função seja executada múltiplas vezes em sequência rápida
  let __abrirBibliaLock = false;

  // Função principal que abre o site da Bíblia na mesma aba
  function abrirBiblia() {
    // Log para debug — mostra quando a função foi chamada
    console.log('abrirBiblia() chamada', new Date().toISOString());
    
    // Se o lock estiver ativo, retorna sem fazer nada (evita execução dupla)
    if (__abrirBibliaLock) {
      console.warn('abrirBiblia bloqueada (lock ativo)');
      return;
    }
    
    // Ativa o lock para bloquear execuções simultâneas
    __abrirBibliaLock = true;
    
    try {
      // URL do site da Bíblia
      const url = "https://www.bibliaonline.com.br/nvi";
      
      // Abre na mesma aba para evitar que scripts do site destino criem abas adicionais
      window.location.href = url;
    } catch (err) {
      // Se houver erro, registra no console e faz fallback
      console.error("abrirBiblia error:", err);
      window.location.href = "https://www.bibliaonline.com.br/nvi";
    } finally {
      // Desativa o lock após 1 segundo para permitir próximas execuções
      setTimeout(() => { __abrirBibliaLock = false; }, 1000);
    }
  }

  // Aguarda o DOM carregar antes de vincular eventos
  document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os botões com a classe .btn-abrir-biblia
    document.querySelectorAll('.btn-abrir-biblia').forEach(btn => {
      // Remove onclick inline se existir (previne execução dupla)
      if (btn.getAttribute('onclick')) btn.removeAttribute('onclick');

      // Evita vincular o mesmo listener mais de uma vez
      if (btn.dataset.bound) return;

      // Adiciona listener de clique ao botão
      btn.addEventListener('click', (e) => {
        // Previne comportamento padrão do botão
        e.preventDefault();
        // Previne que outros handlers no mesmo elemento sejam executados
        e.stopImmediatePropagation();
        // Chama a função abrirBiblia
        abrirBiblia();
      });

      // Marca o botão como vinculado para não duplicar listeners
      btn.dataset.bound = '1';
    });
  });

  // Expõe a função globalmente caso algo ainda chame diretamente (fallback)
  window.abrirBiblia = abrirBiblia;
}

// Botão Voltar ao Topo

// Seleciona o botão pelo ID "btn-topo"
const btnTopo = document.getElementById("btn-topo");

// Escuta o evento de rolagem da página (scroll)
window.addEventListener("scroll", () => {

  // Verifica se a página foi rolada mais de 400px para baixo
  if (window.scrollY > 400) {

    // Se passou de 400px, o botão aparece
    btnTopo.style.display = "flex";

  } else {

    // Se estiver acima de 400px, o botão some
    btnTopo.style.display = "none";
  }
});

// Escuta o clique no botão
btnTopo.addEventListener("click", () => {

  // Rola a página suavemente até o topo
  window.scrollTo({
    top: 0,           // posição 0 = topo da página
    behavior: "smooth" // rolagem suave
  });
});

