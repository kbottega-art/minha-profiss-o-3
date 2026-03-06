document.addEventListener('DOMContentLoaded', function() {
    // ===== SISTEMA DE ABAS =====
    const tabs = document.querySelectorAll('nav ul li a');
    const contents = document.querySelectorAll('.tab-content');

    // Função para ativar uma aba específica
    function activateTab(tabId) {
        // Remove a classe active de todas as abas e conteúdos
        tabs.forEach(tab => tab.classList.remove('active'));
        contents.forEach(content => content.classList.remove('active-content'));

        // Adiciona active na aba clicada
        const activeTabLink = document.querySelector(`nav ul li a[data-tab="${tabId}"]`);
        if (activeTabLink) {
            activeTabLink.classList.add('active');
        }

        // Mostra o conteúdo correspondente
        const activeContent = document.getElementById(tabId);
        if (activeContent) {
            activeContent.classList.add('active-content');
        }
    }

    // Adiciona evento de clique em cada link de navegação
    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault(); // Previne o comportamento padrão do link
            const tabId = this.getAttribute('data-tab');
            activateTab(tabId);

            // Atualiza a URL com o hash (para bookmark)
            history.pushState(null, null, `#${tabId}`);
        });
    });

    // ===== MANIPULAÇÃO DA HASH NA URL =====
    function handleInitialHash() {
        let hash = window.location.hash.substring(1); // Remove o #
        if (hash && document.getElementById(hash)) {
            activateTab(hash);
        } else {
            // Se não houver hash válido, ativa a home
            activateTab('home');
        }
    }

    handleInitialHash();

    // ===== SUPORTE PARA BOTÕES COM DATA-TAB-LINK =====
    const tabButtons = document.querySelectorAll('[data-tab-link]');
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTab = this.getAttribute('data-tab-link');
            activateTab(targetTab);
            history.pushState(null, null, `#${targetTab}`);
        });
    });

    // ===== EFEITO DE HOVER NAS IMAGENS DA GALERIA =====
    const galleryImages = document.querySelectorAll('.galeria-grid img');
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            // Abre a imagem em uma nova aba (funcionalidade simples)
            window.open(this.src, '_blank');
        });
        
        // Adiciona um atributo title para melhor acessibilidade
        img.setAttribute('title', 'Clique para ampliar');
    });

    // ===== SCROLL SUAVE PARA ÂNCORAS (opcional) =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Não interfere nos links de abas, pois já têm preventDefault
            if (this.getAttribute('href').length > 1) {
                // Apenas para links internos que não são das abas
                // O tratamento das abas já foi feito acima
            }
        });
    });

    // ===== PEQUENA ANIMAÇÃO AO MUDAR DE ABA =====
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class' && 
                mutation.target.classList.contains('active-content')) {
                // Quando uma aba se torna ativa, adiciona um efeito sutil
                mutation.target.style.animation = 'fadeIn 0.5s ease-out';
            }
        });
    });

    contents.forEach(content => {
        observer.observe(content, { attributes: true });
    });

    // ===== MENSAGEM NO CONSOLE (apenas para informação) =====
    console.log('Site Nutrição Esportiva carregado com sucesso!');
    console.log('Versão: 1.0 - Seção de comentários estática');

    // ===== VALIDAÇÃO SIMPLES DE FORMULÁRIO (DESATIVADA) =====
    // Apenas para demonstrar que o JavaScript está funcionando
    const formButton = document.querySelector('.btn-avaliar');
    if (formButton) {
        formButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Não faz nada pois o formulário está desabilitado
            // Apenas um alerta visual para mostrar que o JS está ativo
            alert('Esta é uma versão demonstrativa. Os comentários não estão funcionais.');
        });
    }

    // ===== DESTAQUE NA ABA ATIVA AO ROLAR A PÁGINA =====
    // (Funcionalidade desativada porque já temos o sistema de abas por clique)
    // Mantida apenas como referência

    // ===== DETECÇÃO DE DISPOSITIVOS MÓVEIS =====
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // Ajuste fino para mobile (se necessário)
    if (isMobile()) {
        console.log('Visualização em dispositivo móvel detectada');
    }

    // ===== ATUALIZAÇÃO DA DATA NO FOOTER =====
    const footerYear = document.querySelector('footer p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.innerHTML = footerYear.innerHTML.replace('2026', currentYear);
    }
});

// ===== FUNÇÕES AUXILIARES (OPCIONAIS) =====

// Função para voltar ao topo da página
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Adiciona botão de voltar ao topo (opcional)
window.addEventListener('scroll', function() {
    // Esta função pode ser ativada se desejar adicionar um botão flutuante
    // Por enquanto, está comentada
    /*
    if (window.pageYOffset > 300) {
        // Mostrar botão
    } else {
        // Esconder botão
    }
    */
});

// Animação de entrada para cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card, .faculdade-item, .comentario-card');
    
    // Adiciona classe de animação quando os elementos entram na tela
    const observerCards = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observerCards.observe(card);
    });
});