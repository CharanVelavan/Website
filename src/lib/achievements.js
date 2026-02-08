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
            certificate: "/images/zoho.svg", // Add link if available
            news: "", // Add news article link if available
            project: "", // Add project link if available
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
            "Reached the national finals of Smart India Hackathon 2022, competing with top engineering teams across India.",

        summary:
            "Qualified for the national finals of Smart India Hackathon 2022, demonstrating exceptional problem-solving skills and technical innovation. Competed against thousands of teams from premier institutions across India.",

        details: {
            context:
                "Smart India Hackathon 2022 continued the tradition of bringing together India's brightest student innovators to solve real-world challenges. The competition featured problem statements from various government ministries, PSUs, and industry partners.",

            challenge:
                "Our team addressed the problem statement: [add your specific problem statement]. The challenge involved [describe the core challenge and requirements].",

            solution:
                "We built [describe your solution] using [technologies]. The solution featured [key capabilities and innovations]. Our approach focused on [unique aspects of your solution].",

            myRole:
                "As [your role], I contributed to [your specific responsibilities - e.g., full-stack development, database design, API integration, UI/UX implementation].",

            impact:
                "The solution achieved [specific results or metrics]. We demonstrated [key achievements during the hackathon]. The experience provided deep insights into [learnings].",

            recognition:
                "Qualified for the national finals, placing among the top teams nationwide. Presented our working prototype to expert judges and received valuable feedback. This achievement marked an important milestone in our technical journey.",
        },

        images: [
            "/images/achievements/sih-22.jpg",
            "/images/achievements/sih-22-team.jpg",
        ],

        tags: ["Hackathon", "National Finalist", "Problem Solving", "Innovation"],

        links: {
            certificate: "",
            website: "https://www.sih.gov.in/",
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
            project: "",
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
];
