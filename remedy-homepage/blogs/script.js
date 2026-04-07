/**
 * Ayurveda Blogs - Main JavaScript File
 * Contains all interactive functionality for the blogs page
 */

document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // Mobile Navigation
    // ======================
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

    // ======================
    // Blog Card Animations
    // ======================
    const blogCards = document.querySelectorAll('.blog-card');
    
    blogCards.forEach((card, index) => {
        // Add staggered animation delay
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Add hover effect for touch devices
        card.addEventListener('touchstart', function() {
            this.classList.add('hover');
        });
        
        card.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('hover');
            }, 500);
        });
    });
    
    // ======================
    // Scroll Animations
    // ======================
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.featured-post, .blog-card, .section-title, .section-subtitle');
        const windowHeight = window.innerHeight;
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementPosition < windowHeight - elementVisible) {
                element.classList.add('animate');
            }
        });
    };
    
    // Run on initial load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // ======================
    // Pagination
    // ======================
   // ======================
// Pagination
// ======================
const POSTS_PER_PAGE = 3;
const TOTAL_PAGES = 8;
// blogCards is already declared above
const pageLinks = document.querySelectorAll('.page-link:not(.prev):not(.next)');
const prevButton = document.querySelector('.page-link.prev');
const nextButton = document.querySelector('.page-link.next');
let currentPage = 1;

// Function to update displayed posts
function updatePosts() {
    // Calculate start and end indices for posts
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;

    // Hide/show blog cards
    blogCards.forEach((card, index) => {
        if (index >= startIndex && index < endIndex) {
            card.classList.remove('hidden');
            card.classList.add('animate');
        } else {
            card.classList.add('hidden');
            card.classList.remove('animate');
        }
    });

    // Update active page link
    pageLinks.forEach(link => {
        link.classList.remove('active');
        if (parseInt(link.getAttribute('data-page')) === currentPage) {
            link.classList.add('active');
        }
    });

    // Update Previous/Next button states
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === TOTAL_PAGES;

    // Scroll to top of blog section
    document.querySelector('.blog-section').scrollIntoView({
        behavior: 'smooth'
    });
}

// Initial load
updatePosts();

// Handle page link clicks
pageLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        currentPage = parseInt(this.getAttribute('data-page'));
        updatePosts();
    });
});

// Handle Previous button
prevButton.addEventListener('click', function(e) {
    e.preventDefault();
    if (currentPage > 1) {
        currentPage--;
        updatePosts();
    }
});

// Handle Next button
nextButton.addEventListener('click', function(e) {
    e.preventDefault();
    if (currentPage < TOTAL_PAGES) {
        currentPage++;
        updatePosts();
    }
});
    
    // ======================
    // Newsletter Form
    // ======================
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('button');
            
            // Validate email
            if (!emailInput.value || !emailInput.value.includes('@')) {
                emailInput.style.border = '2px solid #ff6b6b';
                return;
            }
            
            // Disable button during submission
            submitBtn.disabled = true;
            submitBtn.textContent = 'Subscribing...';
            
            // Simulate API call
            setTimeout(() => {
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.className = 'newsletter-success';
                successMsg.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <p>Thank you for subscribing to our newsletter!</p>
                `;
                newsletterForm.parentNode.insertBefore(successMsg, newsletterForm.nextSibling);
                newsletterForm.style.display = 'none';
                
                // In a real implementation, you would handle the form submission here
                console.log('Submitted email:', emailInput.value);
            }, 1500);
        });
    }
    
    // ======================
    // Image Lazy Loading
    // ======================
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading is supported
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers without native lazy loading
        const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('loading');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            lazyLoadObserver.observe(img);
        });
    }
    
    // ======================
    // Blog Modal Functionality
    // ======================
    const blogModal = document.getElementById('blogModal');
    const modalContent = document.getElementById('modalContent');
    const closeModal = document.getElementById('closeModal');
    
    // Complete blog content for all 24 posts
    const blogContent = {
        "daily-routines": {
            title: "Daily Routines in Ayurveda: The Path to Balance",
            image: "images/featured-blog.png",
            content: `
                <img src="images/featured-blog.jpg" alt="Ayurvedic routine" class="modal-image">
                <h2>Daily Routines in Ayurveda: The Path to Balance</h2>
                <p>Dinacharya is a concept in Ayurvedic medicine that looks at the cycles of nature and bases daily activities around these cycles. According to Ayurveda, following a daily routine helps to establish balance and synchronize your body with nature's rhythms.</p>
                
                <h3>Morning Routine (5-8 AM)</h3>
                <p>Wake up before sunrise, ideally during the Brahma muhurta (around 5 AM). This is considered the most auspicious time for spiritual practices and meditation.</p>
                <ul>
                    <li>Drink a glass of warm water to stimulate digestion</li>
                    <li>Clean your tongue with a tongue scraper</li>
                    <li>Practice oil pulling with sesame or coconut oil</li>
                    <li>Perform self-massage (Abhyanga) with warm oil</li>
                    <li>Take a warm bath or shower</li>
                    <li>Practice yoga, pranayama, and meditation</li>
                </ul>
                
                <h3>Midday Routine (12-2 PM)</h3>
                <p>This is when the sun is at its peak, and Pitta dosha is dominant - the best time for your main meal when digestive fire (Agni) is strongest.</p>
                <ul>
                    <li>Eat your largest meal of the day</li>
                    <li>Include all six tastes (sweet, sour, salty, bitter, pungent, astringent)</li>
                    <li>Eat in a calm environment without distractions</li>
                    <li>Rest for 10-15 minutes after eating (but don't sleep)</li>
                </ul>
                
                <h3>Evening Routine (6-10 PM)</h3>
                <p>As the sun sets, Vata energy increases, signaling the body to wind down.</p>
                <ul>
                    <li>Eat a light dinner before sunset or by 7 PM</li>
                    <li>Take a gentle walk after dinner</li>
                    <li>Practice calming activities like reading or light stretching</li>
                    <li>Go to bed by 10 PM during Kapha time for deep, restful sleep</li>
                </ul>
                
                <p>Following this daily routine consistently can help prevent disease, promote longevity, and maintain optimal health according to Ayurvedic principles.</p>
            `
        },
        "seasonal-eating": {
            title: "Eating With the Seasons: An Ayurvedic Guide",
            image: "images/seasonal-eating.png",
            content: `
                <img src="images/seasonal-eating.png" alt="Seasonal eating" class="modal-image">
                <h2>Eating With the Seasons: An Ayurvedic Guide</h2>
                <p>Ayurveda teaches that our diet should change with the seasons to maintain balance with nature. Each season has dominant doshic qualities that we can counter with appropriate foods.</p>
                
                <h3>Spring (Kapha Season)</h3>
                <p>As winter ends, heavy, moist Kapha accumulates in the body. Spring is the time to lighten up with foods that are warm, dry, and pungent.</p>
                <ul>
                    <li>Favor bitter greens like kale, dandelion, and arugula</li>
                    <li>Include pungent spices like ginger, black pepper, and turmeric</li>
                    <li>Eat light grains like quinoa and barley</li>
                    <li>Reduce dairy, sweets, and fried foods</li>
                </ul>
                
                <h3>Summer (Pitta Season)</h3>
                <p>The heat of summer increases Pitta dosha. Cooling, sweet, and hydrating foods help maintain balance.</p>
                <ul>
                    <li>Enjoy sweet fruits like melons, grapes, and pears</li>
                    <li>Include coconut, cucumber, and leafy greens</li>
                    <li>Use cooling spices like fennel, coriander, and mint</li>
                    <li>Reduce spicy, sour, and salty foods</li>
                </ul>
                
                <h3>Fall (Vata Season)</h3>
                <p>As the weather becomes dry and windy, Vata increases. Warm, moist, grounding foods are ideal.</p>
                <ul>
                    <li>Favor cooked foods over raw</li>
                    <li>Include healthy fats like ghee and olive oil</li>
                    <li>Eat root vegetables and squashes</li>
                    <li>Use warming spices like cinnamon, cardamom, and cumin</li>
                </ul>
                
                <h3>Winter (Vata-Kapha Season)</h3>
                <p>The cold and heaviness of winter requires nourishing but not overly heavy foods.</p>
                <ul>
                    <li>Eat warm, cooked meals</li>
                    <li>Include nuts, seeds, and dairy in moderation</li>
                    <li>Use ginger and garlic to maintain digestion</li>
                    <li>Drink warm herbal teas</li>
                </ul>
                
                <p>By adjusting your diet with the seasons, you can maintain doshic balance and optimal health throughout the year.</p>
            `
        },
        "ayurvedic-herbs": {
            title: "Top 5 Ayurvedic Herbs for Everyday Wellness",
            image: "images/herbal-remedies.png",
            content: `
                <img src="images/herbal-remedies.png" alt="Ayurvedic herbs" class="modal-image">
                <h2>Top 5 Ayurvedic Herbs for Everyday Wellness</h2>
                <p>Ayurveda offers a rich pharmacopeia of herbs that can support health and prevent disease. Here are five of the most versatile Ayurvedic herbs that everyone should know about.</p>
                
                <h3>1. Ashwagandha (Withania somnifera)</h3>
                <p>Known as Indian ginseng, ashwagandha is a powerful adaptogen that helps the body manage stress. Benefits include:</p>
                <ul>
                    <li>Reduces stress and anxiety</li>
                    <li>Improves energy and stamina</li>
                    <li>Supports immune function</li>
                    <li>Enhances sleep quality</li>
                </ul>
                <p><strong>How to use:</strong> Take 300-500mg of root extract daily, or drink as tea.</p>
                
                <h3>2. Turmeric (Curcuma longa)</h3>
                <p>This golden spice is renowned for its anti-inflammatory properties. Benefits include:</p>
                <ul>
                    <li>Reduces inflammation</li>
                    <li>Supports joint health</li>
                    <li>Boosts immunity</li>
                    <li>Aids digestion</li>
                </ul>
                <p><strong>How to use:</strong> Add to food with black pepper to enhance absorption, or take as a supplement.</p>
                
                <h3>3. Triphala</h3>
                <p>A combination of three fruits (amalaki, bibhitaki, haritaki), triphala is a gentle digestive tonic. Benefits include:</p>
                <ul>
                    <li>Supports healthy digestion</li>
                    <li>Gentle detoxification</li>
                    <li>Rich in antioxidants</li>
                    <li>Promotes regular elimination</li>
                </ul>
                <p><strong>How to use:</strong> Take 1-2 teaspoons at bedtime with warm water.</p>
                
                <h3>4. Brahmi (Bacopa monnieri)</h3>
                <p>Known as the brain tonic, brahmi enhances cognitive function. Benefits include:</p>
                <ul>
                    <li>Improves memory and concentration</li>
                    <li>Reduces anxiety</li>
                    <li>Supports nervous system</li>
                    <li>May help with ADHD symptoms</li>
                </ul>
                <p><strong>How to use:</strong> Take 300mg extract daily, or drink as tea.</p>
                
                <h3>5. Tulsi (Holy Basil)</h3>
                <p>Considered sacred in India, tulsi is an adaptogenic herb with multiple benefits:</p>
                <ul>
                    <li>Boosts immunity</li>
                    <li>Reduces stress</li>
                    <li>Supports respiratory health</li>
                    <li>Balances blood sugar</li>
                </ul>
                <p><strong>How to use:</strong> Drink as tea (2-3 cups daily) or take as extract.</p>
                
                <p>These herbs can be powerful allies for maintaining health when used appropriately. Consult an Ayurvedic practitioner for personalized recommendations.</p>
            `
        },
        "yoga-dosha": {
            title: "Yoga Asanas for Your Dosha Type",
            image: "images/yoga-ayurveda.png",
            content: `
                <img src="images/yoga-ayurveda.png" alt="Yoga and Ayurveda" class="modal-image">
                <h2>Yoga Asanas for Your Dosha Type</h2>
                <p>Combining yoga with Ayurveda creates a powerful synergy for health. Here are recommended yoga practices for each dosha type to maintain balance.</p>
                
                <h3>Vata-Pacifying Yoga</h3>
                <p>Vata types benefit from grounding, calming practices that reduce anxiety and improve stability.</p>
                <ul>
                    <li><strong>Standing poses:</strong> Mountain, Tree, Warrior I & II</li>
                    <li><strong>Seated poses:</strong> Bound Angle, Seated Forward Bend</li>
                    <li><strong>Restorative poses:</strong> Child's Pose, Legs-Up-the-Wall</li>
                    <li><strong>Breathwork:</strong> Nadi Shodhana (alternate nostril breathing)</li>
                </ul>
                <p>Practice should be slow, steady, and warming. Hold poses longer to cultivate stillness.</p>
                
                <h3>Pitta-Pacifying Yoga</h3>
                <p>Pitta types benefit from cooling, moderate practices that release excess heat and intensity.</p>
                <ul>
                    <li><strong>Forward bends:</strong> Standing Forward Bend, Seated Forward Bend</li>
                    <li><strong>Twists:</strong> Seated Twist, Supine Twist</li>
                    <li><strong>Inversions:</strong> Shoulder Stand, Plow Pose</li>
                    <li><strong>Breathwork:</strong> Sheetali (cooling breath)</li>
                </ul>
                <p>Avoid excessive heat and competition. Focus on surrender rather than perfection.</p>
                
                <h3>Kapha-Pacifying Yoga</h3>
                <p>Kapha types benefit from energizing, warming practices that stimulate circulation.</p>
                <ul>
                    <li><strong>Backbends:</strong> Cobra, Bow, Bridge</li>
                    <li><strong>Sun Salutations:</strong> Dynamic sequences to build heat</li>
                    <li><strong>Balancing poses:</strong> Eagle, Dancer, Warrior III</li>
                    <li><strong>Breathwork:</strong> Kapalabhati (skull shining breath)</li>
                </ul>
                <p>Practice should be vigorous and warming. Move quickly between poses.</p>
                
                <h3>General Guidelines</h3>
                <ul>
                    <li>Practice at the appropriate time of day for your dosha</li>
                    <li>Modify your practice with seasonal changes</li>
                    <li>Listen to your body's needs each day</li>
                    <li>Always include relaxation at the end</li>
                </ul>
                
                <p>By tailoring your yoga practice to your dosha, you can achieve greater balance and enhance the benefits of both yoga and Ayurveda.</p>
            `
        },
        "digestive-health": {
            title: "Ayurvedic Principles for Optimal Digestion",
            image: "images/digestive-health.png",
            content: `
                <img src="images/digestive-health.png" alt="Ayurvedic digestive aids" class="modal-image">
                <h2>Ayurvedic Principles for Optimal Digestion</h2>
                <p>In Ayurveda, strong digestion (Agni) is considered the cornerstone of good health. When your digestive fire is balanced, you extract maximum nutrients from food and eliminate waste efficiently.</p>
                
                <h3>Signs of Balanced Agni</h3>
                <ul>
                    <li>Regular appetite and thirst</li>
                    <li>Comfortable digestion without bloating or discomfort</li>
                    <li>Regular bowel movements (1-2 times daily)</li>
                    <li>Consistent energy levels after meals</li>
                    <li>Clear complexion and bright eyes</li>
                </ul>
                
                <h3>Types of Digestive Imbalances</h3>
                <p>Ayurveda identifies four main types of digestive disturbances:</p>
                <ul>
                    <li><strong>Vishama Agni (Irregular):</strong> Characteristic of Vata imbalance - alternating strong and weak digestion</li>
                    <li><strong>Tikshna Agni (Sharp):</strong> Pitta imbalance - hyperacidity, heartburn</li>
                    <li><strong>Manda Agni (Slow):</strong> Kapha imbalance - sluggish digestion, heaviness</li>
                    <li><strong>Sama Agni (Balanced):</strong> Ideal state of digestion</li>
                </ul>
                
                <h3>Tips to Improve Digestion</h3>
                <ul>
                    <li>Eat your largest meal at midday when digestive fire is strongest</li>
                    <li>Chew food thoroughly (at least 20 times per bite)</li>
                    <li>Drink ginger tea before meals to stimulate Agni</li>
                    <li>Avoid cold drinks with meals as they dampen digestive fire</li>
                    <li>Take a short walk after meals to aid digestion</li>
                    <li>Practice mindful eating without distractions</li>
                </ul>
                
                <p>By understanding and applying these Ayurvedic principles, you can transform your digestive health and overall wellbeing.</p>
            `
        },
        "food-combining": {
            title: "The Art of Food Combining in Ayurveda",
            image: "images/food-combining.png",
            content: `
                <img src="images/food-combining.png" alt="Proper food combinations" class="modal-image">
                <h2>The Art of Food Combining in Ayurveda</h2>
                <p>Ayurveda places great emphasis on proper food combining to ensure optimal digestion and prevent the formation of toxins (ama). Certain food combinations can overwhelm the digestive system and lead to fermentation, gas, and bloating.</p>
                
                <h3>Basic Principles of Food Combining</h3>
                <ul>
                    <li>Eat fruits alone, especially melons which should never be combined with other foods</li>
                    <li>Avoid combining milk with sour fruits, fish, meat, or yeast-containing bread</li>
                    <li>Don't mix raw and cooked foods in the same meal</li>
                    <li>Avoid combining dairy with protein-rich foods</li>
                    <li>Don't eat cold foods with hot foods</li>
                </ul>
                
                <h3>Best Combinations</h3>
                <ul>
                    <li>Grains + Vegetables (most compatible combination)</li>
                    <li>Beans + Vegetables</li>
                    <li>Dairy + Grains (like milk with rice or oatmeal)</li>
                    <li>Nuts/seeds + Dairy or Grains</li>
                </ul>
                
                <h3>Worst Combinations</h3>
                <ul>
                    <li>Milk + Bananas (can be toxic for some)</li>
                    <li>Fruit + Yogurt (creates fermentation)</li>
                    <li>Beans + Cheese (hard to digest)</li>
                    <li>Eggs + Milk (incompatible proteins)</li>
                    <li>Fish + Dairy (can be toxic)</li>
                </ul>
                
                <h3>Dosha-Specific Considerations</h3>
                <p><strong>Vata:</strong> Should be most careful with food combining as their digestion is most sensitive<br>
                <strong>Pitta:</strong> Can handle more combinations but should avoid sour combinations<br>
                <strong>Kapha:</strong> Should avoid combining sweet with sour</p>
                
                <p>Following these Ayurvedic food combining principles can dramatically improve your digestion and overall health.</p>
            `
        },
        "immunity-boosters": {
            title: "Ayurvedic Immunity Boosters for All Seasons",
            image: "images/immunity-boosters.png",
            content: `
                <img src="images/immunity-boosters.png" alt="Immunity boosting herbs" class="modal-image">
                <h2>Ayurvedic Immunity Boosters for All Seasons</h2>
                <p>Ayurveda offers numerous natural ways to strengthen your immune system and protect against seasonal illnesses. These remedies work by balancing your doshas and enhancing your body's natural defense mechanisms.</p>
                
                <h3>Top Ayurvedic Immunity Boosters</h3>
                <ul>
                    <li><strong>Chyawanprash:</strong> A rejuvenating herbal jam with amla as the main ingredient</li>
                    <li><strong>Golden Milk:</strong> Turmeric, ginger, and black pepper in warm milk</li>
                    <li><strong>Tulsi Tea:</strong> Holy basil leaves steeped in hot water</li>
                    <li><strong>Ginger-Honey:</strong> Fresh ginger juice mixed with raw honey</li>
                    <li><strong>Guduchi (Giloy):</strong> Known as the "divine nectar" for immunity</li>
                </ul>
                
                <h3>Seasonal Immunity Practices</h3>
                <p><strong>Spring:</strong> Focus on detoxification with bitter herbs<br>
                <strong>Summer:</strong> Stay hydrated with cooling herbs like coriander and mint<br>
                <strong>Fall:</strong> Build resilience with warming spices like ginger and cinnamon<br>
                <strong>Winter:</strong> Nourish deeply with herbs like ashwagandha and shatavari</p>
                
                <h3>Daily Habits for Strong Immunity</h3>
                <ul>
                    <li>Wake up before sunrise and maintain a regular routine</li>
                    <li>Practice oil pulling with sesame or coconut oil</li>
                    <li>Do moderate exercise daily (like yoga or walking)</li>
                    <li>Get adequate, quality sleep</li>
                    <li>Manage stress through meditation and pranayama</li>
                </ul>
                
                <p>By incorporating these Ayurvedic immunity boosters into your daily life, you can maintain robust health throughout the year.</p>
            `
        },
        "turmeric-benefits": {
            title: "The Healing Power of Turmeric in Ayurveda",
            image: "images/turmeric-benefits.png",
            content: `
                <img src="images/turmeric-benefits.png" alt="Turmeric root and powder" class="modal-image">
                <h2>The Healing Power of Turmeric in Ayurveda</h2>
                <p>Turmeric (Haridra in Sanskrit) has been used in Ayurveda for thousands of years as a medicine, beauty aid, and culinary spice. Its active compound curcumin gives it powerful healing properties.</p>
                
                <h3>Key Benefits of Turmeric</h3>
                <ul>
                    <li><strong>Anti-inflammatory:</strong> Helps with joint pain and arthritis</li>
                    <li><strong>Antioxidant:</strong> Protects cells from free radical damage</li>
                    <li><strong>Digestive:</strong> Stimulates bile production and improves digestion</li>
                    <li><strong>Detoxifying:</strong> Supports liver function and blood purification</li>
                    <li><strong>Skin health:</strong> Promotes glowing skin and wound healing</li>
                </ul>
                
                <h3>Dosha-Specific Uses</h3>
                <p><strong>Vata:</strong> Use with ghee and warming spices like ginger<br>
                <strong>Pitta:</strong> Use in moderation with cooling herbs like coriander<br>
                <strong>Kapha:</strong> Use with honey and pungent spices like black pepper</p>
                
                <h3>Best Ways to Consume Turmeric</h3>
                <ul>
                    <li><strong>Golden Milk:</strong> Turmeric with warm milk, ghee, and honey</li>
                    <li><strong>Turmeric Tea:</strong> Boiled with ginger and lemon</li>
                    <li><strong>With Healthy Fats:</strong> Always combine with oil or ghee for better absorption</li>
                    <li><strong>With Black Pepper:</strong> Piperine enhances curcumin absorption by 2000%</li>
                </ul>
                
                <h3>External Uses</h3>
                <ul>
                    <li><strong>Face mask:</strong> Mix with honey for glowing skin</li>
                    <li><strong>Wound healer:</strong> Apply paste on minor cuts and burns</li>
                    <li><strong>Anti-itch:</strong> Mix with coconut oil for insect bites</li>
                    <li><strong>Oral health:</strong> Use as tooth powder with salt</li>
                </ul>
                
                <p>Turmeric is truly a wonder herb that can benefit nearly every system in the body when used properly according to Ayurvedic principles.</p>
            `
        },
        "pranayama-techniques": {
            title: "Pranayama Techniques for Dosha Balance",
            image: "images/pranayama.png",
            content: `
                <img src="images/pranayama.png" alt="Pranayama practice" class="modal-image">
                <h2>Pranayama Techniques for Dosha Balance</h2>
                <p>Pranayama, the yogic practice of breath control, is a powerful tool in Ayurveda for balancing the doshas and promoting overall wellbeing. Different techniques have specific effects on Vata, Pitta, and Kapha.</p>
                
                <h3>Vata-Balancing Pranayama</h3>
                <p>Vata types benefit from grounding, calming breath practices:</p>
                <ul>
                    <li><strong>Nadi Shodhana (Alternate Nostril Breathing):</strong> Calms the nervous system</li>
                    <li><strong>Ujjayi (Victorious Breath):</strong> Creates warmth and stability</li>
                    <li><strong>Bhramari (Bee Breath):</strong> Reduces anxiety and insomnia</li>
                </ul>
                <p>Practice slowly and gently, focusing on smooth transitions between breaths.</p>
                
                <h3>Pitta-Balancing Pranayama</h3>
                <p>Pitta types benefit from cooling, relaxing techniques:</p>
                <ul>
                    <li><strong>Sheetali (Cooling Breath):</strong> Inhale through rolled tongue, exhale through nose</li>
                    <li><strong>Sheetkari (Hissing Breath):</strong> Inhale through clenched teeth, exhale through nose</li>
                    <li><strong>Chandra Bhedana (Left Nostril Breathing):</strong> Activates cooling lunar energy</li>
                </ul>
                <p>Practice during cooler parts of the day, focusing on long exhalations.</p>
                
                <h3>Kapha-Balancing Pranayama</h3>
                <p>Kapha types benefit from energizing, stimulating practices:</p>
                <ul>
                    <li><strong>Kapalabhati (Skull Shining Breath):</strong> Rapid exhalations to build heat</li>
                    <li><strong>Bhastrika (Bellows Breath):</strong> Forceful inhales and exhales</li>
                    <li><strong>Surya Bhedana (Right Nostril Breathing):</strong> Activates warming solar energy</li>
                </ul>
                <p>Practice in the morning, with emphasis on strong, vigorous breathing.</p>
                
                <h3>General Pranayama Guidelines</h3>
                <ul>
                    <li>Practice on an empty stomach, ideally in the morning</li>
                    <li>Maintain proper posture with spine erect</li>
                    <li>Start with 3-5 rounds and gradually increase</li>
                    <li>Never strain or force the breath</li>
                    <li>End with a few minutes of quiet observation</li>
                </ul>
                
                <p>Regular pranayama practice tailored to your dosha can bring profound benefits to both physical and mental health.</p>
            `
        },
        "yoga-nidra": {
            title: "Yoga Nidra for Deep Relaxation",
            image: "images/yoga-nidra.png",
            content: `
                <img src="images/yoga-nidra.png" alt="Yoga nidra practice" class="modal-image">
                <h2>Yoga Nidra for Deep Relaxation</h2>
                <p>Yoga Nidra, often called "yogic sleep," is a powerful meditation technique that induces complete physical, mental, and emotional relaxation while maintaining full consciousness.</p>
                
                <h3>Benefits of Yoga Nidra</h3>
                <ul>
                    <li>Reduces stress and anxiety more effectively than regular sleep</li>
                    <li>Helps release deep-seated emotional patterns</li>
                    <li>Improves sleep quality and combats insomnia</li>
                    <li>Enhances creativity and problem-solving abilities</li>
                    <li>Boosts the immune system and promotes healing</li>
                </ul>
                
                <h3>How to Practice Yoga Nidra</h3>
                <ol>
                    <li>Lie in Savasana (corpse pose) with comfortable support</li>
                    <li>Set a positive intention (Sankalpa)</li>
                    <li>Follow a guided rotation of consciousness through the body</li>
                    <li>Practice breath awareness and opposite sensations</li>
                    <li>Visualize peaceful images or scenarios</li>
                    <li>Repeat your Sankalpa</li>
                    <li>Gently return to full awareness</li>
                </ol>
                
                <h3>Dosha-Specific Recommendations</h3>
                <p><strong>Vata:</strong> Practice with a weighted blanket for grounding<br>
                <strong>Pitta:</strong> Focus on cooling visualizations like moonlight<br>
                <strong>Kapha:</strong> Keep the session slightly shorter to prevent lethargy</p>
                
                <h3>Best Times to Practice</h3>
                <ul>
                    <li>Early morning upon waking</li>
                    <li>Midday for a energy reset</li>
                    <li>Before bedtime to promote deep sleep</li>
                    <li>During times of stress or emotional turmoil</li>
                </ul>
                
                <p>Even 20 minutes of Yoga Nidra can provide the restorative benefits of several hours of sleep, making it an invaluable practice in our fast-paced modern lives.</p>
            `
        },
        "morning-routine": {
            title: "Perfecting Your Ayurvedic Morning Routine",
            image: "images/morning-routine.png",
            content: `
                <img src="images/morning-routine.png" alt="Ayurvedic morning routine" class="modal-image">
                <h2>Perfecting Your Ayurvedic Morning Routine</h2>
                <p>An Ayurvedic morning routine, when practiced consistently, can set the tone for a balanced, productive, and harmonious day. Here's how to create an ideal routine based on your dosha.</p>
                
                <h3>Core Elements of an Ayurvedic Morning</h3>
                <ul>
                    <li><strong>Wake before sunrise:</strong> Ideally during Brahma Muhurta (1.5 hours before sunrise)</li>
                    <li><strong>Cleanse:</strong> Eliminate bowels, scrape tongue, brush teeth</li>
                    <li><strong>Hydrate:</strong> Drink warm water with lemon or herbal tea</li>
                    <li><strong>Self-massage (Abhyanga):</strong> With dosha-specific oils</li>
                    <li><strong>Movement:</strong> Yoga, stretching, or gentle exercise</li>
                    <li><strong>Meditation:</strong> At least 10-15 minutes of quiet reflection</li>
                </ul>
                
                <h3>Vata-Pacifying Morning Routine</h3>
                <p>Vata types need grounding and warmth:</p>
                <ul>
                    <li>Wake slowly without alarms if possible</li>
                    <li>Warm sesame oil massage</li>
                    <li>Gentle, grounding yoga poses</li>
                    <li>Warm, nourishing breakfast</li>
                    <li>Keep the morning calm and unrushed</li>
                </ul>
                
                <h3>Pitta-Pacifying Morning Routine</h3>
                <p>Pitta types benefit from cooling and moderation:</p>
                <ul>
                    <li>Wake before sunrise to avoid heat</li>
                    <li>Cooling coconut oil massage</li>
                    <li>Moderate, non-competitive yoga</li>
                    <li>Cooling breakfast with sweet fruits</li>
                    <li>Avoid checking emails first thing</li>
                </ul>
                
                <h3>Kapha-Pacifying Morning Routine</h3>
                <p>Kapha types need stimulation and warmth:</p>
                <ul>
                    <li>Wake early (by 6 AM at latest)</li>
                    <li>Vigorous dry brushing or mustard oil massage</li>
                    <li>Energetic yoga or exercise</li>
                    <li>Light, spicy breakfast</li>
                    <li>Avoid heavy foods first thing</li>
                </ul>
                
                <p>By tailoring your morning routine to your dosha, you can start each day aligned with your natural rhythms and needs.</p>
            `
        },
        "night-routine": {
            title: "Ayurvedic Night Routine for Better Sleep",
            image: "images/night-routine.png",
            content: `
                <img src="images/night-routine.png" alt="Relaxing night routine" class="modal-image">
                <h2>Ayurvedic Night Routine for Better Sleep</h2>
                <p>An Ayurvedic evening routine helps transition from the active day to restful night, promoting deep sleep and rejuvenation. Here's how to create your ideal wind-down ritual.</p>
                
                <h3>Key Elements of an Ayurvedic Night Routine</h3>
                <ul>
                    <li><strong>Early, light dinner:</strong> Finish by 7 PM or at least 3 hours before bed</li>
                    <li><strong>Digital detox:</strong> Turn off screens 1-2 hours before bed</li>
                    <li><strong>Gentle movement:</strong> Slow walking or restorative yoga</li>
                    <li><strong>Warm oil massage:</strong> Especially on feet and scalp</li>
                    <li><strong>Herbal tea:</strong> Chamomile, ashwagandha, or nutmeg milk</li>
                    <li><strong>Relaxing activities:</strong> Reading, journaling, soft music</li>
                    <li><strong>Early bedtime:</strong> By 10 PM during Kapha time</li>
                </ul>
                
                <h3>Dosha-Specific Night Routines</h3>
                <p><strong>Vata:</strong> Needs extra warmth and grounding<br>
                - Warm oil massage with sesame oil<br>
                - Heavy blanket and warm socks in bed<br>
                - Soothing sounds like white noise or gentle rain</p>
                
                <p><strong>Pitta:</strong> Needs cooling and release of mental activity<br>
                - Cooling coconut oil massage<br>
                - Moonlight meditation or cooling breath<br>
                - Keep bedroom slightly cool</p>
                
                <p><strong>Kapha:</strong> Needs light stimulation to prevent lethargy<br>
                - Light massage with mustard oil<br>
                - More vigorous evening walk<br>
                - Lighter dinner with pungent spices</p>
                
                <h3>Ayurvedic Sleep Tips</h3>
                <ul>
                    <li>Sleep on your left side to promote right-nostril breathing (cooling)</li>
                    <li>Use silk or satin pillowcases to reduce friction</li>
                    <li>Keep the bedroom completely dark</li>
                    <li>Maintain consistent sleep and wake times</li>
                    <li>Practice gratitude or loving-kindness meditation before sleep</li>
                </ul>
                
                <p>A proper Ayurvedic night routine can transform your sleep quality and overall health over time.</p>
            `
        },
        "abhyanga": {
            title: "The Benefits of Abhyanga (Self-Massage)",
            image: "images/abhyanga.png",
            content: `
                <img src="images/abhyanga.png" alt="Abhyanga self-massage" class="modal-image">
                <h2>The Benefits of Abhyanga (Self-Massage)</h2>
                <p>Abhyanga, the Ayurvedic practice of self-massage with warm oil, is one of the most cherished daily routines in Ayurveda. It nourishes the body, calms the mind, and promotes longevity.</p>
                
                <h3>Benefits of Regular Abhyanga</h3>
                <ul>
                    <li>Lubricates joints and improves flexibility</li>
                    <li>Nourishes and rejuvenates all body tissues</li>
                    <li>Calms the nervous system and reduces stress</li>
                    <li>Improves circulation and lymphatic drainage</li>
                    <li>Enhances skin health and natural glow</li>
                    <li>Promotes better sleep and overall wellbeing</li>
                </ul>
                
                <h3>How to Practice Abhyanga</h3>
                <ol>
                    <li>Choose an oil appropriate for your dosha (sesame for Vata, coconut for Pitta, mustard for Kapha)</li>
                    <li>Warm the oil slightly (test on wrist first)</li>
                    <li>Start massaging from head to toes using long strokes on limbs and circular motions on joints</li>
                    <li>Pay special attention to ears, feet, and any areas of tension</li>
                    <li>Allow oil to absorb for 10-20 minutes before bathing</li>
                    <li>Use warm (not hot) water for bathing</li>
                </ol>
                
                <h3>Dosha-Specific Recommendations</h3>
                <p><strong>Vata:</strong> Use warm sesame oil with calming essential oils like lavender<br>
                <strong>Pitta:</strong> Use cooling coconut oil with soothing oils like sandalwood<br>
                <strong>Kapha:</strong> Use warming mustard oil with stimulating oils like eucalyptus</p>
                
                <h3>Special Abhyanga Techniques</h3>
                <ul>
                    <li><strong>Marma point massage:</strong> Gentle pressure on vital energy points</li>
                    <li><strong>Foot massage:</strong> Especially beneficial before bed</li>
                    <li><strong>Scalp massage:</strong> Promotes hair health and relaxation</li>
                    <li><strong>Abdominal massage:</strong> Supports digestion in clockwise circles</li>
                </ul>
                
                <p>Even 5-10 minutes of daily Abhyanga can provide profound benefits. It's one of the most loving things you can do for your body and mind.</p>
            `
        },
        "meditation-techniques": {
            title: "Ayurvedic Meditation Techniques",
            image: "images/meditation.png",
            content: `
                <img src="images/meditation.png" alt="Meditation practice" class="modal-image">
                <h2>Ayurvedic Meditation Techniques</h2>
                <p>Ayurveda recommends specific meditation practices based on your dominant dosha to help balance your constitution and promote optimal mental health.</p>
                
                <h3>Vata-Balancing Meditation</h3>
                <p>Vata types need grounding, stabilizing practices:</p>
                <ul>
                    <li><strong>Mantra Meditation:</strong> Repetition of calming sounds like "Om" or "Sham"</li>
                    <li><strong>Walking Meditation:</strong> Mindful walking in nature</li>
                    <li><strong>Body Scan:</strong> Progressive relaxation from toes to head</li>
                    <li><strong>Visualization:</strong> Imagining roots growing from your body into the earth</li>
                </ul>
                <p>Practice in a warm, comfortable space with minimal distractions.</p>
                
                <h3>Pitta-Balancing Meditation</h3>
                <p>Pitta types benefit from cooling, surrendering practices:</p>
                <ul>
                    <li><strong>Moon Meditation:</strong> Visualizing cooling moonlight</li>
                    <li><strong>Loving-Kindness:</strong> Sending goodwill to self and others</li>
                    <li><strong>Water Visualization:</strong> Imagining flowing streams or lakes</li>
                    <li><strong>Breath Awareness:</strong> Focusing on smooth, even breathing</li>
                </ul>
                <p>Practice during cooler times of day, avoiding intense focus.</p>
                
                <h3>Kapha-Balancing Meditation</h3>
                <p>Kapha types need energizing, uplifting practices:</p>
                <ul>
                    <li><strong>Sun Meditation:</strong> Visualizing bright sunlight</li>
                    <li><strong>Movement Meditation:</strong> Gentle yoga with breath awareness</li>
                    <li><strong>Uplifting Mantras:</strong> Like "Ram" or "Hrim"</li>
                    <li><strong>Standing Meditation:</strong> With arms raised slightly</li>
                </ul>
                <p>Practice in the morning, keeping sessions dynamic.</p>
                
                <h3>General Meditation Tips</h3>
                <ul>
                    <li>Start with just 5-10 minutes daily</li>
                    <li>Be consistent with time and place</li>
                    <li>Use a comfortable seated position</li>
                    <li>Don't judge wandering thoughts - gently return to focus</li>
                    <li>End with a moment of gratitude</li>
                </ul>
                
                <p>Regular meditation tailored to your dosha can bring profound peace, clarity, and emotional balance.</p>
            `
        },
        "stress-management": {
            title: "Ayurvedic Approaches to Stress Management",
            image: "images/stress-management.png",
            content: `
                <img src="images/stress-management.png" alt="Stress management techniques" class="modal-image">
                <h2>Ayurvedic Approaches to Stress Management</h2>
                <p>Ayurveda offers a comprehensive approach to managing stress by addressing its root causes and rebalancing the mind-body system through lifestyle, diet, and herbal support.</p>
                
                <h3>Understanding Stress Through the Doshas</h3>
                <p><strong>Vata Stress:</strong> Anxiety, insomnia, racing thoughts<br>
                <strong>Pitta Stress:</strong> Anger, frustration, perfectionism<br>
                <strong>Kapha Stress:</strong> Lethargy, depression, avoidance</p>
                
                <h3>Dietary Approaches</h3>
                <ul>
                    <li><strong>Vata:</strong> Warm, nourishing foods; avoid caffeine</li>
                    <li><strong>Pitta:</strong> Cooling, sweet foods; avoid spicy and sour</li>
                    <li><strong>Kapha:</strong> Light, warm foods; avoid heavy dairy</li>
                    <li><strong>All types:</strong> Regular meal times, mindful eating</li>
                </ul>
                
                <h3>Herbal Support</h3>
                <ul>
                    <li><strong>Vata:</strong> Ashwagandha, brahmi, shatavari</li>
                    <li><strong>Pitta:</strong> Bhringaraj, shatavari, coriander</li>
                    <li><strong>Kapha:</strong> Tulsi, ginger, calamus</li>
                    <li><strong>All types:</strong> Turmeric, tulsi tea, chamomile</li>
                </ul>
                
                <h3>Lifestyle Practices</h3>
                <ul>
                    <li><strong>Daily routine:</strong> Consistent sleep/wake times</li>
                    <li><strong>Self-massage:</strong> With dosha-specific oils</li>
                    <li><strong>Yoga:</strong> Appropriate for your dosha</li>
                    <li><strong>Nature connection:</strong> Regular time outdoors</li>
                    <li><strong>Digital detox:</strong> Scheduled screen-free time</li>
                </ul>
                
                <h3>Mind-Body Techniques</h3>
                <ul>
                    <li><strong>Pranayama:</strong> Nadi shodhana for Vata, sheetali for Pitta, bhastrika for Kapha</li>
                    <li><strong>Meditation:</strong> Even 10 minutes daily helps</li>
                    <li><strong>Mantra repetition:</strong> Calming for the mind</li>
                    <li><strong>Journaling:</strong> For emotional release</li>
                </ul>
                
                <p>By addressing stress from multiple angles, Ayurveda provides sustainable solutions for modern stress management.</p>
            `
        },
        "mindful-living": {
            title: "Mindful Living According to Ayurveda",
            image: "images/mindful-living.png",
            content: `
                <img src="images/mindful-living.png" alt="Mindful living practices" class="modal-image">
                <h2>Mindful Living According to Ayurveda</h2>
                <p>Ayurveda teaches that mindfulness should extend beyond meditation into every aspect of daily life. Here's how to cultivate present-moment awareness Ayurvedically.</p>
                
                <h3>Mindful Eating Practices</h3>
                <ul>
                    <li>Eat without distractions (no screens or reading)</li>
                    <li>Chew each bite 20-30 times</li>
                    <li>Notice the six tastes in each meal</li>
                    <li>Stop eating when 75% full</li>
                    <li>Express gratitude for your food</li>
                </ul>
                
                <h3>Mindful Movement</h3>
                <ul>
                    <li>Practice yoga with full awareness of breath and body</li>
                    <li>Walk mindfully, feeling each step</li>
                    <li>Notice your posture throughout the day</li>
                    <li>Stretch regularly with awareness</li>
                </ul>
                
                <h3>Mindful Communication</h3>
                <ul>
                    <li>Pause before speaking</li>
                    <li>Listen fully without planning your response</li>
                    <li>Speak truthfully but kindly</li>
                    <li>Observe your tone and body language</li>
                </ul>
                
                <h3>Daily Mindfulness Anchors</h3>
                <ul>
                    <li>Morning intention setting</li>
                    <li>Breath awareness at red lights or while waiting</li>
                    <li>Evening gratitude reflection</li>
                    <li>Mindful transitions between activities</li>
                </ul>
                
                <h3>Dosha-Specific Mindfulness</h3>
                <p><strong>Vata:</strong> Grounding practices, single-tasking<br>
                <strong>Pitta:</strong> Cooling observations, non-judgment<br>
                <strong>Kapha:</strong> Energizing awareness, gentle stimulation</p>
                
                <p>By bringing mindfulness into ordinary activities, we transform them into opportunities for presence and self-awareness.</p>
            `
        },
        "seasonal-detox": {
            title: "Ayurvedic Seasonal Detox Guide",
            image: "images/seasonal-detox.png",
            content: `
                <img src="images/seasonal-detox.png" alt="Seasonal detox ingredients" class="modal-image">
                <h2>Ayurvedic Seasonal Detox Guide</h2>
                <p>Ayurveda recommends seasonal cleansing (Ritucharya) to help the body transition between seasons and prevent accumulation of toxins (ama). Here's how to detox according to Ayurvedic principles.</p>
                
                <h3>Best Times for Detox</h3>
                <ul>
                    <li><strong>Spring:</strong> Ideal for major detox as nature renews</li>
                    <li><strong>Fall:</strong> Good for lighter cleansing</li>
                    <li><strong>Seasonal transitions:</strong> The 2 weeks between seasons</li>
                    <li><strong>New and full moons:</strong> Natural cleansing times</li>
                </ul>
                
                <h3>General Detox Guidelines</h3>
                <ul>
                    <li>Start with simple dietary changes first</li>
                    <li>Gradually reduce heavy, processed foods</li>
                    <li>Increase warm, cooked, easy-to-digest meals</li>
                    <li>Stay well hydrated with warm herbal teas</li>
                    <li>Support elimination with gentle herbs</li>
                    <li>Get adequate rest during detox</li>
                </ul>
                
                <h3>Seasonal Detox Focus</h3>
                <p><strong>Spring:</strong> Focus on Kapha - bitter greens, fasting, dry brushing<br>
                <strong>Summer:</strong> Focus on Pitta - cooling foods, hydration, moderation<br>
                <strong>Fall:</strong> Focus on Vata - warm oils, grounding foods, routine<br>
                <strong>Winter:</strong> Gentle nourishment with occasional light meals</p>
                
                <h3>Ayurvedic Detox Practices</h3>
                <ul>
                    <li><strong>Tongue scraping:</strong> Daily upon waking</li>
                    <li><strong>Oil pulling:</strong> With sesame or coconut oil</li>
                    <li><strong>Abhyanga:</strong> Self-massage with warm oil</li>
                    <li><strong>Swedana:</strong> Herbal steam therapy</li>
                    <li><strong>Triphala:</strong> Gentle herbal cleanser</li>
                    <li><strong>Yoga and pranayama:</strong> To support circulation</li>
                </ul>
                
                <p>A seasonal Ayurvedic detox helps reset your system and maintain optimal health throughout the year.</p>
            `
        },
        "monsoon-care": {
            title: "Ayurvedic Monsoon Care Routine",
            image: "images/monsoon-care.png",
            content: `
                <img src="images/monsoon-care.png" alt="Monsoon season care" class="modal-image">
                <h2>Ayurvedic Monsoon Care Routine</h2>
                <p>The monsoon season brings unique health challenges according to Ayurveda. Here's how to stay balanced and healthy during rainy season with Ayurvedic wisdom.</p>
                
                <h3>Monsoon Dosha Balance</h3>
                <p>The rains aggravate Vata due to cool, wet, windy weather while also increasing Kapha due to humidity. Pitta can accumulate from stagnant water.</p>
                
                <h3>Dietary Recommendations</h3>
                <ul>
                    <li>Favor warm, cooked, lightly spiced foods</li>
                    <li>Include ginger, garlic, turmeric, and cumin</li>
                    <li>Drink boiled or filtered water with digestive spices</li>
                    <li>Avoid raw salads, cold drinks, and heavy foods</li>
                    <li>Consume honey in moderation (never heated)</li>
                </ul>
                
                <h3>Lifestyle Practices</h3>
                <ul>
                    <li>Keep warm and dry - don't sit in wet clothes</li>
                    <li>Practice daily Abhyanga with warm sesame oil</li>
                    <li>Use nasal oil (Nasya) to protect from allergens</li>
                    <li>Burn antimicrobial herbs like neem or guggul</li>
                    <li>Exercise regularly to prevent stagnation</li>
                </ul>
                
                <h3>Common Monsoon Ailments</h3>
                <p><strong>Digestive issues:</strong> Drink ginger tea, avoid street food<br>
                <strong>Colds and flu:</strong> Take tulsi tea with black pepper<br>
                <strong>Joint pain:</strong> Warm oil massage with wintergreen<br>
                <strong>Skin infections:</strong> Apply neem paste or turmeric</p>
                
                <h3>Herbal Support</h3>
                <ul>
                    <li><strong>Digestion:</strong> Ginger, pippali, chitrak</li>
                    <li><strong>Immunity:</strong> Tulsi, turmeric, amalaki</li>
                    <li><strong>Respiratory:</strong> Vasaka, licorice, pushkarmool</li>
                    <li><strong>Detox:</strong> Guduchi, manjistha, neem</li>
                </ul>
                
                <p>With proper Ayurvedic care, you can enjoy the monsoon season while staying healthy and balanced.</p>
            `
        },
        "winter-wellness": {
            title: "Winter Wellness with Ayurveda",
            image: "images/winter-wellness.png",
            content: `
                <img src="images/winter-wellness.png" alt="Winter wellness practices" class="modal-image">
                <h2>Winter Wellness with Ayurveda</h2>
                <p>Winter is a time of increased Vata and Kapha according to Ayurveda. Here's how to stay warm, nourished, and healthy during the cold months with Ayurvedic wisdom.</p>
                
                <h3>Winter Dietary Guidelines</h3>
                <ul>
                    <li>Favor warm, cooked, nourishing foods</li>
                    <li>Include healthy fats like ghee, sesame oil, and nuts</li>
                    <li>Use warming spices - ginger, cinnamon, cardamom, cloves</li>
                    <li>Eat root vegetables and seasonal squashes</li>
                    <li>Drink warm herbal teas throughout the day</li>
                    <li>Consume honey in moderation (never heated)</li>
                </ul>
                
                <h3>Daily Routine for Winter</h3>
                <ul>
                    <li>Wake before sunrise (by 6 AM)</li>
                    <li>Practice Abhyanga with warm sesame or almond oil</li>
                    <li>Do energizing yoga and breathing exercises</li>
                    <li>Take warm baths with Epsom salts</li>
                    <li>Dress in layers to maintain warmth</li>
                    <li>Go to bed by 10 PM for restorative sleep</li>
                </ul>
                
                <h3>Common Winter Concerns</h3>
                <p><strong>Dry skin:</strong> Regular oil massage, stay hydrated<br>
                <strong>Stiff joints:</strong> Warm oil with wintergreen or camphor<br>
                <strong>Colds/flu:</strong> Ginger tea, turmeric milk, rest<br>
                <strong>Low energy:</strong> Moderate exercise, warming foods</p>
                
                <h3>Winter Herbal Support</h3>
                <ul>
                    <li><strong>Immunity:</strong> Chyawanprash, ashwagandha, tulsi</li>
                    <li><strong>Digestion:</strong> Ginger, pippali, trikatu</li>
                    <li><strong>Respiratory:</strong> Sitopaladi, vasaka, licorice</li>
                    <li><strong>Nourishment:</strong> Shatavari, bala, dates</li>
                </ul>
                
                <p>Winter is actually considered the best season for building strength and immunity when you follow these Ayurvedic guidelines.</p>
            `
        },
        "cold-remedies": {
            title: "Ayurvedic Cold and Flu Remedies",
            image: "images/cold-remedies.png",
            content: `
                <img src="images/cold-remedies.png" alt="Cold and flu remedies" class="modal-image">
                <h2>Ayurvedic Cold and Flu Remedies</h2>
                <p>Ayurveda offers numerous natural remedies for colds and flu that address the root cause while relieving symptoms. Here are time-tested approaches based on your dosha.</p>
                
                <h3>General Ayurvedic Cold Care</h3>
                <ul>
                    <li>Rest and conserve energy</li>
                    <li>Stay warm and avoid drafts</li>
                    <li>Drink plenty of warm fluids</li>
                    <li>Eat light, easy-to-digest foods</li>
                    <li>Use steam inhalation with essential oils</li>
                </ul>
                
                <h3>Dosha-Specific Symptoms & Remedies</h3>
                <p><strong>Vata Cold:</strong> Dry cough, chills, anxiety<br>
                - Drink warm ginger tea with honey<br>
                - Massage chest with sesame oil and camphor<br>
                - Take ashwagandha to support immunity</p>
                
                <p><strong>Pitta Cold:</strong> Fever, sore throat, irritability<br>
                - Drink cooling coriander-fennel tea<br>
                - Use coconut oil in nose (Nasya)<br>
                - Take guduchi to reduce fever</p>
                
                <p><strong>Kapha Cold:</strong> Congestion, lethargy, mucus<br>
                - Drink ginger tea with black pepper<br>
                - Use eucalyptus steam inhalation<br>
                - Take sitopaladi churna for congestion</p>
                
                <h3>Top Ayurvedic Remedies</h3>
                <ul>
                    <li><strong>Golden Milk:</strong> Turmeric, ginger, black pepper in warm milk</li>
                    <li><strong>Tulsi Tea:</strong> Holy basil leaves with ginger and honey</li>
                    <li><strong>Ginger-Honey:</strong> Fresh ginger juice with raw honey</li>
                    <li><strong>Herbal Steam:</strong> Eucalyptus or mint leaves in hot water</li>
                    <li><strong>Spice Decoction:</strong> Boil cinnamon, cardamom, cloves in water</li>
                </ul>
                
                <p>These Ayurvedic remedies can help shorten illness duration and prevent complications when used at the first sign of symptoms.</p>
            `
        },
        "digestive-remedies": {
            title: "Simple Ayurvedic Digestive Aids",
            image: "images/digestive-remedies.png",
            content: `
                <img src="images/digestive-remedies.png" alt="Digestive remedies" class="modal-image">
                <h2>Simple Ayurvedic Digestive Aids</h2>
                <p>Ayurveda offers numerous kitchen remedies for common digestive issues. Here are simple, effective solutions you can prepare at home.</p>
                
                <h3>For General Digestion</h3>
                <ul>
                    <li><strong>Ginger-Lemon:</strong> Fresh ginger juice with lemon before meals</li>
                    <li><strong>Cumin-Coriander-Fennel Tea:</strong> Equal parts boiled in water</li>
                    <li><strong>Pomegranate Chutney:</strong> With cumin and black salt</li>
                    <li><strong>Ajwain Water:</strong> Carom seeds soaked overnight</li>
                </ul>
                
                <h3>For Specific Concerns</h3>
                <p><strong>Bloating/Gas:</strong><br>
                - Asafoetida (hing) with warm water<br>
                - Ginger powder with black salt</p>
                
                <p><strong>Acidity/Heartburn:</strong><br>
                - Cold milk with ghee and sugar<br>
                - Coconut water with coriander powder</p>
                
                <p><strong>Constipation:</strong><br>
                - Warm water with ghee and lemon in morning<br>
                - Soaked figs or prunes at night</p>
                
                <p><strong>Diarrhea:</strong><br>
                - Rice kanji (congee) with pomegranate seeds<br>
                - Banana with cumin powder and ghee</p>
                
                <h3>Digestive Spice Mixes</h3>
                <ul>
                    <li><strong>Trikatu:</strong> Ginger, black pepper, long pepper (for Kapha)</li>
                    <li><strong>Hingvastak:</strong> Asafoetida with 8 spices (for Vata)</li>
                    <li><strong>Avipattikar:</strong> Cooling herbs (for Pitta)</li>
                    <li><strong>Panchakola:</strong> Five pungent spices (for sluggish digestion)</li>
                </ul>
                
                <h3>Lifestyle Tips</h3>
                <ul>
                    <li>Eat meals at consistent times daily</li>
                    <li>Don't eat when stressed or emotional</li>
                    <li>Chew food thoroughly (20-30 times per bite)</li>
                    <li>Take a short walk after meals</li>
                    <li>Avoid cold drinks with meals</li>
                </ul>
                
                <p>These simple Ayurvedic remedies can help maintain strong digestion, which is the foundation of good health.</p>
            `
        },
        "skin-care": {
            title: "Ayurvedic Skin Care Solutions",
            image: "images/skin-care.png",
            content: `
                <img src="images/skin-care.png" alt="Ayurvedic skin care" class="modal-image">
                <h2>Ayurvedic Skin Care Solutions</h2>
                <p>Ayurveda approaches skin health holistically, addressing both internal balance and external care. Here are natural solutions for common skin concerns based on your dosha.</p>
                
                <h3>Dosha-Specific Skin Characteristics</h3>
                <p><strong>Vata Skin:</strong> Dry, thin, prone to wrinkles and cracking<br>
                <strong>Pitta Skin:</strong> Sensitive, prone to rashes and inflammation<br>
                <strong>Kapha Skin:</strong> Oily, thick, prone to congestion and blackheads</p>
                
                <h3>Internal Care for Healthy Skin</h3>
                <ul>
                    <li>Stay well hydrated with warm herbal teas</li>
                    <li>Eat according to your dosha and season</li>
                    <li>Support digestion to prevent toxins (ama)</li>
                    <li>Get adequate sleep for cellular repair</li>
                    <li>Manage stress through yoga and meditation</li>
                </ul>
                
                <h3>Topical Treatments</h3>
                <p><strong>Vata:</strong> Nourish with sesame oil, avocado, honey masks<br>
                <strong>Pitta:</strong> Cool with coconut oil, aloe vera, sandalwood<br>
                <strong>Kapha:</strong> Stimulate with mustard oil, clay masks, exfoliation</p>
                
                <h3>Common Skin Concerns</h3>
                <p><strong>Dry Skin:</strong> Massage with warm sesame oil before bathing<br>
                <strong>Acne:</strong> Apply neem-turmeric paste or sandalwood<br>
                <strong>Eczema:</strong> Use ghee with manjistha internally and externally<br>
                <strong>Aging:</strong> Take amalaki and use rose oil massage</p>
                
                <h3>Daily Skin Routine</h3>
                <ol>
                    <li>Cleanse with herbal powder suited to your dosha</li>
                    <li>Tone with rose water or herbal infusion</li>
                    <li>Moisturize with dosha-specific oil</li>
                    <li>Weekly exfoliation and masking</li>
                    <li>Monthly detox with herbal steam</li>
                </ol>
                
                <p>By balancing your dosha and using these natural approaches, you can achieve healthy, glowing skin from the inside out.</p>
            `
        },
        "understanding-doshas": {
            title: "Understanding the Three Doshas",
            image: "images/doshas.png",
            content: `
                <img src="images/doshas.png" alt="Three doshas" class="modal-image">
                <h2>Understanding the Three Doshas</h2>
                <p>According to Ayurveda, the five elements (space, air, fire, water, earth) combine to form three fundamental energies or doshas - Vata, Pitta, and Kapha. These govern all physical and mental processes.</p>
                
                <h3>Vata Dosha (Air + Space)</h3>
                <p><strong>Qualities:</strong> Dry, light, cold, rough, subtle, mobile<br>
                <strong>Functions:</strong> Movement, communication, creativity<br>
                <strong>When balanced:</strong> Energetic, creative, adaptable<br>
                <strong>When imbalanced:</strong> Anxiety, insomnia, constipation</p>
                
                <h3>Pitta Dosha (Fire + Water)</h3>
                <p><strong>Qualities:</strong> Hot, sharp, light, oily, liquid, spreading<br>
                <strong>Functions:</strong> Digestion, metabolism, intelligence<br>
                <strong>When balanced:</strong> Intelligent, courageous, good leader<br>
                <strong>When imbalanced:</strong> Anger, inflammation, acidity</p>
                
                <h3>Kapha Dosha (Water + Earth)</h3>
                <p><strong>Qualities:</strong> Heavy, slow, cool, oily, smooth, dense<br>
                <strong>Functions:</strong> Structure, lubrication, stability<br>
                <strong>When balanced:</strong> Strong, calm, loving<br>
                <strong>When imbalanced:</strong> Lethargy, congestion, weight gain</p>
                
                <h3>Determining Your Constitution</h3>
                <ul>
                    <li>Most people have 1-2 dominant doshas</li>
                    <li>Your Prakriti (natural constitution) is set at conception</li>
                    <li>Your Vikriti (current state) changes with lifestyle</li>
                    <li>Take a dosha quiz or consult an Ayurvedic practitioner</li>
                </ul>
                
                <h3>Living in Balance</h3>
                <p>The key to health is maintaining your natural dosha balance through:<br>
                - Proper diet for your type<br>
                - Suitable exercise and yoga<br>
                - Appropriate daily and seasonal routines<br>
                - Stress management techniques</p>
                
                <p>Understanding your dosha composition helps you make choices that support your unique nature.</p>
            `
        },
        "agni-concept": {
            title: "The Concept of Agni (Digestive Fire)",
            image: "images/agni.png",
            content: `
                <img src="images/agni.png" alt="Digestive fire concept" class="modal-image">
                <h2>The Concept of Agni (Digestive Fire)</h2>
                <p>In Ayurveda, Agni refers to the metabolic fire that governs digestion, absorption, and assimilation. Strong Agni is considered the cornerstone of health, while weak Agni leads to disease.</p>
                
                <h3>Types of Agni</h3>
                <ul>
                    <li><strong>Jatharagni:</strong> Main digestive fire in stomach</li>
                    <li><strong>Dhatvagni:</strong> Tissue-specific metabolic fires</li>
                    <li><strong>Bhutagni:</strong> Elemental fires that transform food</li>
                </ul>
                
                <h3>States of Digestive Fire</h3>
                <p><strong>Sama Agni (Balanced):</strong> Ideal digestion and metabolism<br>
                <strong>Vishama Agni (Irregular):</strong> Vata-type - alternating strong/weak<br>
                <strong>Tikshna Agni (Sharp):</strong> Pitta-type - hyperacidity, heartburn<br>
                <strong>Manda Agni (Slow):</strong> Kapha-type - sluggish digestion</p>
                
                <h3>Signs of Strong Agni</h3>
                <ul>
                    <li>Regular appetite and thirst</li>
                    <li>Comfortable digestion without issues</li>
                    <li>Regular bowel movements (1-2 times daily)</li>
                    <li>Good energy after meals</li>
                    <li>Clear complexion and bright eyes</li>
                </ul>
                
                <h3>How to Strengthen Agni</h3>
                <ul>
                    <li>Eat your largest meal at midday</li>
                    <li>Drink ginger tea before meals</li>
                    <li>Chew food thoroughly (20-30 times per bite)</li>
                    <li>Avoid cold drinks with meals</li>
                    <li>Take a short walk after eating</li>
                    <li>Use digestive spices like ginger, cumin, fennel</li>
                </ul>
                
                <p>By understanding and nurturing your Agni, you can maintain optimal digestion and prevent the accumulation of toxins (ama) that lead to disease.</p>
            `
        },
        "ayurvedic-lifestyle": {
            title: "Principles of an Ayurvedic Lifestyle",
            image: "images/ayurvedic-lifestyle.png",
            content: `
                <img src="images/ayurvedic-lifestyle.png" alt="Ayurvedic lifestyle" class="modal-image">
                <h2>Principles of an Ayurvedic Lifestyle</h2>
                <p>Ayurveda teaches that health comes from living in harmony with nature's rhythms. These fundamental principles can guide you toward balance and wellbeing.</p>
                
                <h3>Core Ayurvedic Principles</h3>
                <ul>
                    <li><strong>Prevention:</strong> Maintain health rather than treat disease</li>
                    <li><strong>Individuality:</strong> Customize for your unique constitution</li>
                    <li><strong>Balance:</strong> Equal importance to body, mind, and spirit</li>
                    <li><strong>Interconnection:</strong> Recognize mind-body-environment links</li>
                </ul>
                
                <h3>Daily Practices (Dinacharya)</h3>
                <ul>
                    <li>Wake before sunrise</li>
                    <li>Eliminate bowels upon waking</li>
                    <li>Clean tongue, brush teeth, oil pulling</li>
                    <li>Self-massage with warm oil (Abhyanga)</li>
                    <li>Exercise appropriate for your dosha</li>
                    <li>Meditation and pranayama</li>
                    <li>Eat main meal at midday</li>
                    <li>Early bedtime (by 10 PM)</li>
                </ul>
                
                <h3>Seasonal Living (Ritucharya)</h3>
                <p>Adjust your routine with seasonal changes:<br>
                <strong>Spring:</strong> Detox, light foods, more activity<br>
                <strong>Summer:</strong> Cooling foods, moderate exercise<br>
                <strong>Fall:</strong> Grounding routine, warm foods<br>
                <strong>Winter:</strong> Nourishing foods, adequate rest</p>
                
                <h3>Mind-Body Connection</h3>
                <ul>
                    <li>Cultivate positive emotions and thoughts</li>
                    <li>Practice mindfulness in daily activities</li>
                    <li>Engage in purposeful work (Dharma)</li>
                    <li>Develop spiritual connection</li>
                    <li>Maintain healthy relationships</li>
                </ul>
                
                <p>By integrating these Ayurvedic principles into your life, you can create sustainable health and vitality.</p>
             `
        },

    };

    // Handle read more clicks
    document.querySelectorAll('.read-more').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const blogId = this.getAttribute('data-blog-id');
            
            if (blogContent[blogId]) {
                modalContent.innerHTML = `
                    <div class="modal-header">
                        <h2>${blogContent[blogId].title}</h2>
                    </div>
                    <div class="modal-body-content">
                        ${blogContent[blogId].content}
                    </div>
                `;
                
                blogModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close modal
    closeModal.addEventListener('click', () => {
        blogModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Close modal when clicking outside content
    blogModal.addEventListener('click', (e) => {
        if (e.target === blogModal) {
            blogModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // ======================
    // Current Year in Footer
    // ======================
    document.getElementById('currentYear').textContent = new Date().getFullYear();
});

// Initialize service worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful');
        }).catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}