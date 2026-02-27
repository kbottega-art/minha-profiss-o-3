document.addEventListener('DOMContentLoaded', function() {
    // Lógica das Abas
    const tabs = document.querySelectorAll('nav ul li a');
    const contents = document.querySelectorAll('.tab-content');

    // Função para ativar uma aba
    function activateTab(tabId) {
        // Remove active de todas as abas e conteúdos
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active-content'));

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

        // Rola suavemente para o topo do conteúdo (opcional)
        // window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Adiciona evento de clique em cada link de navegação
    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault(); // Previne o comportamento padrão do link
            const tabId = this.getAttribute('data-tab');
            activateTab(tabId);

            // Atualiza a URL com hash (opcional, para bookmark)
            history.pushState(null, null, `#${tabId}`);
        });
    });

    // Lida com o carregamento da página baseado na hash da URL
    function handleInitialHash() {
        let hash = window.location.hash.substring(1); // Remove o #
        if (hash && document.getElementById(hash)) {
            activateTab(hash);
        } else {
            // Se não houver hash válido, ativa a primeira aba (home) por padrão
            activateTab('home');
        }
    }

    handleInitialHash();

    // Adiciona suporte para os botões "Saiba Mais" que podem ter data-tab-link
    const tabButtons = document.querySelectorAll('[data-tab-link]');
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTab = this.getAttribute('data-tab-link');
            activateTab(targetTab);
            history.pushState(null, null, `#${targetTab}`);
        });
    });

    // Opcional: Fazer as imagens da galeria abrirem em um lightbox simples
    const galleryImages = document.querySelectorAll('.galeria-grid img');
    galleryImages.forEach(img => {
        img.addEventListener('click,', function() {
            // Pode-se implementar um modal simples aqui ou apenas um alert para demonstração
            // Por enquanto, vamos apenas mostrar a URL da imagem no console
            console.log('Imagem clicada:', this.src);
            // Exemplo simples: abrir em nova aba (menos intrusivo)
            // window.open(this.src, '_blank');
            
            // Ou criar um alerta com a imagem ampliada? (cuidado com UX)
            // alert('Imagem: ' + this.alt); // Descomente se quiser testar
        });
    });

    // Pequeno "hack" para corrigir o erro de digitação no evento (era 'click,' com vírgula)
    // Vamos reatribuir o evento corretamente:
    galleryImages.forEach(img => {
        img.removeEventListener('click,', function(){}); // Remove o errado (se existir)
        img.addEventListener('click', function() {
            // Ação: abrir imagem em uma nova guia (simples e funcional)
            window.open(this.src, '_blank');
        });
    });

});