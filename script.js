/* ARQUIVO: script.js */

// Aguarda o conteúdo da página carregar antes de rodar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- Seletores de Elementos Principais ---
    const loadingOverlay = document.getElementById('loadingOverlay');
    const playButton = document.getElementById('playButton');
    const music = document.getElementById('bg-music');
    const ourSongDisplay = document.getElementById('ourSong');
    const surpriseBtn = document.getElementById('surpriseBtn');
    const specialMessage = document.getElementById('specialMessage');
    const soundVisualizer = document.getElementById('soundVisualizer');
    const hiddenHeart = document.getElementById('hiddenHeart');
    const cursor = document.querySelector('.custom-cursor');
    const particlesContainer = document.querySelector('.particles');
    const typingSubtitle = document.getElementById('typing-subtitle'); // Pega o novo <p>

    // --- Otimização: Detecta se o dispositivo é mobile (touch) ou desktop (mouse) ---
    const isDesktop = window.matchMedia("(pointer: fine)").matches;

    // --- Conquistas (Achievements) ---
    let achievements = {
        firstClick: false,
        tripleClick: false,
        longHover: false,
        allPhotosHovered: false,
        secretHeart: false
    };

    // --- 1. Lógica de Loading e Música ---
    if (playButton) {
        playButton.addEventListener('click', () => {
            // Tenta tocar a música
            if (music) {
                music.volume = 0.4; // Começa com volume médio
                music.play().catch(error => console.error("Erro ao tocar música:", error));
            }
            
            // Remove a tela de loading com animação
            if (loadingOverlay) {
                loadingOverlay.style.animation = 'fadeOut 1s ease-in-out forwards';
                setTimeout(() => loadingOverlay.remove(), 1000);
            }

            // Mostra o display "Nossa Música"
            if (ourSongDisplay) {
                ourSongDisplay.classList.add('show');
            }
            
            // --- CORREÇÃO DO FADE-IN (COM DELAY) ---
            setTimeout(() => {
                const container = document.querySelector('.container');
                if (container) {
                    container.style.opacity = '1';
                }
            }, 200); // Começa o fade-in 200ms após o clique
            
            // --- NOVA MELHORIA: Inicia o "Typing" ---
            // Espera a animação do header (1.5s) terminar
            setTimeout(() => {
                startTypingEffect();
            }, 1500); 
        });
    } else {
        // Fallback caso o botão de play falhe (mostra o site mesmo assim)
        setTimeout(() => {
            const container = document.querySelector('.container');
            if (container) {
                container.style.opacity = '1';
            }
        }, 100);
        // Inicia o typing mesmo se o botão falhar (após um pequeno delay)
        setTimeout(() => {
            startTypingEffect();
        }, 1000);
    }

    // --- 2. Cursor Personalizado (SÓ ATIVA EM DESKTOP) ---
    if (isDesktop && cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
            
            // Criar trilha do cursor
            if (Math.random() > 0.8) {
                let trail = document.createElement('div');
                trail.className = 'cursor-trail';
                trail.style.left = e.clientX - 3 + 'px';
                trail.style.top = e.clientY - 3 + 'px';
                document.body.appendChild(trail);
                
                // Anima o desaparecimento e remove
                trail.style.opacity = '1';
                setTimeout(() => {
                    trail.style.opacity = '0';
                    setTimeout(() => trail.remove(), 1000);
                }, 100);
            }
        });
    }

    // --- 3. Efeito de Partículas ---
    // OTIMIZAÇÃO: Intervalo de partículas (menos em mobile)
    const particleInterval = isDesktop ? 300 : 700; // Menos partículas em telas mobile
    setInterval(createParticle, particleInterval);
    // Criar partículas iniciais
    for (let i = 0; i < 15; i++) {
        setTimeout(() => createParticle(), i * 200);
    }

    // --- 4. Lógica da Surpresa Principal ---
    if (surpriseBtn) {
        surpriseBtn.addEventListener('click', () => {
            if (specialMessage) {
                specialMessage.classList.add('show');
            }
            
            // Chama as animações
            createHeartExplosion();
            createTeAmoAnimation();
            
            // Vibração (se o celular suportar)
            if (navigator.vibrate) {
                navigator.vibrate([200, 100, 200, 100, 300]);
            }
            
            // Mudança temporária da cor de fundo
            document.body.style.background = 'linear-gradient(135deg, #007bff, #003366, #000000, #3399ff)';
            document.body.style.backgroundSize = '400% 400%';
            document.body.style.animation = 'gradient-shift 2s ease infinite';
            
            setTimeout(() => {
                document.body.style.background = 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a2a 100%)';
                document.body.style.animation = '';
            }, 4000);
            
            // Criar mais partículas especiais
            for (let i = 0; i < 50; i++) {
                setTimeout(() => createParticle(), i * 50);
            }
        });
    }

    // --- 5. Easter Egg: Triplo Clique (MODO ROMÂNTICO CORRIGIDO) ---
    let clickCount = 0;
    let clickTimer;
    
    document.addEventListener('click', (e) => {
        // Ignora cliques em botões, links ou no coração secreto
        if (e.target.closest('button') || e.target.closest('a') || e.target.id === 'hiddenHeart') {
            clickCount = 0; 
            return;
        }

        clickCount++;
        clearTimeout(clickTimer);

        if (clickCount === 3) {
            // --- MODO ROMÂNTICO ATIVADO ---
            
            // 1. Vibração de coração
            if (navigator.vibrate) {
                navigator.vibrate([100, 50, 100, 50, 100]); // Padrão "tum-tum... tum-tum"
            }
            
            // 2. Explosão de corações
            createHeartExplosion();

            // 3. Overlay de Brilho Dourado
            const romanceOverlay = document.createElement('div');
            romanceOverlay.className = 'romance-overlay';
            document.body.appendChild(romanceOverlay);

            // 4. Texto Romântico
            const text = document.createElement('div');
            text.className = 'ultra-dark-text'; // Reusa o estilo
            text.innerHTML = '💖 MODO AMOR ATIVADO! 💖'; // Texto novo!
            document.body.appendChild(text);
            
            // 5. Remove os efeitos após 3 segundos
            setTimeout(() => {
                text.remove();
                romanceOverlay.remove(); // Remove o overlay dourado
            }, 3000);
            
            clickCount = 0; // Reseta a contagem
        } else {
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 800); // Tempo limite para o triplo clique
        }
        
        // Efeito de clique (ripple) - Não ativa se for o 3º clique
        if (clickCount !== 0) { // Só cria o ripple se não ativou o modo amor
            const ripple = document.createElement('div');
            ripple.className = 'ripple-effect';
            ripple.style.left = `${e.clientX - 25}px`;
            ripple.style.top = `${e.clientY - 25}px`;
            document.body.appendChild(ripple);
            setTimeout(() => ripple.remove(), 800);
        }
    });

    // --- 6. Efeito Parallax 3D (SÓ ATIVA EM DESKTOP) ---
    if (isDesktop) {
        document.addEventListener('mousemove', (e) => {
            const cards = document.querySelectorAll('.love-card, .photo-frame');
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            cards.forEach((card) => {
                // O valor '2' controla a intensidade do efeito
                const x = (mouseX - 0.5) * (2 * -1); // Invertido para efeito 3D
                const y = (mouseY - 0.5) * (2 * -1);
                
                // Aplica rotação e mantém animação
                let currentTransform = card.style.transform.replace(/rotate[XY]\([^)]+\)/g, '').trim(); // Remove rotações antigas
                card.style.transform = `${currentTransform} rotateY(${x}deg) rotateX(${y}deg)`;
            });
        });

        // Reseta a rotação quando o mouse sai da janela
        document.addEventListener('mouseleave', () => {
             const cards = document.querySelectorAll('.love-card, .photo-frame');
             cards.forEach(card => {
                let currentTransform = card.style.transform.replace(/rotate[XY]\([^)]+\)/g, '').trim(); // Remove rotações antigas
                card.style.transform = `${currentTransform} rotateY(0deg) rotateX(0deg)`;
             });
        });
    }

    // --- 7. Efeito Parallax no Scroll (Ondas e Partículas) ---
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        
        const waveBg = document.querySelector('.wave-bg');
        if (waveBg) {
            waveBg.style.transform = `translateY(${rate}px) scale(1.1)`;
        }
        
        // Parallax das partículas
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            const speed = (index % 3 + 1) * 0.1;
            // Adiciona o translate Y ao transform existente
             let currentTransform = particle.style.transform.replace(/translateY\([^)]+\)/g, '').trim();
             particle.style.transform = `${currentTransform} translateY(${scrolled * speed}px)`;
        });
    });

    // --- 8. Notificações Românticas ---
    const romanticMessages = [
        "💖 Você é meu mundo inteiro!",
        "🌹 Cada dia com você é especial!",
        "💎 Você é meu tesouro mais precioso!",
        "✨ Meu coração bate só por você!",
        "🥰 Te amo mais a cada segundo!",
        "💕 Você é minha felicidade!",
        "🌟 Minha estrela mais brilhante!",
        "💘 Amor da minha vida toda!"
    ];

    // Mostra notificações aleatórias
    setInterval(showNotification, 18000); // A cada 18 segundos
    setTimeout(showNotification, 6000); // Primeira notificação após 6s

    // --- 9. Visualizador de Som ---
    setInterval(createSoundWave, 150); // Cria barras de som rapidamente

    // --- 10. Conquistas (Achievements) ---
    
    // Conquista: Hover Longo
    let hoverTimer;
    const loveCard = document.querySelector('.love-card');
    if (loveCard) {
        loveCard.addEventListener('mouseenter', () => {
            hoverTimer = setTimeout(() => {
                if (!achievements.longHover) {
                    achievements.longHover = true;
                    showAchievement('🏆 Romântico Contemplador!', 'Você admirou a carta por 3 segundos');
                }
            }, 3000);
        });
        loveCard.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimer);
        });
    }

    // Conquista: Hover em todas as fotos
    let hoveredPhotos = new Set();
    const photoFrames = document.querySelectorAll('.photo-frame');
    photoFrames.forEach((frame, index) => {
        frame.addEventListener('mouseenter', () => {
            hoveredPhotos.add(index);
            // Atualiza a contagem total de fotos dinamicamente
            if (hoveredPhotos.size === photoFrames.length && !achievements.allPhotosHovered) {
                achievements.allPhotosHovered = true;
                showAchievement('📸 Guardião de Memórias!', 'Você visitou todas as nossas lembranças');
            }
        });
    });
    
    // Conquista: Coração Secreto
    if(hiddenHeart) {
        hiddenHeart.addEventListener('click', () => {
            if (!achievements.secretHeart) {
                achievements.secretHeart = true;
                showAchievement('💖 Detetive do Amor!', 'Você encontrou o coração secreto!');
                createHeartExplosion();
            }
        });
    }

    // --- 11. Observador de Animação (Scroll) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target); // Para a animação não repetir
            }
        });
    }, observerOptions);

    // --- CORREÇÃO: Remover .special-message do observer ---
    const elementsToAnimate = document.querySelectorAll('.photo-frame, .footer'); 
    elementsToAnimate.forEach(el => observer.observe(el));
    
    // --- 12. NOVA FUNÇÃO: Efeito "Typing" ---
    function startTypingEffect() {
        const text = "Uma declaração de amor criada especialmente para você 🤍";
        let index = 0;
        
        if (!typingSubtitle) return;
        
        // Garante que o texto está vazio e o cursor visível
        typingSubtitle.innerHTML = "";
        typingSubtitle.style.borderRight = "2px solid var(--silver)"; // Garante que comece com o cursor
        typingSubtitle.style.animation = "typing-blink 0.7s step-end infinite"; // Garante animação do cursor

        let intervalId = setInterval(() => {
            if (index < text.length) {
                typingSubtitle.innerHTML += text.charAt(index);
                index++;
            } else {
                clearInterval(intervalId);
                // Mantém o texto, mas remove o cursor e a animação de piscar
                 setTimeout(() => { // Pequeno delay para o cursor 'sumir'
                    typingSubtitle.style.borderRight = "none";
                    typingSubtitle.style.animation = "pulse-text 3s ease-in-out infinite"; // Retoma a animação de pulso
                 }, 500); 
            }
        }, 70); // Velocidade da digitação (70ms)
    }

    // --- FIM DO DOMCONTENTLOADED ---
});


/* ================================================================
FUNÇÕES GLOBAIS
(Funções chamadas pelos listeners acima)
================================================================ */

/**
 * Cria uma partícula de fundo e a adiciona na tela.
 */
function createParticle() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return; // Não faz nada se o container não existir

    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    
    // Cores (paleta azul)
    const particleColors = [
      'rgba(54, 162, 235, 0.8)', 
      'rgba(0, 86, 179, 0.8)', 
      'rgba(0, 191, 255, 0.6)', 
      'rgba(173, 216, 230, 0.4)'
    ];
    particle.style.background = `radial-gradient(circle, ${particleColors[Math.floor(Math.random() * particleColors.length)]}, transparent)`;
    
    // Animação
    const duration = (Math.random() * 6 + 4); // Duração entre 4s e 10s
    particle.style.animationDuration = duration + 's';
    particle.style.animationDelay = Math.random() * 2 + 's';
    
    particlesContainer.appendChild(particle);
    
    // Remove a partícula depois que a animação termina
    setTimeout(() => particle.remove(), (duration + 2) * 1000);
}


/**
 * Cria a animação épica "TE AMO"
 */
function createTeAmoAnimation() {
    const teAmoTexts = [
        'TE AMO ❤️', '💖 TE AMO MUITO 💖', 'EU TE VIVO!', '❤️ MEU AMOR ❤️',
        'TE AMO PARA SEMPRE!', '💕 VOCÊ É TUDO 💕', 'MEU BEM!', '🥰 TE AMO DEMAIS 🥰'
    ];
    
    // 1. Animação central principal
    const mainTeAmo = document.createElement('div');
    mainTeAmo.className = 'te-amo-main';
    mainTeAmo.innerHTML = 'TE AMO ❤️';
    document.body.appendChild(mainTeAmo);
    setTimeout(() => mainTeAmo.remove(), 4000);

    // 2. Múltiplos "TE AMO" flutuantes
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const teAmo = document.createElement('div');
            teAmo.className = 'te-amo-float';
            teAmo.innerHTML = teAmoTexts[Math.floor(Math.random() * teAmoTexts.length)];
            
            const startX = Math.random() * window.innerWidth;
            const startY = Math.random() * window.innerHeight;
            
            teAmo.style.left = `${startX}px`;
            teAmo.style.top = `${startY}px`;
            
            // --- CORREÇÃO DO TAMANHO NO CELULAR ---
            const isMobile = window.innerWidth < 768;
            const fontSize = isMobile 
                                ? Math.random() * 0.8 + 0.9  // Aleatório entre 0.9rem e 1.7rem no celular
                                : Math.random() * 2 + 1.5;   // Aleatório entre 1.5rem e 3.5rem no desktop
            teAmo.style.fontSize = `${fontSize}rem`;
            // --- FIM DA CORREÇÃO ---
            
            teAmo.style.color = Math.random() > 0.5 ? 'var(--light-blue)' : 'var(--gold)';
            
            document.body.appendChild(teAmo);
            setTimeout(() => teAmo.remove(), 3000);
        }, i * 200);
    }

    // 3. Chuva de "TE AMO" pequenos
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const miniTeAmo = document.createElement('div');
            miniTeAmo.className = 'te-amo-rain';
            miniTeAmo.innerHTML = '💖 TE AMO';
            miniTeAmo.style.left = `${Math.random() * 100}%`;
            miniTeAmo.style.animationDuration = `${Math.random() * 3 + 3}s`; // Duração entre 3s e 6s
            
            document.body.appendChild(miniTeAmo);
            setTimeout(() => miniTeAmo.remove(), 6000);
        }, i * 150);
    }

    // 4. Efeito de pulso na tela
    const pulseOverlay = document.createElement('div');
    pulseOverlay.className = 'love-pulse-overlay';
    document.body.appendChild(pulseOverlay);
    setTimeout(() => pulseOverlay.remove(), 2000);
}


/**
 * Cria uma explosão de corações (Emojis)
 */
function createHeartExplosion() {
    const hearts = ['❤️', '💖', '💕', '💗', '💓', '💝', '♥️', '💘', '🥰', '😍'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart-explosion';
            heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = Math.random() * window.innerWidth + 'px';
            heart.style.top = Math.random() * window.innerHeight + 'px';
            heart.style.color = Math.random() > 0.5 ? 'var(--light-blue)' : 'var(--gold)';
            heart.style.fontSize = `${Math.random() * 1.5 + 1}rem`; // Tamanho variado
            
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 2000);
        }, i * 50); // Espalha a explosão
    }
}


/**
 * Mostra uma notificação romântica aleatória.
 */
function showNotification() {
    const romanticMessages = [
        "💖 Você é meu mundo inteiro!", "🌹 Cada dia com você é especial!", "💎 Você é meu tesouro!",
        "✨ Meu coração bate só por você!", "🥰 Te amo mais a cada segundo!", "💕 Você é minha felicidade!",
        "🌟 Minha estrela mais brilhante!", "💘 Amor da minha vida toda!"
    ];
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = romanticMessages[Math.floor(Math.random() * romanticMessages.length)];
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
}


/**
 * Cria uma barra para o visualizador de som.
 */
function createSoundWave() {
    const soundVisualizer = document.getElementById('soundVisualizer');
    if (!soundVisualizer) return; // Para se o elemento não existir

    const wave = document.createElement('div');
    wave.style.height = `${Math.random() * 40 + 10}px`; // Altura aleatória
    wave.style.animationDuration = `${Math.random() * 0.3 + 0.3}s`; // Duração aleatória
    
    soundVisualizer.appendChild(wave);
    
    // Limita o número de barras para não sobrecarregar
    if (soundVisualizer.children.length > 15) {
        soundVisualizer.children[0].remove();
    }
    
    // Remove a barra depois de um tempo
    setTimeout(() => wave.remove(), 2000);
}


/**
 * Mostra uma popup de Conquista (Achievement).
 * @param {string} title - O título da conquista (ex: "🏆 Título!")
 * @param {string} description - A descrição da conquista.
 */
function showAchievement(title, description) {
    const achievement = document.createElement('div');
    achievement.className = 'achievement';
    achievement.innerHTML = `
        <div style="font-size: 1.5rem; margin-bottom: 5px;">${title}</div>
        <div style="font-size: 0.9rem; opacity: 0.8;">${description}</div>
    `;
    
    document.body.appendChild(achievement);
    setTimeout(() => achievement.remove(), 3000);
}
