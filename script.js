// ===== SITICA BARRAFRANCA - SCRIPT.JS =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initRatingModal();
    initNavigation();
    initScrollEffects();
    // initAnimations(); // <-- EFFETTO RIMOSSO
    initMobileMenu();
    initStatsCounter();
    initGalleryModal();
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
        // The link is already in the HTML, this just ensures it hides the modal
        hideModal();
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
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(this);

                // Close mobile menu if open
                const mobileNav = document.querySelector('.nav-links');
                if (mobileNav.classList.contains('show')) {
                    document.querySelector('.mobile-toggle').click();
                }
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
        
        let currentSectionId = null;
        sections.forEach(section => {
            if (section.offsetTop <= scrollPos && section.offsetTop + section.offsetHeight > scrollPos) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
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
        
        // Animate hamburger
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
    
    // Close mobile menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinks.classList.contains('show')) {
            navLinks.classList.remove('show');
            document.body.style.overflow = '';
            const spans = mobileToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = '';
                span.style.opacity = '';
            });
        }
    });
}


// ===== HERO STATS COUNTER ANIMATION =====
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => {
        observer.observe(stat);
    });
}

function animateCounter(element) {
    const target = parseFloat(element.dataset.target || element.textContent);
    const duration = 2000;
    let start = 0;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = target / steps;
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            start = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(start);
    }, stepTime);
}

// ===== GALLERY IMAGE MODAL =====
function initGalleryModal() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    let modal = null;

    function showImageModal(imgSrc, imgAlt) {
        // Create and append modal HTML
        modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="image-modal-content">
                <img src="${imgSrc}" alt="${imgAlt}">
            </div>
            <span class="image-modal-close">&times;</span>
        `;
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Animate in
        setTimeout(() => modal.classList.add('show'), 10);

        // Add close event listeners
        modal.querySelector('.image-modal-close').addEventListener('click', closeImageModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeImageModal();
            }
        });
    }

    function closeImageModal() {
        if (!modal) return;
        modal.classList.remove('show');
        document.body.style.overflow = '';
        setTimeout(() => {
            if (modal && document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
            modal = null;
        }, 300);
    }

    galleryItems.forEach(img => {
        img.addEventListener('click', function() {
            showImageModal(this.src, this.alt);
        });
    });

    // Close with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal) {
            closeImageModal();
        }
    });
}


// ===== ACCESSIBILITY IMPROVEMENTS =====
function initAccessibility() {
    // Add keyboard navigation support for focus
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    // Remove keyboard navigation class on mouse use
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
}

// ===== SOCIAL MEDIA INTEGRATION =====
function initSocialLinks() {
    const socialLinks = document.querySelectorAll('a[href*="instagram"], a[href*="facebook"]');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Social media link clicked:', this.href);
        });
    });
}

// ===== PHONE CALL TRACKING =====
function initPhoneTracking() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('Phone call initiated');
            
            // Show call confirmation on desktop
            if (window.innerWidth > 768) {
                if (!confirm('Stai per chiamare Sitica. Continuare?')) {
                    e.preventDefault();
                }
            }
        });
    });
}

// ===== NOTIFICATION FUNCTION =====
function showNotification(title, message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
        <button class="notification-close" aria-label="Chiudi notifica">&times;</button>
    `;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    const close = () => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 400);
    };

    // Close functionality
    notification.querySelector('.notification-close').addEventListener('click', close);
    
    // Auto close after 5 seconds
    setTimeout(close, 5000);
}

// ===== CONSOLE WELCOME MESSAGE =====
console.log(`
🌿 Benvenuto nel sito di SITICA Barrafranca! 🌿
Developed with ❤️ for the best Food & Drink Hub in Sicily

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Via Garibaldi 45, 94012 Barrafranca (EN)
📞 +39 333 596 9079
🌐 Instagram: @sitica_barrafranca
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Grazie per aver visitato il nostro sito!
`);