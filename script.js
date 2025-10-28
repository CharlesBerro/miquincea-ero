$(document).ready(function() {

    // --- LEER PARÁMETROS DE URL ---
    function getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Obtener nombre de familia y cupos de la URL
    const nombreFamilia = getUrlParameter('familia');
    const cupos = getUrlParameter('cupos');

    // Mostrar nombre de familia en la sección lugar y fecha
    if (nombreFamilia) {
        const nombreDecodificado = decodeURIComponent(nombreFamilia);
        $('#nombre-familia').text(nombreDecodificado);
    } else {
        $('#nombre-familia').text('Invitado Especial'); // Valor por defecto
    }

    // Guardar cupos para mostrar en confirmación
    window.cuposInvitacion = cupos || '';

    // --- LÓGICA DEL CARRUSEL 3D ---
    const items = [
        {
            image: 'img/foto7.jpeg',
            caption: 'Mis 5 años'
        },
        {
            image: 'img/foto5.jpeg',
            caption: 'Mis 10 años'
        },
        {
            image: 'img/foto7.jpeg',
            caption: 'Mis 12 años'
        },
        {
            image: 'img/foto10.jpg',
            caption: 'Mis 15 años'
        },
        {
            image: 'img/foto1.jpg',
            caption: 'Mi Fiesta'
        },
        {
            image: 'img/foto2.jpg',
            caption: 'Mis Amigos'
            
        },
          {
            image: 'img/foto1.jpg',
            caption: 'Mis padres'
            
        }
    ];

    // Variables de estado
    const totalItems = items.length;
    const angle = 360 / totalItems;
    const radius = 300; // Radio del carrusel, ajustado para el tamaño de la tarjeta
    let carouselInitialized = false;

    function createCarouselItems() {
        const carousel = document.getElementById('carousel');
        const indicatorsContainer = document.getElementById('indicators');
        if (!carousel || !indicatorsContainer) return;

        // Limpiar contenido existente (si lo hubiera)
        carousel.innerHTML = '';
        indicatorsContainer.innerHTML = '';

        for (let i = 0; i < totalItems; i++) {
            // Crear elemento del carrusel
            const item = document.createElement('div');
            item.className = 'carousel-item';
            
            const img = document.createElement('img');
            img.className = 'carousel-img';
            img.src = items[i].image;
            img.alt = items[i].caption;
            
            const caption = document.createElement('div');
            caption.className = 'carousel-caption';
            caption.textContent = items[i].caption;
            
            item.appendChild(img);
            item.appendChild(caption);
            carousel.appendChild(item);
            
            // Crear indicadores
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            indicator.dataset.index = i;
            indicatorsContainer.appendChild(indicator);
        }
        
        // Posicionar elementos en 3D
        positionItems();
        updateIndicators(0); // Inicializar el indicador activo
        
        // Forzar que el carrusel sea visible y la animación se active
        const carouselElement = document.querySelector('.carousel');
        if (carouselElement) {
            carouselElement.style.display = 'block';
            carouselElement.style.animation = 'rotate 30s infinite linear';
        }
        
        carouselInitialized = true;
    }

    function ensureCarouselVisible() {
        const momentosSection = $('#momentos');
        const carousel = momentosSection.find('.carousel');
        const carouselScene = momentosSection.find('.carousel-scene');
        
        if (carousel.length && momentosSection.hasClass('active')) {
            // Asegurar que el contenedor del carrusel esté visible
            carouselScene.css({
                'visibility': 'visible',
                'opacity': '1',
                'display': 'block'
            });
            
            // Forzar re-aplicación de la animación del carrusel
            const carouselElement = carousel[0];
            if (carouselElement) {
                // Re-aplicar estilos inline para asegurar visibilidad
                carouselElement.style.display = 'block';
                carouselElement.style.visibility = 'visible';
                carouselElement.style.opacity = '1';
                
                // Forzar reinicio de la animación
                carouselElement.style.animation = 'none';
                setTimeout(() => {
                    carouselElement.style.animation = 'rotate 30s infinite linear';
                }, 10);
            }
        }
    }

    // Posicionar elementos en el espacio 3D
    function positionItems() {
        const carouselItems = document.querySelectorAll('#momentos .carousel-item');
        
        carouselItems.forEach((item, index) => {
            // Calcular rotación en el eje Y
            const rotateY = index * angle;
            
            // Aplicar transformación
            item.style.transform = `rotateY(${rotateY}deg) translateZ(${radius}px)`;
        });
    }

    // Función para actualizar el indicador activo (opcional, si se implementa navegación)
    function updateIndicators(activeIndex) {
        document.querySelectorAll('#momentos .indicator').forEach((ind, index) => {
            ind.classList.toggle('active', index === activeIndex);
        });
    }

    // No inicializar el carrusel inmediatamente, se inicializará cuando se navegue a la sección
    // Esto evita problemas de visibilidad

    // --- FIN LÓGICA DEL CARRUSEL 3D ---
    
    // Partículas deshabilitadas
    // function createFloaters() {
    //     // Deshabilitado
    // }

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
            $('#countdown-number').text('Acompañame...').css('font-size', '12vw').parent().removeClass().addClass('card-countdown animate__animated animate__zoomIn');
            
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
	    
	    // Lógica para re-inicializar el carrusel 3D si se navega a la sección 'momentos'
	    if (newSection.attr('id') === 'momentos') {
	        // Si el carrusel ya fue inicializado, asegurar que esté visible
	        if (carouselInitialized) {
	            ensureCarouselVisible();
	        } else {
	            createCarouselItems(); // Re-inicializa el carrusel
	        }
	    }
	    
	    // Configurar sección de confirmación
	    if (newSection.attr('id') === 'confirmacion') {
	        setupConfirmacion();
	    }
	    
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

    // Configurar sección de confirmación con cupos
    function setupConfirmacion() {
        const cupos = window.cuposInvitacion;
        const numeroCupos = $('#numero-cupos');
        const cuposInfo = $('#cupos-info');
        const whatsappLink = $('#whatsapp-link');
        
        if (cupos && cupos !== '') {
            numeroCupos.text(cupos);
            cuposInfo.show();
            
            // Construir mensaje de WhatsApp con el número de cupos
            const nombre = decodeURIComponent(getUrlParameter('familia') || 'Invitado');
            const mensaje = `Hola, quiero confirmar mi asistencia al quinceañero. Nombre: ${nombre}${cupos ? `. Cupos: ${cupos}` : ''}`;
            const urlWhatsapp = `https://wa.me/1234567890?text=${encodeURIComponent(mensaje)}`;
            whatsappLink.attr('href', urlWhatsapp);
        } else {
            cuposInfo.hide();
            const mensaje = `Hola, quiero confirmar mi asistencia al quinceañero`;
            const urlWhatsapp = `https://wa.me/1234567890?text=${encodeURIComponent(mensaje)}`;
            whatsappLink.attr('href', urlWhatsapp);
        }
    }
});
