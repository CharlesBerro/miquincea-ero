$(document).ready(function() {

    // Partículas deshabilitadas
    // function createFloaters() {
    //     // Deshabilitado
    // }

    // --- CONTEO INICIAL Y TRANSICIÓN ---
    let initialCount = 3;
    const music = $('#background-music')[0];
    
    // Botón de abrir invitación
    console.log('Script cargado');
    console.log('Botón encontrado:', $('#open-invitation-btn').length);
    
    // Usar on() con delegación directa
    $(document).on('click', '#open-invitation-btn', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Botón clickeado!');
        
        // Iniciar música cuando el usuario hace clic
        if (music) {
            music.play().catch(function(error) {
                console.log('Error al reproducir música:', error);
            });
        }
        
        // Ocultar pantalla de bienvenida inmediatamente
        $('#welcome-screen').css('display', 'none');
        $('#initial-countdown-screen').removeClass('d-none');
        runInitialCountdown();
    });
    
    function runInitialCountdown() {
        if (initialCount > 0) {
            $('#countdown-number').text(initialCount).parent().removeClass().addClass('card-countdown animate__animated animate__zoomIn');
            setTimeout(() => { $('#countdown-number').parent().removeClass().addClass('card-countdown animate__animated animate__zoomOut'); }, 800);
            initialCount--;
            setTimeout(runInitialCountdown, 1000);
        } else {
            // Animación especial al terminar
            $('#countdown-number').text('Vamos...').css('font-size', '15vw').parent().removeClass().addClass('card-countdown animate__animated animate__zoomIn');
            
            setTimeout(() => {
                $('#initial-countdown-screen').addClass('animate__animated animate__fadeOut');
                setTimeout(() => {
                    $('#initial-countdown-screen').remove();
                    // Transición suave a la primera sección
                    $('#invitation-main').removeClass('d-none').css('opacity', 0);
                    $('#navigation-controls, #music-btn').removeClass('d-none');
                    
                    $('#portada').addClass('active').css('opacity', 0);
                    
                    // Animación de entrada elegante
                    setTimeout(() => {
                        $('#invitation-main').css('opacity', 1);
                        $('#portada').css({
                            'opacity': 1,
                            'animation': 'zoomIn 1s ease-out'
                        });
                        animateSectionContent($('#portada'));
                        updateNavButtons();
                    }, 300);
                }, 800);
            }, 800);
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
