document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
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
 
    // Header scroll effect
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Modal functionality
    const diseaseModal = document.getElementById('diseaseModal');
    const remedyModal = document.getElementById('remedyModal');
    const closeModalButtons = document.querySelectorAll('.close-modal');

    function openModal(modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

   // Updated remedy data 
const remedies = [
    {
        title: "Jatamansi Tea for Stress",
        image: "images/jatamansi.jpeg",
        ingredients: "Jatamansi powder, Water, Honey",
        preparation: "1. Boil 1/2 tsp jatamansi in 1 cup water for 5 mins. 2. Strain and add honey. 3. Drink before bedtime for relaxation and sound sleep."
    },
    {
        title: "Dhania Water for UTI",
        image: "images/dhania.jpg",
        ingredients: "Coriander seeds, Water",
        preparation: "1. Soak 2 tsp coriander seeds in 1 glass water overnight. 2. Strain and drink next morning on empty stomach for urinary tract health."
    },
    {
        title: "Kalonji Oil for Allergies",
        image: "images/kalonji.jpg",
        ingredients: "Kalonji (Nigella) oil, Honey",
        preparation: "1. Mix 1/2 tsp kalonji oil with 1 tsp honey. 2. Take twice daily to reduce allergy symptoms and boost immunity."
    },
      {
        title: "Giloy Juice for Fever",
        image: "images/giloy.png",
        ingredients: "Giloy stem, Water, Honey",
        preparation: "1. Boil 6-inch giloy stem in 2 cups water until reduced to half. 2. Strain and add 1 tsp honey. 3. Drink 2 tbsp 3 times daily to reduce fever and boost immunity."
    },
    {
        title: "Chyawanprash for Energy",
        image: "images/chyawan.png",
        ingredients: "Chyawanprash (store-bought), Warm Milk",
        preparation: "1. Mix 1 tbsp chyawanprash in 1/2 cup warm milk. 2. Consume every morning for vitality. Rich in antioxidants and improves stamina."
    },
    {
        title: "Urad Dal Pack for Joint Pain",
        image: "images/uraddal.png",
        ingredients: "Urad dal flour, Warm Water, Mustard Oil",
        preparation: "1. Make thick paste with urad dal and warm water. 2. Add 1 tsp mustard oil. 3. Apply on painful joints and leave for 30 minutes before washing."
    },
    {
        title: "Ashoka Bark for Menstrual Cramps",
        image: "images/ashoka.png",
        ingredients: "Ashoka bark powder, Water",
        preparation: "1. Boil 1 tsp ashoka bark in 2 cups water till reduced to half. 2. Strain and drink warm during periods to relieve cramps."
    },
    {
        title: "Vidarikand Milk for Strength",
        image: "images/vidarikand.png",
        ingredients: "Vidarikand powder, Milk, Honey",
        preparation: "1. Mix 1 tsp vidarikand in warm milk. 2. Add honey to taste. 3. Drink daily for muscle strength and endurance."
    },
    {
        title: "Nagarmotha for IBS",
        image: "images/nagarmotha.jpg",
        ingredients: "Nagarmotha powder, Buttermilk",
        preparation: "1. Mix 1/2 tsp nagarmotha in 1 cup buttermilk. 2. Drink after meals to relieve IBS symptoms and improve digestion."
    },
    {
        title: "Pashanbhed for Kidney Stones",
        image: "images/pashanbhed.png",
        ingredients: "Pashanbhed herb, Water",
        preparation: "1. Boil 5-6 pashanbhed leaves in 2 cups water. 2. Strain and drink 1/4 cup 3 times daily to dissolve kidney stones."
    },
    {
        title: "Bala Oil for Muscle Weakness",
        image: "images/balaoil.png",
        ingredients: "Bala oil (store-bought)",
        preparation: "1. Warm 2 tbsp bala oil slightly. 2. Massage on weak muscles for 10 minutes daily. Helps in neuromuscular disorders."
    },
    {
        title: "Daruharidra for Liver Health",
        image: "images/daruharidra.png",
        ingredients: "Daruharidra powder, Water",
        preparation: "1. Mix 1/4 tsp daruharidra in warm water. 2. Drink every morning to detoxify liver and improve function."
    },
    {
        title: "Yavasa for Asthma",
        image: "images/yavasa.png",
        ingredients: "Yavasa powder, Honey",
        preparation: "1. Mix 1/2 tsp yavasa with 1 tsp honey. 2. Take twice daily to relieve asthma symptoms and breathing difficulties."
    },
    {
        title: "Kutaja for Diarrhea",
        image: "images/kutaja.png",
        ingredients: "Kutaja bark powder, Yogurt",
        preparation: "1. Mix 1/4 tsp kutaja powder in 1/2 cup yogurt. 2. Consume twice daily for dysentery and diarrhea control."
    },
    {
        title: "Sariva for Blood Purification",
        image: "images/sariva.png",
        ingredients: "Sariva powder, Milk",
        preparation: "1. Mix 1/2 tsp sariva in warm milk. 2. Drink daily for 40 days to purify blood and improve skin health."
    },
    {
        title: "Parpataka for Fever",
        image: "images/parpataka.png",
        ingredients: "Parpataka herb, Water",
        preparation: "1. Boil 1 tsp parpataka in 1 cup water. 2. Strain and drink to reduce high fever and associated symptoms."
    },
    {
        title: "Chirata for Diabetes",
        image: "images/chirata.png",
        ingredients: "Chirata powder, Water",
        preparation: "1. Soak 1 tsp chirata in 1 cup water overnight. 2. Strain and drink next morning to help regulate blood sugar."
    },
    {
        title: "Shallaki for Arthritis",
        image: "images/shallaki.png",
        ingredients: "Shallaki gum resin, Warm Water",
        preparation: "1. Soak 1/4 tsp shallaki in warm water overnight. 2. Drink next morning to reduce joint inflammation and pain."
    },
    {
        title: "Guggulu for Cholesterol",
        image: "images/guggulu.png",
        ingredients: "Guggulu resin, Warm Water",
        preparation: "1. Take 1/4 tsp guggulu with warm water. 2. Consume twice daily after meals to help manage cholesterol levels."
    },
    {
        title: "Punarnava Mandoor for Anemia",
        image: "images/punarnava.png",
        ingredients: "Punarnava mandoor tablets, Buttermilk",
        preparation: "1. Take 1 tablet with buttermilk twice daily. 2. Continue for 3 months to improve hemoglobin levels naturally."
    },
    {
        title: "Kanchnar for Thyroid",
        image: "images/kanchnar.png",
        ingredients: "Kanchnar bark, Water",
        preparation: "1. Boil 1 tsp kanchnar bark in 2 cups water. 2. Reduce to half and drink 1/4 cup twice daily for thyroid support."
    },
    {
        title: "Varuna for Urinary Stones",
        image: "images/varuna.png",
        ingredients: "Varuna bark, Water",
        preparation: "1. Boil 1 tsp varuna bark in 2 cups water. 2. Strain and drink 1/4 cup 3 times daily to help dissolve urinary stones."
    },
    {
        title: "Apamarga for Piles",
        image: "images/apamarga.png",
        ingredients: "Apamarga root powder, Honey",
        preparation: "1. Mix 1/4 tsp apamarga with 1 tsp honey. 2. Take twice daily before meals for hemorrhoids relief."
    },
    {
        title: "Shigru for Obesity",
        image: "images/shigru.png",
        ingredients: "Shigru (Drumstick) leaves, Water",
        preparation: "1. Boil 10-12 shigru leaves in 2 cups water. 2. Strain and drink 1/2 cup twice daily for weight management."
    },
    {
        title: "Haridra Khanda for Skin",
        image: "images/haridra.png",
        ingredients: "Haridra khanda powder, Milk",
        preparation: "1. Mix 1 tsp haridra khanda in warm milk. 2. Drink daily at bedtime for glowing skin and allergy relief."
    },
    {
        title: "Kumari Asava for Digestion",
        image: "images/kumari.png",
        ingredients: "Kumari asava (store-bought), Water",
        preparation: "1. Mix 2 tsp kumari asava in equal water. 2. Take after meals for digestive issues and appetite improvement."
    },
    {
        title: "Drakshasava for Weakness",
        image: "images/draksha.png",
        ingredients: "Drakshasava (store-bought), Water",
        preparation: "1. Take 2 tsp drakshasava with equal water. 2. Consume twice daily for general debility and fatigue."
    },
    {
        title: "Lodhrasava for Menstrual Health",
        image: "images/lodhra.png",
        ingredients: "Lodhrasava (store-bought), Water",
        preparation: "1. Take 2 tsp lodhrasava with equal water. 2. Drink twice daily for 3 months for regular menstrual cycles."
    },
    {
        title: "Khadirarishta for Skin",
        image: "images/khadir.png",
        ingredients: "Khadirarishta (store-bought), Water",
        preparation: "1. Mix 2 tsp khadirarishta in equal water. 2. Take twice daily after meals for skin disorders and purification."
    },
    {
        title: "Pippalyasava for Respiration",
        image: "images/pippaly.png",
        ingredients: "Pippalyasava (store-bought), Water",
        preparation: "1. Take 2 tsp pippalyasava with equal water. 2. Consume twice daily for chronic respiratory conditions."
    },
    {
        title: "Kutajarishta for Diarrhea",
        image: "images/kutaja2.png",
        ingredients: "Kutajarishta (store-bought), Water",
        preparation: "1. Mix 2 tsp kutajarishta in equal water. 2. Take twice daily after meals for IBS and diarrhea control."
    },
    {
        title: "Arjunarishta for Heart",
        image: "images/arjuna2.png",
        ingredients: "Arjunarishta (store-bought), Water",
        preparation: "1. Take 2 tsp arjunarishta with equal water. 2. Drink twice daily for cardiovascular health and strength."
    },
    {
        title: "Dashmoolarishta for Pain",
        image: "images/dashmool.png",
        ingredients: "Dashmoolarishta (store-bought), Water",
        preparation: "1. Mix 2 tsp dashmoolarishta in equal water. 2. Take twice daily for body aches and neurological pain."
    },
    {
        title: "Ashokarishta for Women",
        image: "images/ashoka2.png",
        ingredients: "Ashokarishta (store-bought), Water",
        preparation: "1. Take 2 tsp ashokarishta with equal water. 2. Drink twice daily for gynecological disorders."
    },
    {
        title: "Saraswatarishta for Brain",
        image: "images/saraswat.png",
        ingredients: "Saraswatarishta (store-bought), Water",
        preparation: "1. Mix 2 tsp saraswatarishta in equal water. 2. Take twice daily for memory and nervous system."
    },
    {
        title: "Chandanasava for Pitta",
        image: "images/chandan.png",
        ingredients: "Chandanasava (store-bought), Water",
        preparation: "1. Take 2 tsp chandanasava with equal water. 2. Drink twice daily to balance pitta and cool body."
    },
    {
        title: "Aravindasava for Children",
        image: "images/aravind.png",
        ingredients: "Aravindasava (store-bought), Water",
        preparation: "1. Give 1 tsp aravindasava with equal water. 2. Administer twice daily for child appetite and growth."
    },
    {
        title: "Kumkumadi Oil for Face",
        image: "images/kumkum.png",
        ingredients: "Kumkumadi tailam (store-bought)",
        preparation: "1. Apply 2-3 drops on clean face at night. 2. Gently massage in upward motions. 3. Use daily for glowing complexion."
    },
    {
        title: "Bhrungaraj Oil for Hair",
        image: "images/bhringa.png",
        ingredients: "Bhrungaraj oil (store-bought)",
        preparation: "1. Warm oil slightly. 2. Massage into scalp for 10 minutes. 3. Leave overnight and wash next morning."
    },
    {
        title: "Dhanwantaram Oil for Massage",
        image: "images/dhanwan.png",
        ingredients: "Dhanwantaram oil (store-bought)",
        preparation: "1. Warm oil and massage whole body. 2. Especially good for postnatal care and muscle relaxation."
    },
    {
        title: "Ksheerabala Oil for Nerves",
        image: "images/ksheera.png",
        ingredients: "Ksheerabala oil (store-bought)",
        preparation: "1. Apply few drops and massage affected areas. 2. Helps in neurological disorders and paralysis."
    },
    {
        title: "Mahanarayan Oil for Joints",
        image: "images/mahanar.png",
        ingredients: "Mahanarayan oil (store-bought)",
        preparation: "1. Warm oil and massage painful joints. 2. Effective for arthritis, sprains and inflammation."
    },
    {
        title: "Pinda Tailam for Sprains",
        image: "images/pinda.png",
        ingredients: "Pinda tailam (store-bought)",
        preparation: "1. Apply liberally on injured area. 2. Massage gently. 3. Bandage for quick healing of sprains."
    },
    {
        title: "Sahacharadi Oil for Paralysis",
        image: "images/sahacha.png",
        ingredients: "Sahacharadi oil (store-bought)",
        preparation: "1. Warm oil and massage affected limbs. 2. Helps in partial paralysis and nerve weakness."
    },
    {
        title: "Kottamchukkadi Oil for Pain",
        image: "images/kottam.png",
        ingredients: "Kottamchukkadi oil (store-bought)",
        preparation: "1. Apply and massage on painful areas. 2. Effective for muscle pain, backache and stiffness."
    },
    {
        title: "Murivenna Oil for Fractures",
        image: "images/muriven.png",
        ingredients: "Murivenna oil (store-bought)",
        preparation: "1. Apply around fractured area (not on open wound). 2. Helps in bone healing and reduces swelling."
    },
    {
        title: "Kasisadi Oil for Wounds",
        image: "images/kasis.png",
        ingredients: "Kasisadi oil (store-bought)",
        preparation: "1. Apply few drops on cleaned wounds. 2. Promotes healing and prevents infection in cuts."
    },
    {
        title: "Jatyadi Oil for Burns",
        image: "images/jatyadi.png",
        ingredients: "Jatyadi oil (store-bought)",
        preparation: "1. Apply gently on minor burns after cooling. 2. Helps in quick healing and prevents scarring."
    },
    {
        title: "Panchaguna Oil for Ulcers",
        image: "images/pancha.png",
        ingredients: "Panchaguna oil (store-bought)",
        preparation: "1. Apply on non-healing ulcers after cleaning. 2. Helps in tissue regeneration and healing."
    },
    {
        title: "Eladi Oil for Headache",
        image: "images/eladi.png",
        ingredients: "Eladi oil (store-bought)",
        preparation: "1. Apply few drops on temples and massage. 2. Effective for tension headaches and migraine."
    },
    {
        title: "Anu Tailam for Sinus",
        image: "images/anutai.png",
        ingredients: "Anu tailam (store-bought)",
        preparation: "1. Put 2 drops in each nostril morning and night. 2. Helps in chronic sinusitis and allergies."
    },
    {
        title: "Shadbindu Oil for Nose",
        image: "images/shadbin.png",
        ingredients: "Shadbindu oil (store-bought)",
        preparation: "1. Instill 2 drops in each nostril daily. 2. Clears nasal passages and improves breathing."
    },
];

    // Diseases and remedies data
    const diseasesByCategory = {
        health: [
            { 
                name: "Muscle Pain", 
                description: "Natural remedies for muscle pain and inflammation", 
                image: "images/muscle-pain-remedy.png",
                ingredients: [
                    "Turmeric - 1 tsp", 
                    "Ginger paste - 1 tsp", 
                    "Warm coconut oil - 2 tbsp"
                ],
                preparation: "Mix turmeric and ginger paste with warm coconut oil. Massage gently on affected area 2-3 times daily. Leave for 30 minutes before washing with lukewarm water. This remedy helps reduce inflammation and provides pain relief."
            },
            { 
                name: "Loss of Appetite", 
                description: "Ayurvedic solutions to improve digestion and appetite", 
                image: "images/appetite-remedy.jpg",
                ingredients: [
                    "Fresh ginger - 1 inch piece",
                    "Lemon juice - 1 tsp",
                    "Rock salt - a pinch",
                    "Warm water - 1 cup"
                ],
                preparation: "Chew small pieces of fresh ginger with a pinch of rock salt 30 minutes before meals. Alternatively, mix ginger juice, lemon juice and rock salt in warm water and drink before meals. This stimulates digestive fire (Agni) and improves appetite."
            },
            { 
                name: "Indigestion", 
                description: "Home remedies for better digestion", 
                image: "images/indigestion-remedy.jpg",
                ingredients: [
                    "Cumin seeds - 1 tsp",
                    "Coriander seeds - 1 tsp",
                    "Fennel seeds - 1 tsp",
                    "Water - 2 cups"
                ],
                preparation: "Boil all seeds in water for 5 minutes. Strain and drink this tea after meals. This herbal tea helps in proper digestion, reduces gas and bloating. Can be consumed 2-3 times daily."
            },
            { 
                name: "Cough", 
                description: "Natural remedies to soothe cough and throat irritation", 
                image: "images/cough-remedy.png",
                ingredients: [
                    "Honey - 1 tbsp",
                    "Ginger juice - 1 tsp",
                    "Tulsi leaves - 5-6",
                    "Warm water - 1/2 cup"
                ],
                preparation: "Crush tulsi leaves and mix with ginger juice and honey. Add to warm water and stir well. Drink this mixture twice daily to relieve cough and soothe the throat."
            },
            { 
                name: "Headache", 
                description: "Ayurvedic remedies for headache relief", 
                image: "images/headache-remedy.jpg",
                ingredients: [
                    "Peppermint oil - 2-3 drops",
                    "Coconut oil - 1 tsp",
                    "Clove powder - a pinch"
                ],
                preparation: "Mix peppermint oil and clove powder with coconut oil. Apply gently on temples and forehead. Massage for 5-10 minutes. Rest for 30 minutes. This remedy helps reduce headache and promotes relaxation."
            }
        ],
        skin: [
            { 
                name: "Acne", 
                description: "Natural treatments for clear skin", 
                image: "images/acne-remedy.jpg",
                ingredients: [
                    "Neem leaves - 10-12",
                    "Turmeric - 1/2 tsp",
                    "Rose water - 1 tbsp"
                ],
                preparation: "Grind neem leaves into fine paste. Mix with turmeric and rose water to form smooth paste. Apply on affected areas and leave for 20 minutes. Wash with cold water. Use this face pack 3-4 times a week for best results. Neem has antibacterial properties while turmeric reduces inflammation."
            },
            { 
                name: "Eczema", 
                description: "Soothing remedies for skin irritation", 
                image: "images/eczema-remedy.jpg",
                ingredients: [
                    "Aloe vera gel - 2 tbsp",
                    "Coconut oil - 1 tbsp",
                    "Turmeric - 1/4 tsp"
                ],
                preparation: "Mix all ingredients well and apply on affected areas. Leave for 30 minutes before rinsing with cool water. Aloe vera soothes itching while coconut oil moisturizes dry skin. Turmeric helps reduce inflammation. Apply twice daily until symptoms improve."
            },
            { 
                name: "Dry Skin", 
                description: "Hydrating remedies for dry and flaky skin", 
                image: "images/dry-skin-remedy.jpg",
                ingredients: [
                    "Honey - 1 tbsp",
                    "Milk cream - 1 tbsp",
                    "Sandalwood powder - 1 tsp"
                ],
                preparation: "Mix honey, milk cream, and sandalwood powder to form a paste. Apply on dry skin areas and leave for 20 minutes. Rinse with lukewarm water. Use 2-3 times a week to hydrate and nourish skin."
            }
        ],
        hair: [
            { 
                name: "Hair Fall", 
                description: "Remedies to reduce hair fall", 
                image: "images/hairfall-remedy.jpg",
                ingredients: [
                    "Amla powder - 2 tbsp",
                    "Coconut oil - 3 tbsp",
                    "Hibiscus flowers - 4-5"
                ],
                preparation: "Heat coconut oil with hibiscus flowers until they dissolve. Strain and mix with amla powder to form smooth paste. Massage into scalp and leave for 45 minutes before washing. Use 2-3 times weekly. This strengthens hair roots and prevents breakage."
            },
            { 
                name: "Dandruff", 
                description: "Natural solutions for scalp health", 
                image: "images/dandruff-remedy.jpg",
                ingredients: [
                    "Fenugreek seeds - 2 tbsp",
                    "Yogurt - 1/2 cup",
                    "Lemon juice - 1 tbsp"
                ],
                preparation: "Soak fenugreek seeds overnight, grind into paste next morning. Mix with yogurt and lemon juice. Apply on scalp and leave for 30 minutes before washing. Use twice weekly. Fenugreek has antifungal properties while yogurt moisturizes and lemon balances pH."
            },
            { 
                name: "Premature Graying", 
                description: "Remedies to nourish hair and prevent graying", 
                image: "images/graying-remedy.jpg",
                ingredients: [
                    "Curry leaves - 10-12",
                    "Coconut oil - 3 tbsp",
                    "Amla juice - 1 tbsp"
                ],
                preparation: "Heat coconut oil with curry leaves until they turn crisp. Strain and mix with amla juice. Massage into scalp and hair. Leave for 1 hour before washing. Use twice weekly to nourish hair and prevent premature graying."
            }
        ],
        baby: [
            { 
                name: "Colic", 
                description: "Soothing remedies for baby colic", 
                image: "images/colic-remedy.jpg",
                ingredients: [
                    "Ajwain (carom seeds) - 1 tsp",
                    "Hing (asafoetida) - a pinch",
                    "Warm water - 1/4 cup"
                ],
                preparation: "Soak ajwain in warm water for 15 minutes. Strain and add a pinch of hing. Give 1-2 teaspoons of this water to baby 2-3 times daily. Can also be applied around navel. This helps relieve gas and stomach pain in infants. Always consult pediatrician before use."
            },
            { 
                name: "Diaper Rash", 
                description: "Natural treatments for diaper rash", 
                image: "images/diaper-rash-remedy.jpg",
                ingredients: [
                    "Coconut oil - 2 tbsp",
                    "Aloe vera gel - 1 tbsp",
                    "Turmeric - a pinch"
                ],
                preparation: "Mix all ingredients well. Clean and dry baby's skin thoroughly. Apply thin layer of this mixture during each diaper change. Coconut oil forms protective barrier while aloe vera soothes irritation. Turmeric has natural antiseptic properties."
            },
            { 
                name: "Cradle Cap", 
                description: "Gentle remedies for baby cradle cap", 
                image: "images/cradle-cap-remedy.jpg",
                ingredients: [
                    "Almond oil - 1 tbsp",
                    "Tea tree oil - 1-2 drops",
                    "Aloe vera gel - 1 tsp"
                ],
                preparation: "Mix almond oil, tea tree oil, and aloe vera gel. Gently massage onto baby's scalp. Leave for 15 minutes, then rinse with lukewarm water and a mild baby shampoo. Use 2-3 times a week. Always consult a pediatrician before use."
            }
        ]
    };

    // Function to show diseases by category
    function showDiseases(category) {
        const container = document.querySelector('.disease-container');
        container.innerHTML = '';
        
        diseasesByCategory[category].forEach(disease => {
            const card = document.createElement('div');
            card.className = 'disease-card';
            card.innerHTML = `
                <img src="${disease.image}" alt="${disease.name}" loading="lazy">
                <h3>${disease.name}</h3>
                <p>${disease.description}</p>
            `;
            card.addEventListener('click', () => {
                document.getElementById('modalImage').src = disease.image;
                document.getElementById('modalTitle').textContent = disease.name;
                document.getElementById('modalDescription').textContent = disease.description;
                
                const ingredientsList = document.getElementById('modalIngredients');
                ingredientsList.innerHTML = '';
                disease.ingredients.forEach(ingredient => {
                    const li = document.createElement('li');
                    li.textContent = ingredient;
                    ingredientsList.appendChild(li);
                });
                
                document.getElementById('modalPreparation').textContent = disease.preparation;
                openModal(diseaseModal);
            });
            container.appendChild(card);
        });
    }

    // Set up category tabs
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            showDiseases(this.dataset.category);
        });
    });

    // Show health diseases by default
    showDiseases('health');

    // Populate carousel
    const remedyCarousel = document.getElementById('remedyCarousel');
    const carouselPrev = document.getElementById('carouselPrev');
    const carouselNext = document.getElementById('carouselNext');
    const carouselDots = document.getElementById('carouselDots');

    remedies.forEach((remedy, index) => {
        const remedyCard = document.createElement('div');
        remedyCard.className = 'remedy-card';
        remedyCard.innerHTML = `
            <img src="${remedy.image}" alt="${remedy.title}" loading="lazy">
            <div class="remedy-info">
                <h3>${remedy.title}</h3>
                <p class="ingredients">${remedy.ingredients}</p>
                <div class="action-buttons">
                    <button class="view-button view-recipe-btn">View Recipe</button>
                </div>
            </div>
        `;
        remedyCarousel.appendChild(remedyCard);

        // Add click event to view recipe button
        remedyCard.querySelector('.view-recipe-btn').addEventListener('click', () => {
            document.getElementById('remedyModalImage').src = remedy.image;
            document.getElementById('remedyModalTitle').textContent = remedy.title;
            document.getElementById('remedyModalIngredients').textContent = remedy.ingredients;
            document.getElementById('remedyModalPreparation').textContent = remedy.preparation;
            openModal(remedyModal);
        });

        // Create dots
        if (carouselDots) {
            const dot = document.createElement('div');
            dot.className = 'carousel-dot';
            dot.dataset.index = index;
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                scrollToCard(index);
            });
            carouselDots.appendChild(dot);
        }
    });

    // Carousel navigation
    let scrollAmount = 0;
    const cardWidth = 320 + 25; // card width + gap
    let currentIndex = 0;

    function updateDots() {
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function scrollToCard(index) {
        currentIndex = index;
        scrollAmount = index * cardWidth;
        remedyCarousel.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
        updateDots();
    }

    carouselPrev.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            scrollToCard(currentIndex);
        }
    });

    carouselNext.addEventListener('click', function() {
        if (currentIndex < remedies.length - 1) {
            currentIndex++;
            scrollToCard(currentIndex);
        }
    });

    // Update dots on scroll
    remedyCarousel.addEventListener('scroll', function() {
        currentIndex = Math.round(this.scrollLeft / cardWidth);
        updateDots();
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

   

    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .disease-card, .testimonial-card');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < window.innerHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Set initial state for animation
    const animatedElements = document.querySelectorAll('.feature-card, .disease-card, .testimonial-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease';
    });

    // Scroll event listener
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Trigger once on load
});