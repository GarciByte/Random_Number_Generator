// Animación de números flotantes
function animateNumbers() {
    const numbers = document.querySelectorAll('.floating-numbers .number');
    numbers.forEach((number, index) => {
        setTimeout(() => {
            number.style.animationDelay = `${index * 0.5}s`;
        }, index * 100);
    });
}

// Efecto hover en las cards
function initializeCardHovers() {
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Efecto click en el botón de descarga
function initializeDownloadButton() {
    const downloadBtn = document.getElementById('downloadBtn');

    downloadBtn.addEventListener('click', function (e) {
        e.preventDefault();

        const downloadUrl = "https://github.com/GarciByte/Random_Number_Generator/releases/latest/download/Random.Number.Generator.Setup.Latest.exe";

        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
            window.location.href = downloadUrl;
        }, 150);
    });
}

// Scroll smooth para los enlaces internos
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Función de inicialización principal
function initialize() {
    animateNumbers();
    initializeCardHovers();
    initializeDownloadButton();
    initializeSmoothScroll();
}

window.addEventListener('load', initialize);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}