document.addEventListener('DOMContentLoaded', function() {
    // ===== SISTEMA DE ABAS =====
    const tabs = document.querySelectorAll('nav ul li a');
    const contents = document.querySelectorAll('.tab-content');

    function activateTab(tabId) {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active-content'));

        const activeTabLink = document.querySelector(`nav ul li a[data-tab="${tabId}"]`);
        if (activeTabLink) {
            activeTabLink.classList.add('active');
        }

        const activeContent = document.getElementById(tabId);
        if (activeContent) {
            activeContent.classList.add('active-content');
        }
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            activateTab(tabId);
            history.pushState(null, null, `#${tabId}`);
        });
    });

    function handleInitialHash() {
        let hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            activateTab(hash);
        } else {
            activateTab('home');
        }
    }

    handleInitialHash();

    const tabButtons = document.querySelectorAll('[data-tab-link]');
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTab = this.getAttribute('data-tab-link');
            activateTab(targetTab);
            history.pushState(null, null, `#${targetTab}`);
        });
    });

    // ===== SISTEMA DE COMENTÁRIOS =====
    const comentariosLista = document.getElementById('lista-comentarios');
    const formComentario = document.getElementById('form-comentario');

    // Array para armazenar comentários (inicia com alguns exemplos)
    let comentarios = [
        {
            nome: "Mariana Albuquerque",
            profissao: "Estudante de Nutrição",
            rating: 5,
            texto: "Excelente conteúdo! Estou no 3º semestre de Nutrição e pretendo me especializar na área esportiva. As informações sobre as notas de corte e faculdades foram muito úteis para planejar meu futuro.",
            data: "15/02/2026",
            avatar: "MA"
        },
        {
            nome: "Carlos Lima",
            profissao: "Nutricionista Esportivo",
            rating: 5,
            texto: "Sou formado há 5 anos e posso confirmar que as informações sobre salário são realistas. Comecei ganhando R$2.800 e hoje, com especialização e clientela própria, já ultrapassei os R$8.000. Vale muito a pena investir na área!",
            data: "10/02/2026",
            avatar: "CL"
        },
        {
            nome: "Joana Santos",
            profissao: "Atleta amadora",
            rating: 4,
            texto: "Como atleta, sempre busco entender melhor o trabalho dos nutricionistas esportivos. O site esclareceu muitas dúvidas e me ajudou a valorizar ainda mais esses profissionais. Parabéns pelo conteúdo!",
            data: "05/02/2026",
            avatar: "JS"
        },
        {
            nome: "Roberto Fernandes",
            profissao: "Personal Trainer",
            rating: 5,
            texto: "Trabalho em parceria com nutricionistas esportivos e posso dizer que é uma das áreas mais promissoras da saúde. O site está de parabéns, principalmente pelas informações sobre como ingressar na carreira.",
            data: "28/01/2026",
            avatar: "RF"
        }
    ];

    // Função para gerar iniciais do avatar
    function gerarIniciais(nome) {
        return nome.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase();
    }

    // Função para formatar data atual
    function getDataAtual() {
        const data = new Date();
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }

    // Função para renderizar estrelas
    function renderizarEstrelas(rating) {
        let estrelas = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                estrelas += '<i class="fas fa-star"></i>';
            } else {
                estrelas += '<i class="far fa-star"></i>';
            }
        }
        return estrelas;
    }

    // Função para atualizar a lista de comentários no HTML
    function atualizarListaComentarios() {
        if (!comentariosLista) return;

        // Ordenar comentários por data (mais recentes primeiro)
        const comentariosOrdenados = [...comentarios].sort((a, b) => {
            const dataA = a.data.split('/').reverse().join('');
            const dataB = b.data.split('/').reverse().join('');
            return dataB - dataA;
        });

        let html = '';
        comentariosOrdenados.forEach(com => {
            html += `
                <div class="comentario-card">
                    <div class="comentario-header">
                        <div class="comentario-avatar">${com.avatar || gerarIniciais(com.nome)}</div>
                        <div class="comentario-info">
                            <div class="comentario-nome">${com.nome}</div>
                            <div class="comentario-data">
                                <span><i class="far fa-calendar-alt"></i> ${com.data}</span>
                                ${com.profissao ? `<span class="comentario-profissao"><i class="fas fa-briefcase"></i> ${com.profissao}</span>` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="comentario-texto">"${com.texto}"</div>
                    <div class="comentario-avaliacao">
                        ${renderizarEstrelas(com.rating)}
                        <span>Avaliação: ${com.rating}/5</span>
                    </div>
                </div>
            `;
        });
        comentariosLista.innerHTML = html;

        // Atualizar estatísticas
        atualizarEstatisticas();
    }

    // Função para atualizar estatísticas
    function atualizarEstatisticas() {
        const statsContainer = document.querySelector('.comentarios-stats');
        if (!statsContainer) return;

        const totalComentarios = comentarios.length;
        const somaRatings = comentarios.reduce((acc, com) => acc + com.rating, 0);
        const mediaRating = (somaRatings / totalComentarios).toFixed(1);

        let estrelasMedia = '';
        const mediaInteira = Math.floor(parseFloat(mediaRating));
        const temMeia = parseFloat(mediaRating) - mediaInteira >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= mediaInteira) {
                estrelasMedia += '<i class="fas fa-star"></i>';
            } else if (i === mediaInteira + 1 && temMeia) {
                estrelasMedia += '<i class="fas fa-star-half-alt"></i>';
            } else {
                estrelasMedia += '<i class="far fa-star"></i>';
            }
        }

        statsContainer.innerHTML = `
            <div class="stats-card">
                <div class="stats-numero">${mediaRating}</div>
                <div class="stats-estrelas">${estrelasMedia}</div>
                <div class="stats-total">Baseado em ${totalComentarios} avaliação${totalComentarios !== 1 ? 'ões' : ''}</div>
            </div>
        `;
    }

    // Evento de submit do formulário
    if (formComentario) {
        formComentario.addEventListener('submit', function(e) {
            e.preventDefault();

            // Pegar valores do formulário
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const profissao = document.getElementById('profissao').value.trim();
            const rating = document.querySelector('input[name="rating"]:checked')?.value || '5';
            const texto = document.getElementById('comentario').value.trim();

            // Validação básica
            if (!nome || !email || !texto) {
                alert('Por favor, preencha todos os campos obrigatórios!');
                return;
            }

            if (!email.includes('@') || !email.includes('.')) {
                alert('Por favor, insira um e-mail válido!');
                return;
            }

            // Criar novo comentário
            const novoComentario = {
                nome: nome,
                profissao: profissao || 'Visitante',
                rating: parseInt(rating),
                texto: texto,
                data: getDataAtual(),
                avatar: gerarIniciais(nome)
            };

            // Adicionar ao array
            comentarios.push(novoComentario);

            // Atualizar a lista
            atualizarListaComentarios();

            // Limpar formulário
            formComentario.reset();
            // Marcar a opção 5 estrelas como padrão novamente
            document.querySelector('input[name="rating"][value="5"]').checked = true;

            // Mostrar mensagem de sucesso
            alert('Obrigado pelo seu comentário! Ele foi adicionado à lista.');

            // Rolar até a seção de comentários
            document.getElementById('comentarios').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Inicializar lista de comentários
    atualizarListaComentarios();

    // Galeria - abrir imagem em nova aba
    const galleryImages = document.querySelectorAll('.galeria-grid img');
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            window.open(this.src, '_blank');
        });
    });
});