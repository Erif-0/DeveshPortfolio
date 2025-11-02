// Smooth scroll for arrow indicator
document.querySelector('.scroll-arrow').addEventListener('click', () => {
    document.querySelector('#work').scrollIntoView({ 
        behavior: 'smooth' 
    });
});

// Add smooth scroll for navigation links
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

// Optimized parallax effect with throttling
let lastScrollY = window.scrollY;
let ticking = false;

function updateParallax() {
    const heroContent = document.querySelector('.hero-content');
    const scrollY = window.scrollY;
    
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrollY * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrollY / 600);
    }
    
    lastScrollY = scrollY;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
}, { passive: true });

// Cursor trail effect
const cursor = document.createElement('div');
cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.15s ease, opacity 0.15s ease;
    opacity: 0;
`;
document.body.appendChild(cursor);

// Optimized mousemove with requestAnimationFrame
let mouseX = 0, mouseY = 0;
let cursorTicking = false;

function updateCursor() {
    cursor.style.left = mouseX - 10 + 'px';
    cursor.style.top = mouseY - 10 + 'px';
    cursor.style.opacity = '1';
    cursorTicking = false;
}

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (!cursorTicking) {
        window.requestAnimationFrame(updateCursor);
        cursorTicking = true;
    }
}, { passive: true });

document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
});

// Enhanced hover effect for gallery items
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        cursor.style.transform = 'scale(2)';
        cursor.style.borderColor = 'rgba(255, 255, 255, 0.6)';
    });
    
    item.addEventListener('mouseleave', function() {
        cursor.style.transform = 'scale(1)';
        cursor.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    });
});

// Fade-in animation for gallery items on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animation to gallery items (optimized - reduced delay)
document.querySelectorAll('.gallery-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    // Reduced delay from 0.1s to 0.03s per item for faster loading
    item.style.transition = `opacity 0.4s ease ${index * 0.03}s, transform 0.4s ease ${index * 0.03}s`;
    observer.observe(item);
});

// Add magnetic effect to navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mouseenter', function(e) {
        this.style.transform = 'translateY(-2px)';
    });
    
    link.addEventListener('mouseleave', function(e) {
        this.style.transform = 'translateY(0)';
    });
});

// Lightbox Image Viewer
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const lightboxCounter = document.getElementById('lightbox-counter');

let currentImageIndex = 0;
let galleryImages = [];

// Initialize lightbox
document.querySelectorAll('.gallery-item img').forEach((img, index) => {
    galleryImages.push(img);
    img.parentElement.addEventListener('click', () => {
        currentImageIndex = index;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCounter.textContent = `${index + 1} / ${galleryImages.length}`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Close lightbox
lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Previous image
lightboxPrev.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    const img = galleryImages[currentImageIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
});

// Next image
lightboxNext.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    const img = galleryImages[currentImageIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
});

// Close on background click
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
});
