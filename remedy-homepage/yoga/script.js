document.addEventListener("DOMContentLoaded", () => {
    // Mobile Menu Toggle
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

    const yogaCards = document.getElementById("yogaCards");
    const videoContainer = document.getElementById("videoContainer");
    const categoryBtns = document.querySelectorAll(".category-btn");
    const categoryFilter = document.getElementById("categoryFilter");
    const benefitFilter = document.getElementById("benefitFilter");
    const searchInput = document.getElementById("yogaSearch");
    const searchBtn = document.getElementById("searchBtn");

    // Comprehensive yoga data with benefits, difficulty levels, and categories
    const yogaData = [
        {
            id: 1,
            title: "Surya Namaskar (Sun Salutation)",
            image: "https://images.unsplash.com/photo-1545389336-cf090694435e",
            description: "A sequence of 12 powerful yoga poses that provide a good cardiovascular workout and improves flexibility.",
            category: "hatha",
            difficulty: "beginner",
            benefits: ["stress-relief", "flexibility", "strength", "full-body workout"],
            steps: [
                "Stand at the edge of your mat with feet together and palms in prayer position (Pranamasana)",
                "Inhale, raise arms overhead and arch back slightly (Hasta Uttanasana)",
                "Exhale, bend forward from waist, placing hands beside feet (Padahastasana)",
                "Inhale, take right leg back (Ashwa Sanchalanasana)",
                "Hold breath, take left leg back into plank (Dandasana)",
                "Exhale, lower knees, chest and chin to floor (Ashtanga Namaskara)",
                "Inhale, slide forward and lift chest (Bhujangasana)",
                "Exhale, lift hips into downward dog (Adho Mukha Svanasana)",
                "Inhale, bring right foot forward between hands (Ashwa Sanchalanasana)",
                "Exhale, bring left foot forward (Padahastasana)",
                "Inhale, rise up with arms overhead (Hasta Uttanasana)",
                "Exhale, return to prayer position (Pranamasana)"
            ],
            videoId: "UJ1L3Kpdgw0",
            duration: "10 minutes",
            origin: "India",
            precautions: "Avoid if you have severe back problems or high blood pressure"
        },
        {
            id: 2,
            title: "Tadasana (Mountain Pose)",
            image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
            description: "Foundation of all standing poses, improves posture and brings awareness to breathing.",
            category: "hatha",
            difficulty: "beginner",
            benefits: ["posture", "balance", "strength"],
            steps: [
                "Stand with feet together or hip-width apart",
                "Distribute weight evenly across both feet",
                "Engage thigh muscles and lift kneecaps",
                "Lengthen tailbone toward floor",
                "Lift chest and broaden collarbones",
                "Arms can be at sides or palms together at chest",
                "Hold for 30 seconds to 1 minute"
            ],
            videoId: "0mPNlC0vD6s",
            duration: "1-2 minutes",
            origin: "India",
            precautions: "None"
        },
        {
            id: 3,
            title: "Vrikshasana (Tree Pose)",
            image: "https://media.istockphoto.com/id/2183375088/photo/woman-in-yoga-asana-vrikshasana-tree-pose-in-mountains-outdoors.webp?a=1&b=1&s=612x612&w=0&k=20&c=PsUrtB1-f4pUqSyjonBeSQ_E2dgoqWFcVhN_LZf0624=",
            description: "Classic balancing pose that strengthens legs and improves focus.",
            category: "hatha",
            difficulty: "beginner",
            benefits: ["balance", "concentration", "leg strength"],
            steps: [
                "Begin in Tadasana (Mountain Pose)",
                "Shift weight to left foot, bend right knee",
                "Place right foot on inner left thigh or calf (avoid knee)",
                "Bring palms together at chest or overhead",
                "Fix gaze on a steady point",
                "Hold for 30 seconds, then switch sides"
            ],
            videoId: "yVE4XXFFO70",
            duration: "1-2 minutes per side",
            origin: "India",
            precautions: "Avoid if you have low blood pressure or recent ankle/knee injury"
        },
        {
            id: 4,
            title: "Adho Mukha Svanasana (Downward Facing Dog)",
            image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b",
            description: "Inversion pose that stretches hamstrings and strengthens arms and shoulders.",
            category: "vinyasa",
            difficulty: "beginner",
            benefits: ["flexibility", "strength", "stress-relief"],
            steps: [
                "Start on hands and knees (tabletop position)",
                "Tuck toes, lift knees off floor",
                "Press hands firmly into mat, index fingers parallel",
                "Lift sitting bones toward ceiling",
                "Straighten legs without locking knees",
                "Heels reach toward floor",
                "Hold for 1-3 minutes"
            ],
            videoId: "j97SSGsnCAQ",
            duration: "1-3 minutes",
            origin: "India",
            precautions: "Avoid if you have carpal tunnel syndrome or high blood pressure"
        },
        {
            id: 5,
            title: "Bhujangasana (Cobra Pose)",
            image: "https://images.unsplash.com/photo-1518611012118-696072aa579a",
            description: "Gentle backbend that strengthens spine and opens chest.",
            category: "hatha",
            difficulty: "beginner",
            benefits: ["back-pain", "flexibility", "posture"],
            steps: [
                "Lie prone on mat with legs extended",
                "Place palms under shoulders, elbows close to body",
                "Inhale, lift chest off floor using back muscles",
                "Keep elbows slightly bent, shoulders away from ears",
                "Hold for 15-30 seconds, then release"
            ],
            videoId: "JDcdhTuycOI",
            duration: "15-30 seconds",
            origin: "India",
            precautions: "Avoid if you have severe back injury or are pregnant"
        },
        {
            id: 6,
            title: "Balasana (Child's Pose)",
            image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0",
            description: "Resting pose that gently stretches hips, thighs and ankles.",
            category: "restorative",
            difficulty: "beginner",
            benefits: ["stress-relief", "relaxation", "back-pain"],
            steps: [
                "Kneel on floor with big toes touching",
                "Sit back on heels, knees hip-width apart",
                "Fold forward, resting torso between thighs",
                "Arms can extend forward or rest alongside body",
                "Forehead rests on floor",
                "Hold for 30 seconds to several minutes"
            ],
            videoId: "2MJGg-dUKh0",
            duration: "30 seconds to 5 minutes",
            origin: "India",
            precautions: "Avoid if you have knee injury or diarrhea"
        },
        {
            id: 7,
            title: "Virabhadrasana II (Warrior II)",
            image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597",
            description: "Powerful standing pose that strengthens legs and improves stamina.",
            category: "vinyasa",
            difficulty: "intermediate",
            benefits: ["strength", "stamina", "balance"],
            steps: [
                "Stand with feet wide apart (about 4 feet)",
                "Turn right foot out 90 degrees, left foot slightly in",
                "Align right heel with left arch",
                "Bend right knee over right ankle",
                "Extend arms parallel to floor, gaze over right hand",
                "Hold for 30 seconds, then switch sides"
            ],
            videoId: "yxNtoOJ9500",
            duration: "30 seconds per side",
            origin: "India",
            precautions: "Avoid if you have high blood pressure or recent knee/hip injury"
        },
        {
            id: 8,
            title: "Trikonasana (Triangle Pose)",
            image: "https://images.unsplash.com/photo-1593810450967-f9c42742e326",
            description: "Standing pose that stretches legs and opens hips and chest.",
            category: "iyengar",
            difficulty: "intermediate",
            benefits: ["flexibility", "balance", "digestion"],
            steps: [
                "Stand with feet wide apart (about 3-4 feet)",
                "Turn right foot out 90 degrees, left foot slightly in",
                "Extend arms parallel to floor",
                "Reach right hand toward right foot",
                "Left arm extends upward, gaze at left thumb",
                "Hold for 30 seconds, then switch sides"
            ],
            videoId: "_1124fj0BeQ",
            duration: "30 seconds per side",
            origin: "India",
            precautions: "Avoid if you have low blood pressure or migraine"
        },
        {
            id: 9,
            title: "Sirsasana (Headstand)",
            image: "https://media.istockphoto.com/id/674673828/photo/young-attractive-woman-in-salamba-sirsasana-pose-white-loft-stu.webp?a=1&b=1&s=612x612&w=0&k=20&c=ZH82oZgDtVeWYCyrGPHrcP0K2LugLsemDU-z-3KUozY=",
            description: "Advanced inversion that improves circulation and strengthens core.",
            category: "ashtanga",
            difficulty: "advanced",
            benefits: ["circulation", "core strength", "concentration"],
            steps: [
                "Kneel and interlace fingers, place forearms on mat",
                "Place crown of head on mat, hands supporting head",
                "Lift knees off floor, walk feet toward head",
                "Slowly lift legs straight up",
                "Engage core, keep weight on forearms not head",
                "Hold for 10-30 seconds, then slowly come down"
            ],
            videoId: "75o40UmAURo",
            duration: "10-30 seconds",
            origin: "India",
            precautions: "Avoid if you have neck injury, high blood pressure, or are menstruating"
        },
        {
            id: 10,
            title: "Padmasana (Lotus Pose)",
            image: "https://media.istockphoto.com/id/1315856341/photo/young-woman-meditating-outdoors-at-park.webp?a=1&b=1&s=612x612&w=0&k=20&c=AOSCus5JOM3azhJpIQAwllBsoyDbna9CS_3RFlckmzQ=",
            description: "Classic meditation pose that promotes calmness and focus.",
            category: "kundalini",
            difficulty: "intermediate",
            benefits: ["meditation", "hip flexibility", "posture"],
            steps: [
                "Sit with legs extended",
                "Bend right knee, place right foot on left thigh",
                "Bend left knee, place left foot on right thigh",
                "Soles face upward, knees touch floor",
                "Hands can rest on knees in chin or jnana mudra",
                "Spine straight, shoulders relaxed",
                "Hold for several minutes"
            ],
            videoId: "w_j4lnfRC38",
            duration: "1-5 minutes",
            origin: "India",
            precautions: "Avoid if you have knee or ankle injury"
        },
        {
            id: 11,
            title: "Dhanurasana (Bow Pose)",
            image: "https://media.istockphoto.com/id/579143500/photo/woman-doing-ashtanga-vinyasa-yoga-asana-dhanurasana-bow-pose.webp?a=1&b=1&s=612x612&w=0&k=20&c=BJzmFja92lDlUleUZ_Tu4_K9j9T4_x8d9wGbMlkMdCo=",
            description: "Deep backbend that strengthens back muscles and improves digestion.",
            category: "hatha",
            difficulty: "intermediate",
            benefits: ["back-pain", "digestion", "flexibility"],
            steps: [
                "Lie prone on mat with arms alongside body",
                "Bend knees, reach back to hold ankles",
                "Inhale, lift chest and thighs off floor",
                "Keep gaze forward, shoulders relaxed",
                "Hold for 20-30 seconds, then release"
            ],
            videoId: "xm00XMmBbto",
            duration: "20-30 seconds",
            origin: "India",
            precautions: "Avoid if you have hernia, recent abdominal surgery, or severe back injury"
        },
        {
            id: 13,
            title: "Natarajasana (Dancer's Pose)",
            image: "https://media.istockphoto.com/id/521957821/photo/woman-in-dancers-pose.webp?a=1&b=1&s=612x612&w=0&k=20&c=j2kCcNAYTW1amRg1XtncRAmGGNcB5wfv_sl5SizcJ6g=",
            description: "Elegant balancing pose that improves posture and concentration.",
            category: "vinyasa",
            difficulty: "advanced",
            benefits: ["balance", "posture", "leg strength"],
            steps: [
                "Stand in Tadasana",
                "Bend right knee, hold right ankle with right hand",
                "Extend left arm forward",
                "Kick right foot into hand as you lean torso forward",
                "Keep standing leg straight, gaze forward",
                "Hold for 20-30 seconds, then switch sides"
            ],
            videoId: "yVMCeNRoJXA",
            duration: "20-30 seconds per side",
            origin: "India",
            precautions: "Avoid if you have low blood pressure or recent ankle/knee injury"
        },
        {
            id: 14,
            title: "Ustrasana (Camel Pose)",
            image: "https://media.istockphoto.com/id/1400780034/photo/active-senior-woman-doing-camel-pose-or-ustrasana-exercise-at-park.webp?a=1&b=1&s=612x612&w=0&k=20&c=exX-lyutJEMbwaY3WSmFWK27mhlP8h3WIB5V3jaJ4X0=",
            description: "Deep heart-opening backbend that stretches entire front body.",
            category: "hatha",
            difficulty: "intermediate",
            benefits: ["flexibility", "posture", "stress-relief"],
            steps: [
                "Kneel with knees hip-width apart",
                "Place hands on lower back for support",
                "Inhale, lift chest and lean back",
                "Option to reach for heels with hands",
                "Keep hips over knees, don't compress lower back",
                "Hold for 20-30 seconds, then release"
            ],
            videoId: "8q7GxnIFsQo",
            duration: "20-30 seconds",
            origin: "India",
            precautions: "Avoid if you have severe back or neck injury"
        },
        {
            id: 15,
            title: "Halasana (Plow Pose)",
            image: "https://media.istockphoto.com/id/1180509447/photo/young-woman-practicing-yoga-halasana-exercise-plough-pose.webp?a=1&b=1&s=612x612&w=0&k=20&c=BgOsDwa3fKcq7o_roionLOJEqZ9aRDWwqs_2_MPa3XE=",
            description: "Inversion that stretches shoulders and spine while calming the mind.",
            category: "iyengar",
            difficulty: "intermediate",
            benefits: ["stress-relief", "flexibility", "digestion"],
            steps: [
                "Lie on back with arms alongside body",
                "Lift legs overhead, bringing toes to floor behind head",
                "Support back with hands if needed",
                "Keep legs straight, toes pointed",
                "Hold for 30 seconds to 1 minute",
                "Slowly roll down one vertebra at a time"
            ],
            videoId: "qpuY0jXimtQ",
            duration: "30 seconds to 1 minute",
            origin: "India",
            precautions: "Avoid if you have neck injury, high blood pressure, or are menstruating"
        },
         {
        id: 16,
        title: "Kapalbhati Pranayama",
        image: "https://media.istockphoto.com/id/489603622/photo/seiza.webp?a=1&b=1&s=612x612&w=0&k=20&c=7h4TreoxvkWN2GZRx3eijU2-OFHIiEfypVw9XZ1LkYo=",
        description: "A powerful breathing technique that cleanses the respiratory system and improves digestion.",
        category: "kundalini",
        difficulty: "intermediate",
        benefits: ["digestion", "stress-relief", "circulation"],
        steps: [
            "Sit in a comfortable cross-legged position with spine straight",
            "Place hands on knees in chin or jnana mudra",
            "Take a deep breath in",
            "Exhale forcefully through nose while pulling belly in",
            "Inhalation should happen passively",
            "Start with 30-40 strokes per minute, gradually increasing",
            "Practice for 5-15 minutes"
        ],
        videoId: "jpVHSek5FzA", 
        duration: "5-15 minutes",
        origin: "India",
        precautions: "Avoid if pregnant or have high blood pressure, hernia, or gastric ulcers"
    },
    {
        id: 17,
        title: "Anulom Vilom Pranayama",
        image: "https://media.istockphoto.com/id/1158987112/photo/profile-shot-of-mature-man-meditating-in-lotus-position-on-pier-against-lake.webp?a=1&b=1&s=612x612&w=0&k=20&c=RQtTgAlBxgYrHLJEkpq92V5s7kXmOkuPE0aOCFijPtE=",
        description: "Alternate nostril breathing that balances the nervous system and calms the mind.",
        category: "kundalini",
        difficulty: "beginner",
        benefits: ["stress-relief", "concentration", "respiratory health"],
        steps: [
            "Sit comfortably with spine straight",
            "Place left hand on left knee in chin mudra",
            "Use right thumb to close right nostril",
            "Inhale deeply through left nostril",
            "Close left nostril with ring finger, open right nostril",
            "Exhale through right nostril",
            "Inhale through right nostril",
            "Close right nostril, open left nostril",
            "Exhale through left nostril",
            "This completes one round. Practice for 5-10 minutes"
        ],
        videoId: "I77hh5I69gA",
        duration: "5-10 minutes",
        origin: "India",
        precautions: "Avoid forceful breathing if you have heart conditions"
    },
    {
        id: 18,
        title: "Bhramari Pranayama",
        image: "https://media.istockphoto.com/id/1493474467/photo/young-attractive-woman-in-doing-yoga-and-meditation-in-bhramari-pranayama-pose.webp?a=1&b=1&s=612x612&w=0&k=20&c=VqFvx_ZFvsVnqIzIfd5DU4Ot_P8MI3Pfc3drwB-547I=",
        description: "Bee breathing technique that instantly calms the mind and relieves stress.",
        category: "kundalini",
        difficulty: "beginner",
        benefits: ["stress-relief", "concentration", "mindfulness"],
        steps: [
            "Sit comfortably with spine straight",
            "Close ears with thumbs",
            "Place index fingers on forehead, remaining fingers over eyes",
            "Inhale deeply through nose",
            "Exhale slowly while making a humming sound like a bee",
            "Feel the vibration throughout your head",
            "Repeat 5-10 times"
        ],
        videoId: "_IDbQWLkGcg", 
        duration: "3-5 minutes",
        origin: "India",
        precautions: "Avoid if you have severe ear infection"
    },
    {
        id: 19,
        title: "Shavasana with Yoga Nidra",
        image: "https://media.istockphoto.com/id/1152223612/photo/vacation-of-beautiful-attractive-asian-woman-relaxing-in-yoga-savasana-pose-on-the-pool-above.webp?a=1&b=1&s=612x612&w=0&k=20&c=k5MHIl_k-qp3Er4VRJnf0WP4HXG0FRE6tU8_kEkPACs=",
        description: "Deep relaxation technique that rejuvenates body and mind.",
        category: "restorative",
        difficulty: "beginner",
        benefits: ["stress-relief", "relaxation", "mindfulness"],
        steps: [
            "Lie flat on your back, arms slightly away from body",
            "Close your eyes and relax completely",
            "Focus on natural breath for 1-2 minutes",
            "Bring awareness to each body part starting from toes to head",
            "Maintain awareness without moving any muscles",
            "Stay for 10-20 minutes",
            "To come out, slowly wiggle fingers and toes, then sit up"
        ],
        videoId: "GX8TPloZLRQ", // Yoga Nidra video
        duration: "10-20 minutes",
        origin: "India",
        precautions: "None"
    },
    {
        id: 20,
        title: "Chakrasana (Wheel Pose)",
        image: "https://media.istockphoto.com/id/2136094125/photo/a-beautiful-woman-performing-chakrasana-yoga-pose-also-known-as-wheel-pose-concept-of-a.webp?a=1&b=1&s=612x612&w=0&k=20&c=2R8MoL_PxHcmA8COde9L456BeMbNlCeM7W_uYrYtfn0=",
        description: "Advanced backbend that opens chest and strengthens spine.",
        category: "ashtanga",
        difficulty: "advanced",
        benefits: ["flexibility", "strength", "back-pain"],
        steps: [
            "Lie on your back with knees bent and feet hip-width apart",
            "Place hands beside your head with fingers pointing toward shoulders",
            "Press into hands and feet to lift hips and chest off floor",
            "Straighten arms as much as possible",
            "Keep neck relaxed, gaze toward wall behind you",
            "Hold for 5-10 breaths",
            "To release, tuck chin to chest and lower slowly"
        ],
        videoId: "4CWuONgOX0c",
        duration: "30 seconds to 1 minute",
        origin: "India",
        precautions: "Avoid if you have wrist, shoulder or back injuries"
    },
    {
        id: 21,
        title: "Mayurasana (Peacock Pose)",
        image: "https://media.istockphoto.com/id/639103008/photo/young-attractive-woman-in-mayurasana-pose-white-studio-backgrou.webp?a=1&b=1&s=612x612&w=0&k=20&c=nhtELrZnpUrpPe65xO3Lvl0I0x-nrCj32RKLKSElhrU=",
        description: "Advanced arm balance that strengthens wrists and arms while improving digestion.",
        category: "ashtanga",
        difficulty: "advanced",
        benefits: ["digestion", "core strength", "arm strength"],
        steps: [
            "Kneel on floor with knees wide apart",
            "Place hands on floor with fingers pointing back toward body",
            "Bend elbows and bring them together near navel",
            "Lean forward, placing abdomen on upper arms",
            "Shift weight forward, lifting legs off floor",
            "Straighten legs back with toes pointed",
            "Hold for 10-30 seconds",
            "Release by lowering legs back to floor"
        ],
        videoId: "Ty2-vdooB_8",
        duration: "10-30 seconds",
        origin: "India",
        precautions: "Avoid if you have wrist or elbow injuries"
    },
    {
        id: 22,
        title: "Gomukhasana (Cow Face Pose)",
        image: "https://media.istockphoto.com/id/1495398393/photo/young-yogi-attractive-woman-in-cow-face-pose-or-gomukhasana.webp?a=1&b=1&s=612x612&w=0&k=20&c=1kdMC-iqgD9aeNH4zyJQ30cIgLQUZKlmvcZtBWfYj6s=",
        description: "Seated pose that stretches shoulders, arms, hips and thighs.",
        category: "hatha",
        difficulty: "intermediate",
        benefits: ["flexibility", "hip flexibility", "stress-relief"],
        steps: [
            "Sit with legs extended",
            "Bend right knee and place right foot under left hip",
            "Bend left knee and place left leg over right thigh",
            "Bring left foot near right hip",
            "Raise right arm overhead, bend elbow, hand reaching down back",
            "Bring left arm behind back, bend elbow, hand reaching up",
            "Clasp fingers if possible",
            "Hold for 30 seconds to 1 minute, then switch sides"
        ],
        videoId: "Dr-wqe6JLiQ",
        duration: "1-2 minutes",
        origin: "India",
        precautions: "Avoid if you have serious shoulder or knee injuries"
    },
    {
        id: 23,
        title: "Paschimottanasana (Seated Forward Bend)",
        image: "https://media.istockphoto.com/id/1076946886/photo/young-sporty-attractive-woman-practicing-yoga-doing-paschimottanasana-exercise.webp?a=1&b=1&s=612x612&w=0&k=20&c=o4yTcVjljIcb9tXMlz8ouUakNVys8a18mfkCoe5ElWs=",
        description: "Calming forward bend that stretches spine and hamstrings.",
        category: "hatha",
        difficulty: "beginner",
        benefits: ["stress-relief", "flexibility", "digestion"],
        steps: [
            "Sit with legs extended straight in front",
            "Inhale, lengthen spine",
            "Exhale, hinge at hips to fold forward",
            "Reach for feet, shins or knees",
            "Keep spine long, avoid rounding back",
            "Hold for 1-3 minutes",
            "Release slowly on an inhalation"
        ],
        videoId: "298tj3pcPF8",
        duration: "1-3 minutes",
        origin: "India",
        precautions: "Avoid if you have recent back injury or hernia"
    },
    {
        id: 24,
        title: "Ardha Matsyendrasana (Half Lord of the Fishes Pose)",
        image: "https://media.istockphoto.com/id/1495398351/photo/young-sporty-woman-practicing-yoga-at-park-doing-ardha-matsyendrasana-or-half-lord-of-the.webp?a=1&b=1&s=612x612&w=0&k=20&c=h5Lhli7eGn_F4a-XxCvzUK32byAUkMozTA3UxP5Hb7c=",
        description: "Seated twist that improves spinal mobility and digestion.",
        category: "hatha",
        difficulty: "intermediate",
        benefits: ["digestion", "flexibility", "back-pain"],
        steps: [
            "Sit with legs extended",
            "Bend right knee, place right foot outside left thigh",
            "Bend left knee, place left foot near right hip",
            "Place left elbow outside right knee",
            "Twist torso to right, right hand behind back",
            "Gaze over right shoulder",
            "Hold for 30 seconds to 1 minute, then switch sides"
        ],
        videoId: "kxgKSFI5cvg",
        duration: "1-2 minutes",
        origin: "India",
        precautions: "Avoid if you have severe spinal issues"
    },
    {
        id: 25,
        title: "Shavasana (Corpse Pose)",
        image: "https://media.istockphoto.com/id/2030734092/photo/woman-practicing-mindfulness-in-savasana-pose-on-yoga-mat-indoors.webp?a=1&b=1&s=612x612&w=0&k=20&c=BO8ofnmPCs1UMCLLVKN-TPZ6vy3bcTHpYM7FMXtmcsM=",
        description: "Final relaxation pose that integrates benefits of practice.",
        category: "restorative",
        difficulty: "beginner",
        benefits: ["stress-relief", "relaxation", "mindfulness"],
        steps: [
            "Lie flat on back with legs slightly apart",
            "Arms at sides, palms facing up",
            "Close eyes, relax entire body",
            "Focus on natural breath",
            "Remain for 5-15 minutes",
            "To exit, slowly roll to one side, then sit up"
        ],
        videoId: "KKjSuILqsRo",
        duration: "5-15 minutes",
        origin: "India",
        precautions: "None"
    }
    ];

    // Video tutorials data
    const videoData = [
        {
       title: "Pranayama by Saurabh Bothra",
        videoId: "I77hh5I69gA",
        duration: "15 minutes",
        instructor: "Saurabh Bothra",
        category: "kundalini"
    },
    {
       title: "Yoga for Weight Loss -  Saurabh Bothra",
        videoId: "Fnt7AJDLHkw",
        duration: "20 minutes",
        instructor: " Saurabh Bothra",
        category: "vinyasa"
    },
    {
     title: "Complete Yoga Routine - Satvic Yoga",
        videoId: "FyFUowFFYC4",
        duration: "30 minutes",
        instructor: "Satvic Yoga",
          category: "hatha"
    },
    {
        title: "Yoga for Diabetes - Bharatha Yoga",
        videoId: "TSnxM9DbppY",
        duration: "30 minutes",
        instructor: "Bharatha Yoga",
        category: "hatha"
    },
    {
        title: "Morning Yoga Routine -  Saurabh Bothra",
        videoId: "-qtqzeBAYj0",
        duration: "30 minutes",
        instructor: " Saurabh Bothra",
        category: "vinyasa"
    },
    {
       title: "Yoga for Beginners -  Saurabh Bothra",
        videoId: "tA8E4l8Dj34",
        duration: "10 minutes",
        instructor: "Saurabh Bothra",
        category: "hathaa"
    },
    {
        title: "Power Yoga for Strength - Satvic Yoga",
        videoId: "-nOtSOhZ7AA",
        duration: "32 minutes",
        instructor: "Satvic Yoga",
        category: "vinyasa"
    },
    {
        title: "Yoga for Flexibility -  Saurabh Bothra",
        videoId: "LCyP3F7gRC4",
        duration: "30 minutes",
        instructor: " Saurabh Bothra",
        category: "yin"
    },
    {
        title: "Advanced Ashtanga Series - Shubham Yoga",
        videoId: "nICrpLh-tfE",
        duration: "60 minutes",
        instructor: "Shubham Yoga",
        category: "ashtanga"
    },
        {
            title: "Daily Guided Pranayama",
            videoId: "blbv5UTBCGg",
            duration: "10 minutes",
            instructor: "Satvic Yoga",
            category: "hatha"
        },
        {
            title: "Yoga for Stress Relief",
            videoId: "f1LvJUt9fIg",
            duration: "30 minutes",
            instructor: "Saurabh Bothra",
            category: "restorative"
        },
        {
            title: "Full Body Yoga",
            videoId: "kdXm_aEaiV8",
            duration: "42 minutes",
            instructor: "Being The Fitest",
            category: "vinyasa"
        },
       
    ];

    // Render yoga cards
    function renderYogaCards(data) {
        yogaCards.innerHTML = "";
        data.forEach(item => {
            const card = document.createElement("div");
            card.className = "card animate-on-scroll";
            card.dataset.id = item.id;
            card.dataset.category = item.category;
            card.dataset.difficulty = item.difficulty;
            card.dataset.benefits = item.benefits.join(",");
            
            card.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="card-content">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <div class="benefits">
                        <ul>
                            ${item.benefits.map(benefit => `<li>${formatBenefit(benefit)}</li>`).join("")}
                        </ul>
                    </div>
                    <div class="meta">
                        <span class="difficulty ${item.difficulty}">${formatDifficulty(item.difficulty)}</span>
                        <span class="duration">${item.duration}</span>
                    </div>
                    <a href="#" class="cta-link" data-id="${item.id}">View Details</a>
                </div>
            `;
            yogaCards.appendChild(card);
        });
        
        // Add event listeners to detail buttons
        document.querySelectorAll(".cta-link").forEach(btn => {
            btn.addEventListener("click", function(e) {
                e.preventDefault();
                const id = parseInt(this.dataset.id);
                showYogaDetails(id);
            });
        });
    }

    // Render video tutorials
    function renderVideos(data) {
        videoContainer.innerHTML = "";
        data.forEach(video => {
            const videoCard = document.createElement("div");
            videoCard.className = "video-card";
            videoCard.innerHTML = `
                <iframe src="https://www.youtube.com/embed/${video.videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                <div class="video-info">
                    <h3>${video.title}</h3>
                    <p>${video.duration} • ${video.instructor}</p>
                </div>
            `;
            videoContainer.appendChild(videoCard);
        });
    }

    // Show yoga pose details in modal
    function showYogaDetails(id) {
        const pose = yogaData.find(item => item.id === id);
        if (!pose) return;
        
        const modal = document.createElement("div");
        modal.className = "modal";
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-btn">&times;</span>
                <div class="modal-header">
                    <h2>${pose.title}</h2>
                    <div class="meta">
                        <span class="difficulty ${pose.difficulty}">${formatDifficulty(pose.difficulty)}</span>
                        <span class="duration">${pose.duration}</span>
                        <span class="origin">Origin: ${pose.origin}</span>
                    </div>
                </div>
                <div class="modal-body">
                    <img src="${pose.image}" alt="${pose.title}" class="modal-image">
                    <div class="video-wrapper">
                        <iframe src="https://www.youtube.com/embed/${pose.videoId}" frameborder="0" allowfullscreen class="modal-video"></iframe>
                    </div>
                    <div class="description">
                        <h3>Description</h3>
                        <p>${pose.description}</p>
                    </div>
                    <div class="steps">
                        <h3>Steps</h3>
                        <ol class="steps-list">
                            ${pose.steps.map(step => `<li>${step}</li>`).join("")}
                        </ol>
                    </div>
                    <div class="benefits">
                        <h3>Benefits</h3>
                        <ul class="benefits-list">
                            ${pose.benefits.map(benefit => `<li>${formatBenefit(benefit)}</li>`).join("")}
                        </ul>
                    </div>
                    <div class="precautions">
                        <h3>Precautions</h3>
                        <p>${pose.precautions}</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = "block";
        
        // Close modal when clicking X
        modal.querySelector(".close-btn").addEventListener("click", () => {
            document.body.removeChild(modal);
        });
        
        // Close modal when clicking outside content
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    // Format benefit for display
    function formatBenefit(benefit) {
        const benefitMap = {
            "stress-relief": "Stress Relief",
            "flexibility": "Flexibility",
            "strength": "Strength",
            "balance": "Balance",
            "digestion": "Digestion",
            "back-pain": "Back Pain Relief",
            "posture": "Posture",
            "concentration": "Concentration",
            "meditation": "Meditation",
            "relaxation": "Relaxation",
            "circulation": "Circulation",
            "full-body workout": "Full-body Workout",
            "mindfulness": "Mindfulness",
            "stamina": "Stamina",
            "leg strength": "Leg Strength",
            "core strength": "Core Strength",
            "hip flexibility": "Hip Flexibility"
        };
        return benefitMap[benefit] || benefit;
    }

    // Format difficulty for display
    function formatDifficulty(difficulty) {
        const difficultyMap = {
            "beginner": "Beginner",
            "intermediate": "Intermediate",
            "advanced": "Advanced"
        };
        return difficultyMap[difficulty] || difficulty;
    }

    // Filter yoga poses based on selected filters
    function filterYogaPoses() {
        const selectedCategory = document.querySelector(".category-btn.active").dataset.category;
        const difficulty = categoryFilter.value;
        const benefit = benefitFilter.value;
        const searchTerm = searchInput.value.toLowerCase();
        
        let filteredData = yogaData;
        
        // Filter by category
        if (selectedCategory !== "all") {
            filteredData = filteredData.filter(item => item.category === selectedCategory);
        }
        
        // Filter by difficulty
        if (difficulty !== "all") {
            filteredData = filteredData.filter(item => item.difficulty === difficulty);
        }
        
        // Filter by benefit
        if (benefit !== "all") {
            filteredData = filteredData.filter(item => item.benefits.includes(benefit));
        }
        
        // Filter by search term
        if (searchTerm) {
            filteredData = filteredData.filter(item => 
                item.title.toLowerCase().includes(searchTerm) || 
                item.description.toLowerCase().includes(searchTerm) ||
                item.benefits.some(b => formatBenefit(b).toLowerCase().includes(searchTerm)
            ));
        }
        
        renderYogaCards(filteredData);
    }

    // Initialize the page
    function init() {
        renderYogaCards(yogaData);
        renderVideos(videoData);
        
        // Add event listeners to category buttons
        categoryBtns.forEach(btn => {
            btn.addEventListener("click", function() {
                categoryBtns.forEach(b => b.classList.remove("active"));
                this.classList.add("active");
                filterYogaPoses();
            });
        });
        
        // Add event listeners to filters
        categoryFilter.addEventListener("change", filterYogaPoses);
        benefitFilter.addEventListener("change", filterYogaPoses);
        
        // Add event listener to search
        searchBtn.addEventListener("click", filterYogaPoses);
        searchInput.addEventListener("keyup", function(e) {
            if (e.key === "Enter") filterYogaPoses();
        });
        
        // Initialize scroll animation
        animateOnScroll();
    }

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
    init();
});