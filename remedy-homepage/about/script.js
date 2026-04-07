// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle logic
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.querySelector('.main-nav ul');
    const menuOverlay = document.getElementById('menuOverlay');
    
    function toggleMenu() {
        if (!mainNav || !mobileMenuBtn || !menuOverlay) return;
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
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('show')) {
                mainNav.classList.remove('show');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
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

    // Team member hover effect
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            this.querySelector('img').style.transform = 'scale(1.05)';
            this.querySelector('img').style.borderColor = 'var(--primary)';
        });
        
        member.addEventListener('mouseleave', function() {
            this.querySelector('img').style.transform = 'scale(1)';
            this.querySelector('img').style.borderColor = 'var(--primary-light)';
        });
    });
    
    // Animate sections on scroll
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.mission-section, .value-card, .team-member, .timeline-item, .testimonial-card').forEach(item => {
        observer.observe(item);
    });
    
    // Read More functionality
    const readMoreBtns = document.querySelectorAll('.read-more-btn');
    
    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const content = this.previousElementSibling;
            this.classList.toggle('expanded');
            content.classList.toggle('expanded');
            
            // Change button text
            this.textContent = this.classList.contains('expanded') ? 'Read Less' : 'Read More';
        });
    });
    // Realistic Motion with GSAP
document.addEventListener('DOMContentLoaded', () => {
    // Butterfly random path
    gsap.to(".butterfly", {
        duration: 20,
        x: "+=800",
        y: "+=200",
        rotation: 360,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
    });

    // Bird flying with physics
    gsap.to(".bird", {
        duration: 15,
        x: "+=1200",
        y: (i) => i % 2 === 0 ? "-=100" : "+=100",
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true
    });

    // Leaf floating with randomness
    gsap.to(".leaf", {
        duration: 25,
        x: "+=500",
        y: "+=300",
        rotation: 180,
        ease: "none",
        repeat: -1,
        yoyo: true
    });
});
});