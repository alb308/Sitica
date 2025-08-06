// ===== SITICA BARRAFRANCA - SCRIPT.JS =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initRatingModal();
    initNavigation();
    initScrollEffects();
    initAnimations();
    initServiceButtons();
    initMobileMenu();
});

// ===== RATING MODAL FUNCTIONALITY =====
function initRatingModal() {
    const modal = document.getElementById('ratingModal');
    const closeBtn = document.querySelector('.rating-close');
    const skipBtn = document.getElementById('skipRating');
    const reviewBtn = document.getElementById('goToReviews');

    // Show modal after 3 seconds
    setTimeout(() => {
        // Check if user has already rated (stored in localStorage)
        if (!localStorage.getItem('sitica_rated')) {
            showModal();
        }
    }, 3000);

    function showModal() {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function hideModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        // Mark as rated to prevent showing again
        localStorage.setItem('sitica_rated', 'true');
    }

    // Close modal events
    closeBtn.addEventListener('click', hideModal);
    skipBtn.addEventListener('click', hideModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideModal();
        }
    });

    // Handle review button click
    reviewBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // Here you should put the actual link to your review site
        // For now, it will show a message asking for the link
        const reviewUrl = prompt('Inserisci il link del tuo sito recensioni:', 'https://tuosito-recensioni.com');
        if (reviewUrl && reviewUrl !== 'https://tuosito-recensioni.com') {
            window.open(reviewUrl, '_blank');
            hideModal();
        } else {
            showNotification('Link Recensioni', 'Aggiorna il link del sito recensioni nel codice JavaScript!');
        }
    });
}

// ===== NAVIGATION FUNCTIONALITY =====
function initNavigation() {
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(this);
            }
        });
    });

    // Update active nav link based on scroll position
    function updateActiveNavLink(activeLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // Auto-update active nav link on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + header.offsetHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                updateActiveNavLink(activeLink);
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
        
        // Header background effect
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// ===== ANIMATION ON SCROLL =====
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.service-card, .gallery-item, .contact-item, .feature, .stat'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Stagger animations for service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// ===== SERVICE BUTTONS FUNCTIONALITY =====
function initServiceButtons() {
    const serviceButtons = document.querySelectorAll('.btn-service');
    
    serviceButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const buttonText = this.textContent.trim();
            const action = this.getAttribute('data-action');
            
            if (action === 'reviews') {
                handleReviews();
            } else {
                switch(buttonText) {
                    case 'Prenota Tavolo':
                        handleReservation();
                        break;
                    case 'Vedi Carta':
                        handleMenu();
                        break;
                    case 'Scopri Menu':
                        handleMenu();
                        break;
                    case 'Richiedi Info':
                        handleEventInfo();
                        break;
                    case 'Prossimi Eventi':
                        handleEvents();
                        break;
                    default:
                        showComingSoonMessage();
                }
            }
        });
    });
}

function handleReviews() {
    // Here you should put the actual link to your review site
    // For now, it will show a message asking for the link
    const reviewUrl = prompt('Inserisci il link del tuo sito recensioni:', 'https://tuosito-recensioni.com');
    if (reviewUrl && reviewUrl !== 'https://tuosito-recensioni.com') {
        window.open(reviewUrl, '_blank');
    } else {
        showNotification('Link Recensioni', 'Aggiorna il link del sito recensioni nel codice JavaScript!');
    }
}

function handleReservation() {
    // You can replace this with your actual booking system
    const phoneNumber = '+393471234567';
    const message = encodeURIComponent('Ciao! Vorrei prenotare un tavolo da Sitica. Potete aiutarmi?');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
}

function handleMenu() {
    showNotification('Menu', 'Il nostro menu completo sarà presto disponibile online. Chiamaci per informazioni sui piatti del giorno!');
}

function handleEventInfo() {
    const phoneNumber = '+393471234567';
    const message = encodeURIComponent('Ciao! Sono interessato ad organizzare un evento privato da Sitica. Potreste darmi maggiori informazioni?');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
}

function handleEvents() {
    showNotification('Eventi Live', 'Seguici sui social per rimanere aggiornato sui prossimi eventi e serate musicali!');
}

function showComingSoonMessage() {
    showNotification('Coming Soon', 'Questa funzionalità sarà disponibile a breve. Continua a seguirci!');
}

function showNotification(title, message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <h4>${title}</h4>
            <p>${message}</p>
            <button class="notification-close">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(101, 104, 57, 0.2);
        z-index: 9999;
        max-width: 350px;
        border-left: 4px solid var(--primary-green);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    let isMenuOpen = false;
    
    if (!mobileToggle || !navLinks) return;
    
    mobileToggle.addEventListener('click', function() {
        isMenuOpen = !isMenuOpen;
        toggleMobileMenu();
    });
    
    function toggleMobileMenu() {
        if (isMenuOpen) {
            // Open menu
            navLinks.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Animate hamburger
            const spans = mobileToggle.querySelectorAll('span');
            if (spans.length >= 3) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            }
            
        } else {
            // Close menu
            navLinks.classList.remove('show');
            document.body.style.overflow = '';
            
            // Reset hamburger
            const spans = mobileToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = '';
                span.style.opacity = '';
            });
        }
    }
    
    // Close mobile menu when clicking on a link
    const navLinksElements = document.querySelectorAll('.nav-link');
    navLinksElements.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                isMenuOpen = false;
                toggleMobileMenu();
            }
        });
    });
    
    // Close mobile menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && isMenuOpen) {
            isMenuOpen = false;
            toggleMobileMenu();
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
            isMenuOpen = false;
            toggleMobileMenu();
        }
    });
}

// ===== HERO STATS COUNTER ANIMATION =====
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    stats.forEach(stat => {
        observer.observe(stat);
    });
}

function animateCounter(element) {
    const target = parseFloat(element.textContent);
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60 FPS
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number based on original format
        if (element.textContent.includes('.')) {
            element.textContent = current.toFixed(1);
        } else if (element.textContent.includes('+')) {
            element.textContent = Math.floor(current) + '+';
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Initialize stats counter when page loads
document.addEventListener('DOMContentLoaded', initStatsCounter);

// ===== GALLERY IMAGE MODAL =====
function initGalleryModal() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Create modal for image viewing
            const modal = createImageModal(this);
            document.body.appendChild(modal);
            
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
        });
    });
}

function createImageModal(galleryItem) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="image-modal-content">
            <span class="image-modal-close">×</span>
            <div class="image-modal-placeholder">
                <i class="fas fa-image"></i>
                <p>Immagine non ancora caricata</p>
                <small>Seguici sui social per vedere le nostre foto!</small>
            </div>
        </div>
    `;
    
    // Styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // Close functionality
    const closeBtn = modal.querySelector('.image-modal-close');
    closeBtn.addEventListener('click', () => {
        modal.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        }, 300);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeBtn.click();
        }
    });
    
    return modal;
}

// Initialize gallery modal
document.addEventListener('DOMContentLoaded', initGalleryModal);

// ===== PERFORMANCE OPTIMIZATIONS =====
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You can implement error reporting here
});

// ===== ACCESSIBILITY IMPROVEMENTS =====
function initAccessibility() {
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open modals
            const openModals = document.querySelectorAll('.rating-modal.show, .image-modal');
            openModals.forEach(modal => {
                const closeBtn = modal.querySelector('[class*="close"]');
                if (closeBtn) closeBtn.click();
            });
        }
        
        if (e.key === 'Tab') {
            // Ensure focus is visible
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    // Remove keyboard navigation class on mouse use
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initAccessibility);

// ===== SOCIAL MEDIA INTEGRATION =====
function initSocialLinks() {
    const socialLinks = document.querySelectorAll('a[href*="instagram"], a[href*="facebook"]');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add analytics tracking here if needed
            console.log('Social media link clicked:', this.href);
        });
    });
}

// Initialize social links
document.addEventListener('DOMContentLoaded', initSocialLinks);

// ===== PHONE CALL TRACKING =====
function initPhoneTracking() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Track phone calls for analytics
            console.log('Phone call initiated');
            
            // Show call confirmation on desktop
            if (window.innerWidth > 768) {
                const confirmation = confirm('Stai per chiamare Sitica. Continuare?');
                if (!confirmation) {
                    e.preventDefault();
                }
            }
        });
    });
}

// Initialize phone tracking
document.addEventListener('DOMContentLoaded', initPhoneTracking);

// ===== LOADING STATES =====
function showLoading(element) {
    const original = element.innerHTML;
    element.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    element.disabled = true;
    
    return () => {
        element.innerHTML = original;
        element.disabled = false;
    };
}

// ===== UTILITY FUNCTIONS =====
function formatPhoneNumber(phone) {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 12) return 'mattina';
    if (hour < 18) return 'pomeriggio';
    return 'sera';
}

// ===== CONSOLE WELCOME MESSAGE =====
console.log(`
🌿 Benvenuto nel sito di SITICA Barrafranca! 🌿
Developed with ❤️ for the best Food & Drink Hub in Sicily

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Via Garibaldi 45, 94012 Barrafranca (EN)
📞 +39 347 123 4567
🌐 Instagram: @sitica_barrafranca
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Grazie per aver visitato il nostro sito!
`);

// ===== EXPORT FUNCTIONS (if using modules) =====
// Export main functions if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initRatingModal,
        initNavigation,
        initScrollEffects,
        initAnimations,
        showNotification
    };
}