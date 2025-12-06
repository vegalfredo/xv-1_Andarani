document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SLIDER DE FONDO AUTOMÁTICO ---
    const sliderContainer = document.getElementById('background-slider');
    const totalBackgrounds = 8; 
    let currentBg = 0;

    for (let i = 1; i <= totalBackgrounds; i++) {
        const slide = document.createElement('div');
        slide.classList.add('slide');
        slide.style.backgroundImage = `url('assets/img/fondo_${i}.jpg')`; 
        sliderContainer.appendChild(slide);
    }
    const bgSlides = document.querySelectorAll('.slide');
    if(bgSlides.length > 0) bgSlides[0].classList.add('active');

    setInterval(() => {
        bgSlides[currentBg].classList.remove('active');
        currentBg = (currentBg + 1) % bgSlides.length;
        bgSlides[currentBg].classList.add('active');
    }, 5000); 

    // --- 2. CARRUSEL 3D CON ARRASTRE Y MODAL (POP-UP) ---
    const galleryTrack = document.getElementById('gallery-track');
    const totalPhotos = 8;
    const cards = [];

    // Variables para el Modal
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const closeModal = document.querySelector('.close-modal');

    // Generar cartas
    for (let i = 1; i <= totalPhotos; i++) {
        const card = document.createElement('div');
        card.classList.add('gallery-card');
        
        const img = document.createElement('img');
        const imgSrc = `assets/img/quinceanera_${i}.jpg`;
        img.src = imgSrc;
        img.alt = `Valeria ${i}`;
        
        // EVENTO CLIC PARA ABRIR MODAL
        // La lógica del track validará si fue arrastre o clic
        card.addEventListener('click', () => {
            if(!isDragging) { // Solo abrir si NO estamos arrastrando
                modal.style.display = "flex";
                modalImg.src = imgSrc;
            }
        });

        card.appendChild(img);
        galleryTrack.appendChild(card);
        cards.push(card);
    }

    // --- LÓGICA DE ARRASTRE VS CLIC ---
    let isDown = false;
    let isDragging = false; // Bandera para diferenciar clic de arrastre
    let startX;
    let scrollLeft;

    galleryTrack.addEventListener('mousedown', (e) => {
        isDown = true;
        isDragging = false; // Reseteamos al presionar
        galleryTrack.classList.add('active');
        startX = e.pageX - galleryTrack.offsetLeft;
        scrollLeft = galleryTrack.scrollLeft;
    });

    galleryTrack.addEventListener('mouseleave', () => {
        isDown = false;
        galleryTrack.classList.remove('active');
    });

    galleryTrack.addEventListener('mouseup', () => {
        isDown = false;
        galleryTrack.classList.remove('active');
        // Hack: Pequeño timeout para liberar el flag de dragging
        setTimeout(() => isDragging = false, 50);
    });

    galleryTrack.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        
        e.preventDefault();
        isDragging = true; // Si se mueve el mouse, estamos arrastrando
        
        const x = e.pageX - galleryTrack.offsetLeft;
        const walk = (x - startX) * 2; 
        galleryTrack.scrollLeft = scrollLeft - walk;
    });

    // --- CERRAR MODAL ---
    closeModal.addEventListener('click', () => {
        modal.style.display = "none";
    });

    // Cerrar si se da clic fuera de la imagen (en lo negro)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    // --- LÓGICA DE 3D EN EL SCROLL ---
    const updateActiveCard = () => {
        const centerPoint = galleryTrack.scrollLeft + (galleryTrack.offsetWidth / 2);
        
        cards.forEach(card => {
            const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
            const distance = Math.abs(centerPoint - cardCenter);
            
            if (distance < 130) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    };

    galleryTrack.addEventListener('scroll', updateActiveCard);
    
    // Centrar inicialmente
    setTimeout(() => {
        const firstCardWidth = cards[0].offsetWidth;
        galleryTrack.scrollLeft = cards[0].offsetLeft - (galleryTrack.offsetWidth / 2) + (firstCardWidth / 2);
        updateActiveCard();
    }, 100);


    // --- 3. CONFIGURACIÓN FECHA ---
    const currentYear = new Date().getFullYear();
    let eventDate = new Date(`January 31, ${currentYear} 19:00:00`).getTime();
    if (new Date().getTime() > eventDate) {
        eventDate = new Date(`January 31, ${currentYear + 1} 19:00:00`).getTime();
    }

    // --- 4. CUENTA REGRESIVA ---
    const countdown = setInterval(() => {
        const now = new Date().getTime();
        const distance = eventDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days < 10 ? '0' + days : days;
        document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
        document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;

        if (distance < 0) {
            clearInterval(countdown);
            document.getElementById('countdown').innerHTML = "<h2>¡El gran día ha llegado!</h2>";
        }
    }, 1000);

    // --- 5. MÚSICA Y SCROLL ---
    const musicBtn = document.getElementById('music-toggle');
    const audio = document.getElementById('bg-music');
    const icon = document.getElementById('music-icon');
    
    musicBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            icon.classList.remove('fa-volume-mute');
            icon.classList.add('fa-music');
            musicBtn.style.animation = "float 1s infinite";
        } else {
            audio.pause();
            icon.classList.add('fa-volume-mute');
            icon.classList.remove('fa-music');
            musicBtn.style.animation = "none";
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'all 1s ease-out';
        observer.observe(el);
    });
});