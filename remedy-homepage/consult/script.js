document.addEventListener("DOMContentLoaded", () => {
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
    // DOM Elements
    const consultForm = document.getElementById("consultForm");
    const confirmationMessage = document.getElementById("confirmationMessage");
    const confirmationModal = document.getElementById("confirmationModal");
    const cancelBtn = document.getElementById("cancelBtn");
    const confirmBtn = document.getElementById("confirmBtn");
    const successModal = document.getElementById("successModal");
    const okBtn = document.getElementById("okBtn");
    
    // Store form data when user submits
    let formData = null;

    // Handle form submission
    consultForm.addEventListener("submit", function (e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Store form data
        formData = {
            name: this.name.value,
            email: this.email.value,
            phone: this.phone.value,
            concern: this.concern.value
        };
        
        // Show confirmation modal
        confirmationModal.classList.add("visible");
    });

    // Handle cancel button
    cancelBtn.addEventListener("click", () => {
        confirmationModal.classList.remove("visible");
    });

    // Handle confirm button
    confirmBtn.addEventListener("click", async () => {
        confirmationModal.classList.remove("visible");
        
        // Show loading state
        const submitBtn = consultForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Booking...";

        try {
            const response = await fetch('/api/consult/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            let result = {};
            try {
                result = await response.json();
            } catch (jsonErr) {
                console.warn('Could not parse JSON response:', jsonErr);
            }
            
            if (response.ok && result.success) {
                // Reset form
                consultForm.reset();
                
                // Show success modal
                successModal.classList.add("visible");
                
                // Hide the small confirmation message
                if (confirmationMessage) confirmationMessage.classList.add("hidden");
            } else {
                // Show error message
                if (confirmationMessage) {
                    confirmationMessage.textContent = result.error || "Failed to book appointment. Please try again.";
                    confirmationMessage.classList.remove("hidden");
                    setTimeout(() => {
                        confirmationMessage.classList.add("hidden");
                    }, 5000);
                } else {
                    alert(result.error || "Failed to book appointment.");
                }
            }
        } catch (err) {
            console.error('Error submitting form:', err);
            if (confirmationMessage) {
                confirmationMessage.textContent = "Network error or timeout. Please try again.";
                confirmationMessage.classList.remove("hidden");
                setTimeout(() => {
                    confirmationMessage.classList.add("hidden");
                }, 5000);
            }
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });

    // Handle OK button in success modal
    okBtn.addEventListener("click", () => {
        successModal.classList.remove("visible");
    });

    // Form validation
    function validateForm() {
        let isValid = true;
        
        // Clear previous errors
        document.querySelectorAll('.error').forEach(el => {
            el.style.display = 'none';
        });
        
        // Validate email
        const email = consultForm.email.value;
        const emailError = document.createElement('div');
        emailError.className = 'error';
        consultForm.email.parentNode.insertBefore(emailError, consultForm.email.nextSibling);
        
        if (!email) {
            emailError.textContent = 'Email is required';
            emailError.style.display = 'block';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailError.textContent = 'Please enter a valid email address';
            emailError.style.display = 'block';
            isValid = false;
        }
        
        // Validate phone
        const phone = consultForm.phone.value;
        const phoneError = document.createElement('div');
        phoneError.className = 'error';
        consultForm.phone.parentNode.insertBefore(phoneError, consultForm.phone.nextSibling);
        
        if (!phone) {
            phoneError.textContent = 'Phone number is required';
            phoneError.style.display = 'block';
            isValid = false;
        } else {
            // Remove all non-digit characters
            const digitsOnly = phone.replace(/\D/g, '');
            
            if (digitsOnly.length < 10) {
                phoneError.textContent = 'Phone number must be at least 10 digits';
                phoneError.style.display = 'block';
                isValid = false;
            } else if (!/^[0-9+]+$/.test(phone)) {
                phoneError.textContent = 'Please enter a valid phone number';
                phoneError.style.display = 'block';
                isValid = false;
            }
        }
        
        return isValid;
    }

    // Expert Data
    const experts = [
        {
            name: "Dr. Shivani Singh",
            image: "../../../images/shivani.jpg",
            expertise: "Ayurvedic Specialist | 15+ years experience"
        },
        {
            name: "Dr. Ujjwala Singh",
            image: "../../../images/ujjwala.jpg",
            expertise: "Panchakarma Therapist | 5+ years experience"
        },
        {
            name: "Dr. Shruti Agarwal",
            image: "../images/shruti.jpg",
            expertise: "Herbal Medicine Expert | 8+ years experience"
        }
    ];

    const expertContainer = document.getElementById("expertContainer");

    // Render Experts
    experts.forEach(expert => {
        const card = document.createElement("div");
        card.className = "expert-card animate-on-scroll";
        card.innerHTML = `
            <img src="${expert.image}" alt="${expert.name}">
            <h3>${expert.name}</h3>
            <p>${expert.expertise}</p>
        `;
        expertContainer.appendChild(card);
    });

    // Scroll Animation
    function animateOnScroll() {
        const cards = document.querySelectorAll('.animate-on-scroll');
        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            if (cardTop < window.innerHeight - 80) {
                card.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Trigger on load
});