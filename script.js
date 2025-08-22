// ===== SITICA BARRAFRANCA - SCRIPT.JS COMPLETO =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initRatingModal();
    initNavigation();
    initScrollEffects();
    initMobileMenu();
    initCarousel();
    initAccessibility();
    initSocialLinks();
    initPhoneTracking();
});

// ===== RATING MODAL FUNCTIONALITY =====
function initRatingModal() {
    const modal = document.getElementById('ratingModal');
    if (!modal) return;
    const closeBtn = document.querySelector('.rating-close');
    const skipBtn = document.getElementById('skipRating');

    setTimeout(() => {
        if (!localStorage.getItem('sitica_rated')) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }, 3000);

    const hideModal = () => {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        localStorage.setItem('sitica_rated', 'true');
    };

    closeBtn.addEventListener('click', hideModal);
    skipBtn.addEventListener('click', hideModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) hideModal();
    });
}

// ===== NAVIGATION FUNCTIONALITY =====
function initNavigation() {
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                const mobileNav = document.querySelector('.nav-links');
                if (mobileNav.classList.contains('show')) {
                    document.querySelector('.mobile-toggle').click();
                }
            }
        });
    });

    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        const headerHeight = header.offsetHeight;
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 25;
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        header.classList.toggle('scrolled', currentScrollY > 100);
        
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
    });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileToggle || !navLinks) return;
    
    mobileToggle.addEventListener('click', function() {
        const isMenuOpen = navLinks.classList.toggle('show');
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        
        const spans = mobileToggle.querySelectorAll('span');
        if (spans.length >= 3) {
            if (isMenuOpen) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans.forEach(span => {
                    span.style.transform = '';
                    span.style.opacity = '';
                });
            }
        }
    });
}

// ===== CAROUSEL INITIALIZATION =====
function initCarousel() {
    const carouselTrack = document.querySelector('.carousel__track');
    if (!carouselTrack) return;
    
    if (carouselTrack.children.length === 0) {
        new WorkingCarousel();
    }
}

// ===== WORKING CAROUSEL CLASS =====
class WorkingCarousel {
    constructor() {
        this.track = document.querySelector('.carousel__track');
        this.prevBtn = document.querySelector('.carousel__button--left');
        this.nextBtn = document.querySelector('.carousel__button--right');
        this.counter = document.querySelector('.carousel__counter');
        this.trackContainer = document.querySelector('.carousel__track-container');
        
        this.currentIndex = 0;
        this.validImages = [];
        this.slides = [];
        
        // Scroll/Drag variables
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.startTransform = 0;
        this.isTransitioning = false; // Prevent rapid clicks
        
        this.init();
    }

    async init() {
        // Lista delle immagini da testare
        const imageList = this.generateImageList();
        
        // Trova solo le immagini che esistono veramente
        this.validImages = await this.findValidImages(imageList);
        
        if (this.validImages.length === 0) {
            console.error('Nessuna immagine trovata nella cartella images/');
            return;
        }

        // Crea il carosello solo con immagini valide
        this.createCarousel();
        this.setupEvents();
        this.updateCounter();
        
        console.log(`Carosello creato con ${this.validImages.length} immagini`);
    }

    generateImageList() {
        const list = ['2', '5', '7'];
        for (let i = 8; i <= 66; i++) {
            list.push(i.toString());
        }
        return list;
    }

    async findValidImages(imageList) {
        const validImages = [];
        
        for (const imageName of imageList) {
            const exists = await this.checkImageExists(imageName);
            if (exists) {
                validImages.push(imageName);
            }
        }
        
        return validImages;
    }

    checkImageExists(imageName) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = `images/${imageName}.jpeg`;
        });
    }

    createCarousel() {
        // Crea slide solo per immagini valide
        this.validImages.forEach((imageName, index) => {
            const slide = document.createElement('li');
            slide.className = 'carousel__slide';
            
            const img = document.createElement('img');
            img.className = 'carousel__image';
            img.src = `images/${imageName}.jpeg`;
            img.alt = `Galleria Sitica - ${imageName}`;
            
            slide.appendChild(img);
            this.track.appendChild(slide);
        });

        this.slides = Array.from(this.track.children);
    }

    setupEvents() {
        // Pulsanti con throttle per evitare clic troppo rapidi
        this.prevBtn.addEventListener('click', () => {
            if (!this.isTransitioning) {
                this.prevSlide();
            }
        });
        this.nextBtn.addEventListener('click', () => {
            if (!this.isTransitioning) {
                this.nextSlide();
            }
        });
        
        // Mouse drag
        this.trackContainer.addEventListener('mousedown', (e) => this.startDrag(e.clientX));
        document.addEventListener('mousemove', (e) => this.updateDrag(e.clientX));
        document.addEventListener('mouseup', () => this.endDrag());
        
        // Touch
        this.trackContainer.addEventListener('touchstart', (e) => 
            this.startDrag(e.touches[0].clientX), {passive: true});
        this.trackContainer.addEventListener('touchmove', (e) => 
            this.updateDrag(e.touches[0].clientX), {passive: true});
        this.trackContainer.addEventListener('touchend', () => this.endDrag(), {passive: true});
        
        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.carousel')) {
                if (e.key === 'ArrowLeft') this.prevSlide();
                if (e.key === 'ArrowRight') this.nextSlide();
            }
        });
    }

    startDrag(clientX) {
        this.isDragging = true;
        this.startX = clientX;
        this.startTransform = this.getCurrentTransform();
        this.track.classList.add('dragging');
        this.trackContainer.style.cursor = 'grabbing';
    }

    updateDrag(clientX) {
        if (!this.isDragging) return;
        
        this.currentX = clientX;
        const diff = clientX - this.startX;
        const newTransform = this.startTransform + diff;
        this.track.style.transform = `translateX(${newTransform}px)`;
    }

    endDrag() {
        if (!this.isDragging) return;
        
        const diff = this.startX - this.currentX;
        this.track.classList.remove('dragging');
        this.trackContainer.style.cursor = 'grab';
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) this.nextSlide();
            else this.prevSlide();
        } else {
            this.goToSlide(this.currentIndex);
        }
        
        this.isDragging = false;
    }

    getCurrentTransform() {
        const transform = this.track.style.transform;
        const match = transform.match(/translateX\((-?\d+(?:\.\d+)?)px\)/);
        return match ? parseFloat(match[1]) : 0;
    }

    goToSlide(index) {
        if (index < 0 || index >= this.slides.length || this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        const offset = -100 * index;
        this.track.style.transform = `translateX(${offset}%)`;
        this.currentIndex = index;
        this.updateCounter();
        
        // Reset transition lock after animation completes
        setTimeout(() => {
            this.isTransitioning = false;
        }, 800); // Match CSS transition duration
    }

    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }

    updateCounter() {
        this.counter.textContent = `${this.currentIndex + 1} / ${this.slides.length}`;
    }
}

// ===== ACCESSIBILITY IMPROVEMENTS =====
function initAccessibility() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
}

// ===== SOCIAL MEDIA INTEGRATION =====
function initSocialLinks() {
    const socialLinks = document.querySelectorAll('a[href*="instagram"], a[href*="facebook"]');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', () => {
            console.log('Social media link clicked:', link.href);
        });
    });
}

// ===== PHONE CALL TRACKING =====
function initPhoneTracking() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    
    phoneLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            console.log('Phone call initiated');
            
            if (window.innerWidth > 768 && !confirm('Stai per chiamare Sitica. Continuare?')) {
                e.preventDefault();
            }
        });
    });
}

// ===== CONSOLE WELCOME MESSAGE =====
console.log(`
🌿 Benvenuto nel sito di SITICA Barrafranca! 🌿
Developed with ❤️ for the best Food & Drink Hub in Sicily

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Via Garibaldi 45, 94012 Barrafranca (EN)
📞 +39 333 596 9079
🌐 Instagram: @sitica_barrafranca
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Grazie per aver visitato il nostro sito!
`);