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

    // Optimized Header Scroll Effect
    function handleScroll() {
        const header = document.querySelector('.main-header');
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            header.classList.add('scrolled');
            header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        } else {
            header.classList.remove('scrolled');
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    }

    // Throttled scroll event for better performance
    function throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        }
    }

    window.addEventListener('scroll', throttle(handleScroll, 200));

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Calculate scroll position accounting for header height
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (window.innerWidth <= 768 && mainNav.classList.contains('show')) {
                    mainNav.classList.remove('show');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
    
    // Seasonal Tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const season = this.getAttribute('data-season');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(season).classList.add('active');
        });
    });

    // Initialize first tab as active if none are active
    if (document.querySelectorAll('.tab-button.active').length === 0 && tabButtons.length > 0) {
        tabButtons[0].classList.add('active');
        const firstSeason = tabButtons[0].getAttribute('data-season');
        document.getElementById(firstSeason).classList.add('active');
    }

    // Download functionality for seasonal guides and resources
    document.querySelectorAll('.seasonal-button, .resource-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const fileName = this.getAttribute('data-download');
            if (fileName) {
                // Create a temporary link element for download
                const link = document.createElement('a');
                link.href = `downloads/${fileName}`; // Assumes files are in a downloads folder
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        });
    });
});