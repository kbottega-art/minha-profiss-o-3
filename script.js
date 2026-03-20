// ===== SISTEMA DE COMENTÁRIOS FUNCIONAL =====

// Array para armazenar os comentários (em memória)
let comentarios = [];

// Carregar comentários do localStorage ao iniciar
function carregarComentarios() {
    const saved = localStorage.getItem('nutrichamp_comentarios');
    if (saved) {
        comentarios = JSON.parse(saved);
    } else {
        // Comentários de exemplo para demonstração
        comentarios = [
            {
                id: 1,
                nome: "Roberto Silva",
                email: "roberto@email.com",
                profissao: "Educador Físico",
                avaliacao: 5,
                texto: "Excelente site! As informações sobre notas de corte do ENEM me ajudaram muito a orientar meus alunos que querem seguir na área de nutrição esportiva. Parabéns pelo conteúdo!",
                data: "2026-03-15T10:30:00"
            },
            {
                id: 2,
                nome: "Ana Carolina Mendes",
                email: "ana@email.com",
                profissao: "Estudante de Nutrição",
                avaliacao: 5,
                texto: "Estou no 4º semestre de Nutrição e pretendo me especializar em esportiva. As informações sobre as faculdades e os passos para ingressar na carreira foram muito úteis. Obrigada!",
                data: "2026-03-10T14:20:00"
            },
            {
                id: 3,
                nome: "Paulo Lima",
                email: "paulo@email.com",
                profissao: "Nutricionista",
                avaliacao: 5,
                texto: "Sou nutricionista há 8 anos e posso confirmar que as médias salariais apresentadas estão corretas. A área esportiva realmente tem um ótimo potencial de crescimento. Site muito bem elaborado!",
                data: "2026-03-05T09:15:00"
            },
            {
                id: 4,
                nome: "Mariana Fernandes",
                email: "mariana@email.com",
                profissao: "Atleta",
                avaliacao: 4,
                texto: "Como atleta de crossfit, sempre tive curiosidade sobre o trabalho dos nutricionistas esportivos. O site me ajudou a entender melhor a importância desse profissional. Amei a galeria de fotos!",
                data: "2026-02-28T16:45:00"
            }
        ];
        salvarComentarios();
    }
    renderizarComentarios();
}

// Salvar comentários no localStorage
function salvarComentarios() {
    localStorage.setItem('nutrichamp_comentarios', JSON.stringify(comentarios));
}

// Renderizar lista de comentários
function renderizarComentarios() {
    const container = document.getElementById('comentarios-lista');
    const totalSpan = document.getElementById('total-comentarios');
    const mediaSpan = document.getElementById('media-avaliacao');
    
    if (!container) return;
    
    // Ordenar comentários por data (mais recentes primeiro)
    const comentariosOrdenados = [...comentarios].sort((a, b) => new Date(b.data) - new Date(a.data));
    
    if (comentariosOrdenados.length === 0) {
        container.innerHTML = `
            <div class="sem-comentarios">
                <i class="fas fa-comment-dots"></i>
                <p>Seja o primeiro a deixar um comentário!</p>
            </div>
        `;
    } else {
        container.innerHTML = comentariosOrdenados.map(comentario => `
            <div class="comentario-card">
                <div class="comentario-header">
                    <div class="comentario-avatar">${getIniciais(comentario.nome)}</div>
                    <div class="comentario-info">
                        <div class="comentario-nome">${escapeHtml(comentario.nome)}</div>
                        <div class="comentario-data">
                            <span><i class="far fa-calendar-alt"></i> ${formatarData(comentario.data)}</span>
                            ${comentario.profissao ? `<span class="comentario-profissao"><i class="fas fa-tag"></i> ${escapeHtml(comentario.profissao)}</span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="comentario-texto">
                    "${escapeHtml(comentario.texto)}"
                </div>
                <div class="comentario-avaliacao">
                    ${renderizarEstrelas(comentario.avaliacao)}
                    <span>Avaliação: ${comentario.avaliacao}/5</span>
                </div>
            </div>
        `).join('');
    }
    
    // Atualizar estatísticas
    totalSpan.textContent = comentarios.length;
    const media = calcularMediaAvaliacoes();
    mediaSpan.textContent = media.toFixed(1);
}

// Calcular média das avaliações
function calcularMediaAvaliacoes() {
    if (comentarios.length === 0) return 0;
    const soma = comentarios.reduce((acc, c) => acc + c.avaliacao, 0);
    return soma / comentarios.length;
}

// Renderizar estrelas baseado na nota
function renderizarEstrelas(nota) {
    let estrelas = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= nota) {
            estrelas += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= nota) {
            estrelas += '<i class="fas fa-star-half-alt"></i>';
        } else {
            estrelas += '<i class="far fa-star"></i>';
        }
    }
    return estrelas;
}

// Formatar data para exibição
function formatarData(dataString) {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Pegar iniciais do nome para o avatar
function getIniciais(nome) {
    const nomes = nome.trim().split(' ');
    if (nomes.length === 1) return nome.substring(0, 2).toUpperCase();
    return (nomes[0][0] + nomes[nomes.length - 1][0]).toUpperCase();
}

// Escapar HTML para prevenir XSS
function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// Validar e adicionar novo comentário
function adicionarComentario(evento) {
    evento.preventDefault();
    
    // Obter valores dos campos
    const nome = document.getElementById('comentario-nome').value.trim();
    const email = document.getElementById('comentario-email').value.trim();
    const profissao = document.getElementById('comentario-profissao').value.trim();
    const texto = document.getElementById('comentario-texto').value.trim();
    
    // Obter avaliação selecionada
    const ratingSelected = document.querySelector('input[name="rating"]:checked');
    const avaliacao = ratingSelected ? parseInt(ratingSelected.value) : null;
    
    const mensagemFeedback = document.getElementById('mensagem-feedback');
    
    // Validações
    if (!nome) {
        mostrarFeedback('Por favor, informe seu nome.', 'error');
        return;
    }
    
    if (nome.length < 3) {
        mostrarFeedback('O nome deve ter pelo menos 3 caracteres.', 'error');
        return;
    }
    
    if (!email) {
        mostrarFeedback('Por favor, informe seu e-mail.', 'error');
        return;
    }
    
    if (!validarEmail(email)) {
        mostrarFeedback('Por favor, informe um e-mail válido.', 'error');
        return;
    }
    
    if (!texto) {
        mostrarFeedback('Por favor, escreva seu comentário.', 'error');
        return;
    }
    
    if (texto.length < 10) {
        mostrarFeedback('O comentário deve ter pelo menos 10 caracteres.', 'error');
        return;
    }
    
    if (!avaliacao) {
        mostrarFeedback('Por favor, selecione uma avaliação de 1 a 5 estrelas.', 'error');
        return;
    }
    
    // Criar novo comentário
    const novoComentario = {
        id: Date.now(),
        nome: nome,
        email: email,
        profissao: profissao || '',
        avaliacao: avaliacao,
        texto: texto,
        data: new Date().toISOString()
    };
    
    // Adicionar ao array
    comentarios.unshift(novoComentario);
    
    // Salvar no localStorage
    salvarComentarios();
    
    // Limpar formulário
    document.getElementById('comentario-nome').value = '';
    document.getElementById('comentario-email').value = '';
    document.getElementById('comentario-profissao').value = '';
    document.getElementById('comentario-texto').value = '';
    
    // Desmarcar avaliação
    if (ratingSelected) {
        ratingSelected.checked = false;
    }
    
    // Renderizar novamente a lista
    renderizarComentarios();
    
    // Mostrar mensagem de sucesso
    mostrarFeedback('Comentário enviado com sucesso! Obrigado por sua avaliação.', 'success');
    
    // Scroll para o topo da seção de comentários
    document.getElementById('comentarios').scrollIntoView({ behavior: 'smooth' });
}

// Validar formato de e-mail
function validarEmail(email) {
    const re = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return re.test(email);
}

// Mostrar mensagem de feedback
function mostrarFeedback(mensagem, tipo) {
    const feedback = document.getElementById('mensagem-feedback');
    feedback.textContent = mensagem;
    feedback.className = `aviso-msg aviso-${tipo}`;
    feedback.style.display = 'flex';
    
    // Esconder após 5 segundos
    setTimeout(() => {
        feedback.style.opacity = '0';
        setTimeout(() => {
            feedback.style.display = 'none';
            feedback.style.opacity = '1';
        }, 300);
    }, 5000);
}

// ===== SISTEMA DE ABAS =====
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('nav ul li a');
    const contents = document.querySelectorAll('.tab-content');

    // Função para ativar uma aba específica
    function activateTab(tabId) {
        tabs.forEach(tab => tab.classList.remove('active'));
        contents.forEach(content => content.classList.remove('active-content'));

        const activeTabLink = document.querySelector(`nav ul li a[data-tab="${tabId}"]`);
        if (activeTabLink) {
            activeTabLink.classList.add('active');
        }

        const activeContent = document.getElementById(tabId);
        if (activeContent) {
            activeContent.classList.add('active-content');
        }
    }

    // Adiciona evento de clique em cada link de navegação
    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            activateTab(tabId);
            history.pushState(null, null, `#${tabId}`);
        });
    });

    // Manipulação da hash na URL
    function handleInitialHash() {
        let hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            activateTab(hash);
        } else {
            activateTab('home');
        }
    }

    handleInitialHash();

    // Suporte para botões com data-tab-link
    const tabButtons = document.querySelectorAll('[data-tab-link]');
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTab = this.getAttribute('data-tab-link');
            activateTab(targetTab);
            history.pushState(null, null, `#${targetTab}`);
        });
    });

    // ===== GALERIA =====
    const galleryImages = document.querySelectorAll('.galeria-grid img');
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            window.open(this.src, '_blank');
        });
        img.setAttribute('title', 'Clique para ampliar');
    });

    // ===== INICIALIZAR COMENTÁRIOS =====
    carregarComentarios();
    
    // ===== EVENTO DO BOTÃO DE ENVIAR COMENTÁRIO =====
    const btnEnviar = document.getElementById('btn-enviar-comentario');
    if (btnEnviar) {
        btnEnviar.addEventListener('click', adicionarComentario);
    }
    
    // ===== ANIMAÇÃO DE ENTRADA =====
    const cards = document.querySelectorAll('.card, .faculdade-item');
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
    
    // ===== ATUALIZAR ANO NO FOOTER =====
    const footerYear = document.querySelector('footer p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.innerHTML = footerYear.innerHTML.replace('2026', currentYear);
    }
    
    console.log('NutriChamp carregado! Sistema de comentários funcional.');
});