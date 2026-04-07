document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle logic
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.querySelector('.main-nav ul');
    const menuOverlay = document.getElementById('menuOverlay');
    
    function toggleMenu() {
        mainNav.classList.toggle('show');
        menuOverlay.classList.toggle('show');
        document.body.style.overflow = mainNav.classList.contains('show') ? 'hidden' : 'auto';
        mobileMenuBtn.innerHTML = mainNav.classList.contains('show') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMenu);
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', toggleMenu);
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                mainNav.classList.remove('show');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update URL without page reload
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Toggle remedy details with animation
    document.querySelectorAll('.view-button').forEach(button => {
        button.addEventListener('click', function() {
            const remedyItem = this.closest('.remedy-item');
            const icon = this.querySelector('i');
            
            remedyItem.classList.toggle('active');
            
            if (remedyItem.classList.contains('active')) {
                this.textContent = 'Hide Recipe ';
                icon.className = 'fas fa-chevron-up';
                
                // Scroll to show full expanded remedy
                setTimeout(() => {
                    remedyItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 300);
            } else {
                this.textContent = 'View Full Recipe ';
                icon.className = 'fas fa-chevron-down';
            }
        });
    });
    
    // Animate elements on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.category-card, .remedy-item, .tip-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animate');
            }
        });
    };
    
    // Initial check
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Tooltip for benefits
    tippy('.benefits span', {
        content: 'Ayurvedic benefit',
        placement: 'top',
        theme: 'ayurveda',
        arrow: true
    });
    
    // Back to top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'back-to-top';
    document.body.appendChild(backToTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Dynamic year for footer
    document.querySelector('.footer-bottom p').innerHTML = 
        document.querySelector('.footer-bottom p').innerHTML.replace('2025', new Date().getFullYear());
});

// Initialize tooltips if Tippy.js is loaded
if (typeof tippy === 'function') {
    tippy.setDefaultProps({
        theme: 'ayurveda',
        arrow: true,
        animation: 'scale'
    });
}