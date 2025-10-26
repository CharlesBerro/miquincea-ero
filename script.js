$(document).ready(function() {

    // --- CONFIGURACIÓN DE PARTÍCULAS INICIAL (Estrellas suaves) ---
    particlesJS("particles-js", {
        particles: { number: { value: 80 }, color: { value: "#ffffff" }, shape: { type: "star" }, opacity: { value: 0.5, random: true }, size: { value: 2, random: true }, move: { enable: true, speed: 1, direction: "none", straight: false } },
        interactivity: { events: { onhover: { enable: true, mode: "repulse" } } }
    });

    // --- CONTEO INICIAL Y TRANSICIÓN ---
    let initialCount = 3;
    const music = $('#background-music')[0];
    
    function runInitialCountdown() {
        if (initialCount > 0) {
            // Iniciar música cuando comience el conteo (cuando muestra el 3)
            if (initialCount === 3) {
                music.play().catch(function(error) {
                    console.log('Trying to play music:', error);
                });
            }
            $('#countdown-number').text(initialCount).parent().removeClass().addClass('card-countdown animate__animated animate__zoomIn');
            setTimeout(() => { $('#countdown-number').parent().removeClass().addClass('card-countdown animate__animated animate__zoomOut'); }, 800);
            initialCount--;
            setTimeout(runInitialCountdown, 1000);
        } else {
            triggerPetalExplosion();
            $('#initial-countdown-screen').addClass('animate__animated animate__fadeOut').one('animationend', function() {
                $(this).remove();
                $('#invitation-main, #navigation-controls, #music-btn').removeClass('d-none');
                $('#portada').addClass('active');
                animateSectionContent($('#portada'));
                updateNavButtons();
            });
        }
    }
    runInitialCountdown();

    function triggerPetalExplosion() {
        particlesJS("particles-js", {
            particles: {
                number: { value: 50, density: { enable: true, value_area: 800 } },
                color: { value: ["#ff69b4", "#add8e6", "#ffffff", "#f0e68c"] }, // Rosa, azul, blanco, dorado
                shape: { type: "circle" },
                opacity: { value: 1, random: false },
                size: { value: 15, random: true, anim: { enable: true, speed: 5, size_min: 5, sync: false } },
                move: { enable: true, speed: 6, direction: "bottom", random: true, straight: false, out_mode: "out" }
            },
            interactivity: { detect_on: "window" }
        } );
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
            { selector: '.standard-carousel-container', animation: 'animate__zoomIn', delay: '1s' },
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

    // --- CONTROL DE CARRUSEL DE MOMENTOS ---
    let currentSlide = 0;
    const slides = $('.carousel-slide');
    const totalSlides = slides.length;

    function showSlide(index) {
        $('.momentos-carousel').css('transform', `translateX(-${index * 100}%)`);
        $('.carousel-slide').removeClass('active');
        slides.eq(index).addClass('active');
    }

    $('.carousel-next-btn').on('click', function() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    });

    $('.carousel-prev-btn').on('click', function() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    });

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
