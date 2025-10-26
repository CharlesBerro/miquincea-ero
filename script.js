$(document).ready(function() {

    // Función para crear flotadores SVG
    function createFloaters() {
        const colors = ['#ff69b4', '#add8e6', '#ffffff', '#f0e68c', '#ffb6c1', '#87ceeb'];
        const floaters = [];
        const particlesContainer = document.getElementById('particles-js');
        
        for (let i = 0; i < 30; i++) {
            const floater = document.createElement('div');
            floater.className = 'floater';
            floater.style.position = 'fixed';
            floater.style.width = Math.random() * 20 + 10 + 'px';
            floater.style.height = floater.style.width;
            floater.style.left = Math.random() * 100 + '%';
            floater.style.top = '100%';
            floater.style.background = colors[Math.floor(Math.random() * colors.length)];
            floater.style.borderRadius = '50%';
            floater.style.opacity = '0.8';
            floater.style.zIndex = '0';
            floater.style.pointerEvents = 'none';
            floater.style.animation = `float-up ${Math.random() * 5 + 10}s linear infinite`;
            floater.style.animationDelay = Math.random() * 5 + 's';
            particlesContainer.appendChild(floater);
            floaters.push(floater);
        }
    }
    
    // Crear los flotadores SVG
    createFloaters();

    // --- CONTEO INICIAL Y TRANSICIÓN ---
    let initialCount = 3;
    const music = $('#background-music')[0];
    
    // Botón de abrir invitación
    $('#open-invitation-btn').on('click', function() {
        // Iniciar música cuando el usuario hace clic
        music.play().catch(function(error) {
            console.log('Error al reproducir música:', error);
        });
        
        // Ocultar pantalla de bienvenida y mostrar conteo
        $('#welcome-screen').addClass('animate__animated animate__fadeOut').one('animationend', function() {
            $('#welcome-screen').addClass('d-none');
            $('#initial-countdown-screen').removeClass('d-none');
            runInitialCountdown();
        });
    });
    
    function runInitialCountdown() {
        if (initialCount > 0) {
            $('#countdown-number').text(initialCount).parent().removeClass().addClass('card-countdown animate__animated animate__zoomIn');
            setTimeout(() => { $('#countdown-number').parent().removeClass().addClass('card-countdown animate__animated animate__zoomOut'); }, 800);
            initialCount--;
            setTimeout(runInitialCountdown, 1000);
        } else {
            $('#initial-countdown-screen').addClass('animate__animated animate__fadeOut').one('animationend', function() {
                $(this).remove();
                $('#invitation-main, #navigation-controls, #music-btn').removeClass('d-none');
                $('#portada').addClass('active');
                animateSectionContent($('#portada'));
                updateNavButtons();
            });
        }
    }


    // --- LÓGICA DE NAVEGACIÓN HORIZONTAL ---
    const sections = $('#invitation-main .section');
    let currentSectionIndex = 0;

    $('#next-btn').on('click', function() {
        if (currentSectionIndex < sections.length - 1) { changeSection(currentSectionIndex + 1); }
    });

    $('#prev-btn').on('click', function() {
        if (currentSectionIndex > 0) { changeSection(currentSectionIndex - 1); }
    });

    function changeSection(newIndex) {
        const currentSection = $(sections[currentSectionIndex]);
        const newSection = $(sections[newIndex]);

        // Remueve clases de animación de la sección que se va
        currentSection.find('.animate__animated').removeClass('animate__fadeInDown animate__zoomIn animate__fadeInUp animate__fadeIn');
        
        if (newIndex > currentSectionIndex) { // Hacia adelante
            currentSection.removeClass('active').addClass('previous');
            newSection.addClass('active');
        } else { // Hacia atrás
            currentSection.removeClass('active');
            $(sections[newIndex]).removeClass('previous').addClass('active');
        }
        
        currentSectionIndex = newIndex;
        updateNavButtons();
        animateSectionContent(newSection);
    }
    
    function updateNavButtons() {
        $('#prev-btn').prop('disabled', currentSectionIndex === 0);
        $('#next-btn').prop('disabled', currentSectionIndex === sections.length - 1);
    }
    
    function animateSectionContent(section) {
        section.find('.animate__animated').css('opacity', 0);
        const animations = [
            { selector: '.presentation-title', animation: 'animate__fadeInDown', delay: '0.5s' },
            { selector: '.presentation-photo', animation: 'animate__zoomIn', delay: '0.8s' },
            { selector: '.fifteen-number-container', animation: 'animate__fadeInUp', delay: '1.2s' },
            { selector: '.section-title', animation: 'animate__fadeInDown', delay: '0.5s' },
            { selector: '.carousel-container', animation: 'animate__zoomIn', delay: '1s' },
            { selector: '.cursive-text', animation: 'animate__fadeIn', delay: '0.5s' },
            { selector: '#event-countdown', animation: 'animate__fadeInUp', delay: '1.5s' },
            { selector: '.main-invite-text', animation: 'animate__zoomIn', delay: '0.5s' },
            { selector: '.address-text', animation: 'animate__zoomIn', delay: '1s' },
            { selector: '.dress-code-text', animation: 'animate__fadeIn', delay: '0.5s' },
            { selector: '.gift-text', animation: 'animate__fadeIn', delay: '0.5s' },
            { selector: '.confirmation-text', animation: 'animate__fadeIn', delay: '0.5s' }
        ];
        
        setTimeout(() => {
            animations.forEach(item => {
                const el = section.find(item.selector);
                if (el.length) {
                    el.css({ 'opacity': 1, 'animation-delay': item.delay }).addClass(item.animation);
                }
            });
        }, 300);
    }


    // --- CONTEO REGRESIVO DEL EVENTO Y MÚSICA ---
    // (Esta parte del código no ha cambiado)
    const eventDate = new Date("Nov 23, 2025 16:00:00").getTime();
    setInterval(function() {
        const now = new Date().getTime();
        const distance = eventDate - now;
        $('#days').text(Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0'));
        $('#hours').text(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0'));
        $('#minutes').text(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0'));
        $('#seconds').text(Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0'));
    }, 1000);

    $('#music-btn').on('click', function() {
        if (music.paused) { music.play(); $(this).addClass('playing'); } 
        else { music.pause(); $(this).removeClass('playing'); }
    });
});
