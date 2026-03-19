// src/lib/achievements.js
// Single source of truth for all achievement data

export const achievements = [
    {
        id: 1,
        title: "Inventors Challenge '23 Winner",
        slug: "inventors-challenge-23",
        date: "2023",
        year: "2023",
        category: "Innovation",
        shortDescription:
            "Won first place for developing DEMS (Domestic Emotion Monitoring System), an embedded AI solution for mental health assessment using STM32 microcontroller.",

        summary:
            "Secured first place at the Inventors Challenge 2023 with DEMS (Domestic Emotion Monitoring System), an innovative embedded AI solution that revolutionizes mental health evaluation. The system uses real-time facial expression analysis on STM32MP135F microcontroller to aid psychiatrists in diagnosis and patient monitoring.",

        details: {
            context:
                "The Inventors Challenge 2023 focused on developing innovative solutions with measurable social impact. Mental health disorders affect millions globally, with 43.8 million adults experiencing mental illness annually. The competition sought breakthrough technologies to address critical healthcare challenges.",

            challenge:
                "Mental health diagnosis is time-consuming, often taking weeks or years, based purely on subjective assessment. The challenge was to develop an objective, data-driven tool that could accelerate diagnosis while providing psychiatrists with systematic emotion tracking and analysis capabilities.",

            solution:
                "DEMS is an embedded AI system built on STM32MP135F-DK microcontroller with TensorFlow Lite for real-time emotion detection. The system analyzes facial expressions to predict four emotions (angry, happy, sad, neutral), providing psychiatrists with graphical analysis and emotion pattern tracking. It features both web (Streamlit) and mobile (MIT App Inventor) applications for multi-platform accessibility.",

            myRole:
                "As Team Lead & Embedded AI Engineer, I architected the embedded AI solution, implemented and optimized TensorFlow Lite models for resource-constrained hardware, developed the facial expression analysis algorithms, designed the web application, integrated camera hardware, and managed the project budget of ₹15,000.",

            impact:
                "Successfully deployed real-time emotion detection on embedded hardware within tight memory and power constraints. Created a data-driven diagnostic support tool that speeds up mental health diagnosis. Aligned with UN SDG Goal 3 (Good Health and Well-being) and received expert validation from Dr. A. Turin Martina, Head of P.G and Research, Department of Rehabilitation Science.",

            recognition:
                "Awarded first place for exceptional technical innovation, practical applicability, and social impact. The judges recognized DEMS's potential to transform mental health diagnosis through objective emotion tracking and real-time embedded AI processing.",
        },

        images: [
            "/images/achievements/inventors-challenge-23/win.jpeg",
            "/images/projects/emotion-monitoring-system/7.jpeg",
            "/images/projects/emotion-monitoring-system/1.jpg",
            "/images/projects/emotion-monitoring-system/8.png",
            "/images/projects/emotion-monitoring-system/5.png",
            "/images/projects/emotion-monitoring-system/2.png",
            "/images/projects/emotion-monitoring-system/3.png",
            "/images/projects/emotion-monitoring-system/4.png",


        ],
        media: {
            enabled: true,
            images: [
                {
                    src: "/images/achievements/inventors-challenge-23/win.jpeg",
                    caption: "STM32MP135F-DK BOARD Working Environment"
                },
            ]
        },
        tags: ["Embedded AI", "Mental Health", "STM32", "TensorFlow Lite", "First Place", "Healthcare Technology"],

        links: {
            certificate: "",
            news: "",
            project: "/projects/emotion-monitoring-system",
        },
    },

    {
        id: 2,
        title: "Smart India Hackathon '23 Finalist",
        slug: "sih-23-finalist",
        date: "2023",
        year: "2023",
        category: "Hackathon",
        shortDescription:
            "National finalist for Bird's AI, a 5G-enabled search and rescue drone with unique vending machine style payload delivery system.",

        summary:
            "Reached the national finals of Smart India Hackathon 2023 with Bird's AI, a 5G-connected UAV platform for disaster response. The system features onboard edge AI for real-time survivor detection and an innovative vending machine style payload delivery mechanism for emergency supplies.",

        details: {
            context:
                "Smart India Hackathon (SIH) 2023 is one of the world's largest hackathons, attracting over 15,000 teams nationwide. The competition focused on innovative solutions for disaster management and emergency response, requiring working prototypes that demonstrate real-world applicability.",

            challenge:
                "The challenge was to develop an autonomous disaster response system that could locate survivors in large-scale emergencies (earthquakes, floods, landslides) and deliver critical supplies. The solution needed to overcome poor visibility, damaged infrastructure, and unreliable communication links while providing real-time intelligence to ground teams.",

            solution:
                "Bird's AI is a 5G-enabled UAV system with a Pixhawk flight controller and Raspberry Pi running lightweight computer vision for real-time human detection. The unique innovation is a vending machine style payload delivery system that can autonomously dispense emergency supplies (medical kits, water, communication devices) to survivors. The system maintains continuous 5G connectivity for low-latency telemetry streaming to ground control stations.",

            myRole:
                "As Full-Stack Robotics Engineer, I architected the edge AI system for survivor detection, developed the autonomous navigation logic, designed the innovative vending machine payload mechanism, integrated 5G connectivity for real-time data transmission, and built the ground control dashboard for mission monitoring.",

            impact:
                "Demonstrated 95% detection accuracy with <100ms 5G latency for real-time operations. The vending machine payload system enabled autonomous supply delivery without landing, significantly improving response efficiency. Successfully validated the system with live demonstrations, receiving strong feedback from judges on innovation and practical deployment potential.",

            recognition:
                "Selected as national finalist from thousands of teams. The judges particularly commended the unique vending machine payload delivery innovation and the integration of 5G, edge AI, and autonomous systems for life-saving disaster response applications.",
        },

        images: [
            "/images/achievements/nbuc-24-first-place/1.jpg",
            "/images/achievements/sih-23-finalist/IMG_4777.JPG",
            "/images/achievements/sih-23-finalist/payload.jpeg"

        ],

        tags: ["5G", "UAV", "Edge AI", "Disaster Response", "Autonomous Systems", "National Finalist", "Payload Delivery"],

        links: {
            certificate: "",
            website: "https://www.sih.gov.in/",
            project: "/projects/Birds-AI",
        },
    },

    {
        id: 3,
        title: "Smart India Hackathon '22 Finalist",
        slug: "sih-22-finalist",
        date: "2022",
        year: "2022",
        category: "Hackathon",
        shortDescription:
            "National finalist at SIH 2022 Hardware Edition — led Team THREADRIPPERZS to build WaterBot, an AI-enabled solar-powered robotic trash boat for urban drain cleanup.",

        summary:
            "Led Team THREADRIPPERZS from St. Joseph's College of Engineering to the national Grand Finale of Smart India Hackathon 2022 (Hardware Edition, Aug 25–29). Built WaterBot — an AI-enabled, solar-powered unmanned water vehicle that autonomously collects floating trash from urban drains using LiDAR, depth sounder, and computer vision. Problem Statement BV800 from the National Mission for Clean Ganga (NMCG), Ministry of Jal Shakti.",

        details: {
            context:
                "Smart India Hackathon 2022 Hardware Edition brought India's top engineering teams to build working hardware prototypes for real government problem statements. Problem Statement BV800 — posed by the National Mission for Clean Ganga (NMCG), Ministry of Jal Shakti — challenged teams to build an AI-enabled robotic trash boat to autonomously drive and harvest floating trash from urban drains.",

            challenge:
                "Local water bodies such as lakes and canals are being heavily polluted with plastic and chemical wastes, affecting the entire aquatic ecosystem. The challenge was to design an autonomous unmanned water vehicle (UWV) that could navigate urban drains, detect and collect floating debris, and analyze water quality — all powered sustainably and controllable remotely.",

            solution:
                "Built WaterBot — a solar-powered and battery-backed UWV with a front mesh collection ramp for harvesting floating plastics, debris, algae, and duckweed. The bot uses Arduino with LoRa communication for remote control, a brushless motor propulsion system with ESC, and is equipped as a 'swimming laboratory' with sensors for pH, salinity, and dissolved oxygen analysis. The full-scale design integrates LiDAR, depth sounder, P4 multispectral camera, and RTK sensor for AI-driven autonomous navigation.",

            myRole:
                "As Team Leader, I led the 6-member interdisciplinary team (ECE, CSE, Mechanical, Civil, EIE) through the entire design-build-present cycle during the 5-day Grand Finale. I architected the system, led the hardware assembly and electronics integration, designed the LoRa-based remote control system, coordinated the propulsion and hull construction, and delivered the final presentation to judges from NMCG.",

            impact:
                "Successfully built and demonstrated a working WaterBot prototype during the 5-day hackathon. The bot collected floating trash, analyzed water quality, and operated on solar + battery power — directly addressing the Clean Ganga mission's goals. The project later evolved into an MSME pitch for potential commercialization.",

            recognition:
                "Selected as national finalist from thousands of teams across India. Presented the working WaterBot prototype to expert judges from NMCG and received commendation for the interdisciplinary hardware-software integration. Team THREADRIPPERZS: Charan Velavan (Lead), Aditya S Nair, Akshay B, Prakriti Harith, Thanisqka N, Medha R. Mentored by Dr. Venkateshwara and Dr. U. Venkateshwara.",
        },

        images: [
            "/images/achievements/sih-22-finalist/waterbot-front.jpeg",
            "/images/achievements/sih-22-finalist/waterbot-angle.jpeg",
            "/images/achievements/sih-22-finalist/waterbot-powered.jpeg",
            "/images/achievements/sih-22-finalist/waterbot-display.jpeg",
            "/images/achievements/sih-22-finalist/team-formal.jpeg",
            "/images/achievements/sih-22-finalist/sih-banner.jpeg",
            "/images/achievements/sih-22-finalist/building-motor.jpeg",
            "/images/achievements/sih-22-finalist/building-hull.jpeg",
            "/images/achievements/sih-22-finalist/building-hull-2.jpeg",
            "/images/achievements/sih-22-finalist/electronics-lora.jpeg",
            "/images/achievements/sih-22-finalist/judging-demo.jpeg",
            "/images/achievements/sih-22-finalist/team-assembling.jpeg",
            "/images/achievements/sih-22-finalist/building-soldering.jpeg",
            "/images/achievements/sih-22-finalist/team-outdoor.jpeg",
            "/images/achievements/sih-22-finalist/team-workstation.jpeg",
            "/images/achievements/sih-22-finalist/team-formal-2.jpeg",
            "/images/achievements/sih-22-finalist/team-formal-3.jpeg",
        ],
        media: {
            enabled: true,
            images: [
                {
                    src: "/images/achievements/sih-22-finalist/waterbot-front.jpeg",
                    caption: "WaterBot v3 — front view showing mesh collection ramp and hull design"
                },
                {
                    src: "/images/achievements/sih-22-finalist/waterbot-angle.jpeg",
                    caption: "WaterBot v3 — angled view showing internal batteries and electronics deck"
                },
                {
                    src: "/images/achievements/sih-22-finalist/waterbot-powered.jpeg",
                    caption: "WaterBot v3 — powered on with electronics active"
                },
                {
                    src: "/images/achievements/sih-22-finalist/waterbot-display.jpeg",
                    caption: "WaterBot prototype on display at Station 6 during the Grand Finale"
                },
                {
                    src: "/images/achievements/sih-22-finalist/electronics-lora.jpeg",
                    caption: "Arduino + LoRa communication module — the remote control circuit"
                },
                {
                    src: "/images/achievements/sih-22-finalist/team-formal.jpeg",
                    caption: "Team THREADRIPPERZS at SIH 2022 Grand Finale"
                },
                {
                    src: "/images/achievements/sih-22-finalist/sih-banner.jpeg",
                    caption: "SIH 2022 team standee — PS BV800, NMCG, Ministry of Jal Shakti"
                },
                {
                    src: "/images/achievements/sih-22-finalist/building-motor.jpeg",
                    caption: "Wiring the brushless motor and ESC during the hackathon build"
                },
                {
                    src: "/images/achievements/sih-22-finalist/building-hull.jpeg",
                    caption: "Assembling the foam flotation hull and battery compartment"
                },
                {
                    src: "/images/achievements/sih-22-finalist/judging-demo.jpeg",
                    caption: "Presenting the WaterBot prototype to judges and mentors"
                },
            ]
        },
        tags: ["Hackathon", "National Finalist", "Hardware", "Robotics", "AI", "Solar Power", "IoT", "Water Quality", "LoRa", "Arduino"],

        links: {
            certificate: "",
            website: "https://www.sih.gov.in/",
            project: "/projects/waterbot",
        },
    },

    {
        id: 4,
        title: "NBUC '24 First Place",
        slug: "nbuc-24-first-place",
        date: "2024",
        year: "2024",
        category: "Competition",
        shortDescription:
            "Won first place with Bird's AI, a 5G-enabled autonomous search and rescue drone system with edge AI for disaster response.",

        summary:
            "Secured first place at the National Business and University Competition (NBUC) 2024 with Bird's AI, a 5G-connected UAV platform designed to revolutionize disaster response. The system combines autonomous navigation, real-time survivor detection using edge AI, and ultra-low latency telemetry streaming for emergency operations.",

        details: {
            context:
                "NBUC 2024 brought together top universities to showcase innovative technology projects with real-world impact. The competition evaluated projects on technical innovation, execution quality, scalability, and potential for deployment in critical applications. Projects were judged by industry leaders and academic experts.",

            challenge:
                "Participants were required to develop and present a complete working prototype with clear problem-solution fit, technical documentation, and impact assessment. The challenge was to demonstrate not just innovation but practical feasibility and readiness for real-world deployment in time-critical scenarios.",

            solution:
                "Bird's AI is an end-to-end intelligent UAV system featuring a quadrotor platform with Pixhawk flight controller and Raspberry Pi onboard computer running lightweight computer vision for real-time human detection. The system maintains continuous 5G connectivity, enabling low-latency transmission of telemetry, detection metadata, and visual evidence to ground control stations. Mission logic dynamically adapts flight paths based on live feedback to optimize area coverage and detection efficiency.",

            myRole:
                "As Full-Stack Robotics Engineer and Project Lead, I architected the complete system including edge AI integration, developed the autonomous navigation and detection algorithms, implemented 5G connectivity for real-time data streaming, built the ground control dashboard, and led the technical presentation to judges.",

            impact:
                "The prototype demonstrated 95% real-time human detection accuracy with <100ms 5G latency. Compared to manual search patterns, Bird's AI improved area coverage efficiency by covering 500m² autonomously with 25-minute flight time. The system validated the feasibility of integrating edge AI with cellular-connected UAVs for time-critical emergency response operations.",

            recognition:
                "Awarded first place among competing universities. The judges commended the technical execution, real-world applicability for disaster response, successful integration of 5G and edge AI technologies, and the potential for immediate deployment in emergency scenarios. Recognized for exceptional presentation quality and comprehensive system demonstration.",
        },

        images: [
            "/images/achievements/nbuc-24-first-place/1.jpg",
            "/images/achievements/nbuc-24-first-place/2.jpg",
            "/images/achievements/nbuc-24-first-place/3.jpg",
            "/images/achievements/nbuc-24-first-place/4.jpg",
            "/images/achievements/nbuc-24-first-place/5.jpg",
            "/images/achievements/nbuc-24-first-place/6.jpg",
        ],

        tags: ["5G", "UAV", "Edge AI", "Disaster Response", "First Place", "Autonomous Systems", "Computer Vision"],

        links: {
            certificate: "",
            project: "/projects/Birds-AI",
        },
    },

    // ── TOASTMASTERS (Consolidated) ──────────────────────────────────────────

    {
        id: 5,
        title: "Toastmasters International – Awards & Recognition",
        slug: "toastmasters-awards",
        date: "2023",
        year: "2022–2026",
        category: "Public Speaking",
        shortDescription:
            "Multiple contest placements and recognition at TMI@EastCoast Toastmasters Club — spanning Table Topics, Humorous Speech, Evaluation contests at both Club and Area levels, plus Outstanding Member recognition.",

        summary:
            "Over three years as an active member of TMI@EastCoast Toastmasters Club, competed in and placed in multiple speech and evaluation contests at both Club and Area levels. Served as VP Public Relations and now Club President. Recognised as Outstanding Member for 2022–23.",

        // Timeline of individual awards — rendered as a visual timeline on the detail page
        timeline: [
            {
                date: "Jan 2026 – Present",
                title: "Club President",
                description: "Leading TMI@EastCoast as Club President, overseeing operations and member development.",
                level: "Club",
                result: "Current Role",
            },
            {
                date: "Oct 2023",
                title: "Evaluation Contest – Runner-up",
                description: "Achieved Runner-up at the Area-level Evaluation Speech Contest, demonstrating strong evaluative feedback skills.",
                level: "Area Level",
                result: "🥈 Runner-up",
            },
            {
                date: "Oct 2023",
                title: "Humorous Speech Contest – 2nd Runner-up",
                description: "Secured 2nd Runner-up at the Area-level Humorous Speech Contest, showcasing wit, comedic timing, and audience engagement.",
                level: "Area Level",
                result: "🥉 2nd Runner-up",
            },
            {
                date: "Sep 2023",
                title: "Evaluation Contest – Runner-up",
                description: "Achieved Runner-up at Club-level Evaluation Contest, qualifying to advance to the Area-level round.",
                level: "Club Level",
                result: "🥈 Runner-up",
            },
            {
                date: "Sep 2023",
                title: "Humorous Speech Contest – Runner-up",
                description: "Achieved Runner-up at Club-level Humorous Speech Contest, qualifying for the Area-level competition.",
                level: "Club Level",
                result: "🥈 Runner-up",
            },
            {
                date: "Aug 2023",
                title: "Outstanding Member (2022–2023)",
                description: "Recognized as Outstanding Member for exemplary participation, growth, and contributions during the 2022–23 term.",
                level: "Club",
                result: "🏅 Outstanding Member",
            },
            {
                date: "Jun 2023 – Dec 2023",
                title: "Vice President Public Relations (VPPR)",
                description: "Led communication initiatives at TMI@EastCoast, crafting compelling narratives and promoting members' public speaking achievements.",
                level: "Club",
                result: "Leadership Role",
            },
            {
                date: "Apr 2023",
                title: "Table Topics Contest – Runner-up",
                description: "Achieved Runner-up at Club-level Table Topics Contest, demonstrating strong impromptu speaking skills.",
                level: "Club Level",
                result: "🥈 Runner-up",
            },
        ],

        details: {
            context:
                "Toastmasters International is the world's leading organization for public speaking and leadership development. TMI@EastCoast is a club affiliated with Toastmasters International, where members practice and compete in various speech and evaluation contests.",

            challenge:
                "Competed across multiple contest categories — Humorous Speech, Table Topics (impromptu), and Evaluation — at both Club and Area levels, each testing a different dimension of communication: wit, spontaneity, and analytical feedback.",

            solution:
                "Committed to consistent participation: prepared structured speeches, studied evaluation frameworks, served in leadership roles as VPPR and then Club President, and represented the club across contest levels.",

            myRole:
                "Active member since July 2022. Served as VP Public Relations (Jun–Dec 2023) and elected Club President (Jan 2026–Present). Competed individually in Humorous Speech, Table Topics, and Evaluation contests.",

            impact:
                "Placed Runner-up or higher in 5 contests across Club and Area levels. Named Outstanding Member for 2022–23. Led club communications as VPPR and currently lead all club operations as President.",

            recognition:
                "Multiple contest placements (Runner-up, 2nd Runner-up) at Club and Area levels. Outstanding Member award for 2022–23 term. All recognitions issued by Toastmasters International.",
        },

        images: ["/images/intern/toastmasters/Toastmasters.png"],
        tags: ["Toastmasters", "Public Speaking", "Leadership", "Contest", "VPPR", "Club President"],
        links: {
            website: "https://www.toastmasters.org/",
        },
    },

    // ── BUILDATHON 4.0 ──────────────────────────────────────────────────────

    {
        id: 6,
        title: "Buildathon 4.0 – 2nd Place | ITU FG-AINN AI Native Networks",
        slug: "buildathon-4-2nd-place",
        date: "Feb 2026",
        year: "2026",
        category: "Hackathon",
        shortDescription:
            "Secured 2nd Place at ITU Buildathon 4.0 (AI Native Networks & Applications). Built an AI-native converged 6G–ATSC 3.0 network for scalable UAV swarm coordination — achieving up to 98% bandwidth savings. Submitted as official ITU Focus Group document FG-AINN-I-215.",

        summary:
            "Team NVK (Charan Velavan & Yogender Raju, SSN College of Engineering) secured 2nd Place at Buildathon 4.0: AI Native Networks & Applications (ITU × FreeStream). The project is an AI-native converged 6G–ATSC 3.0 network architecture for scalable UAV swarm coordination in smart cities. An edge-deployed AI Mission Coordination Server on Raspberry Pi 5 dynamically classifies UAV telemetry and selects the optimal delivery mode — 6G unicast for latency-critical control, 5G eMBMS multicast for group missions, and ATSC 3.0 broadcast for mass distribution — achieving up to 98% bandwidth savings. Submitted as ITU Focus Group document FG-AINN-I-215 and mentored by Dr. P. Kaythry.",

        details: {
            context:
                "ITU Buildathon 4.0 focused on AI-native networks and applications within the Framework of ITU's Focus Group on AI Native for Telecommunications Networks (FG-AINN). The challenge demanded working Proof-of-Concept prototypes integrating real AI and networking for smart city and next-generation communication use cases, judged against international standards bodies.",

            challenge:
                "UAV swarms deployed in smart cities for surveillance, disaster response, and traffic monitoring require both low-latency bidirectional control and efficient distribution of shared mission data to hundreds of drones simultaneously. Unicast-only cellular approaches create backhaul overload; pure broadcast lacks bidirectional control. The challenge was to combine these heterogeneous technologies intelligently at the network edge.",

            solution:
                "Designed and implemented an AI-native converged 6G–ATSC 3.0 architecture. An edge-deployed AI Mission Coordination Server on Raspberry Pi 5 runs a trained ML classification model that consumes real-time telemetry features (swarm size, spatial density, congestion, priority, latency needs) to dynamically select between 6G unicast (for latency-critical control), 5G eMBMS multicast (for group targeting), and ATSC 3.0 broadcast (for mass mission dissemination). A Python-based UAV simulator models 150–300 UAVs with geo-coordinates, battery dynamics, and congestion. A Streamlit Mission Control Dashboard visualizes AI decisions, bandwidth savings, 2D/3D UAV maps, and predictive analysis in real time.",

            myRole:
                "Co-architect of the system with Yogender Raju (Team NVK), guided by Dr. P. Kaythry (SSN). Designed the AI architecture and training pipeline, built the UAV Swarm Digital Simulator in Python, deployed the ML model on Raspberry Pi 5, implemented the inter-device communication protocol, and developed the Streamlit Mission Control Dashboard.",

            impact:
                "Achieved up to 98% bandwidth savings (~147 MB per operation) vs. unicast-only baseline. Maintained sub-50ms latency for critical 6G unicast traffic while running concurrent ATSC 3.0 broadcast. Successfully coordinated 150–300 UAVs in real-time with sub-100ms AI edge inference. Submitted as official ITU FG-AINN Input Document (FG-AINN-I-215) for the 2025–2028 study period.",

            recognition:
                "2nd Place at Buildathon 4.0: AI Native Networks & Applications, organized by the International Telecommunication Union (ITU) and FreeStream Technologies. Official Input Document submitted: FG-AINN-I-215. Collaboration with Edge Beam Wireless. Internal Guide: Dr. P. Kaythry, SSN College of Engineering.",
        },

        images: [],
        tags: ["AI Native Networks", "6G", "ATSC 3.0", "UAV Swarm", "Raspberry Pi 5", "Edge AI", "ITU", "5G eMBMS", "Streamlit", "Machine Learning", "Smart Cities", "2nd Place", "#AIForGood"],
        links: {
            report: "/papers/buildathon-itu-fgainn-215.pdf",
            github: "",
        },
    },

    // Add more achievements here as needed
];

export function getAchievementBySlug(slug) {
    return achievements.find((a) => a.slug === slug);
}

export const featuredAchievementSlugs = [
    "inventors-challenge-23",
    "sih-23-finalist",
    "nbuc-24-first-place",
    "buildathon-4-2nd-place",
];
