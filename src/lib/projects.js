// src/lib/projects.js
// Single source of truth for all project data

export const projects = [
  //============================================== Bird's AI ========================================  
  {
    title: "Bird's AI – 5G Search & Rescue Drone",
    slug: "Birds-AI",
    description:
      "5G-enabled UAV system for disaster response with onboard edge AI for real-time survivor detection and adaptive autonomous navigation.",
    summary:
      "Bird's AI is a 5G-connected search-and-rescue UAV platform designed to assist emergency responders by autonomously detecting human presence in disaster-hit environments and streaming actionable intelligence with ultra-low latency.",
    details: {
      problem:
        "In large-scale disaster scenarios such as earthquakes, floods, and landslides, locating survivors quickly is critical to saving lives. Conventional search methods rely heavily on manual ground teams or line-of-sight aerial surveys, which are slow, manpower-intensive, and often constrained by poor visibility, damaged infrastructure, and unreliable communication links.",
      approach:
        "Bird's AI was designed as an end-to-end intelligent UAV system. A quadrotor platform equipped with a Pixhawk flight controller and Raspberry Pi onboard computer runs a lightweight computer vision model for real-time human detection. The UAV maintains continuous connectivity over a commercial 5G network, enabling low-latency transmission of telemetry, detection metadata, and visual evidence to a ground control station. Mission logic dynamically adapts flight paths based on live feedback to improve area coverage and detection efficiency.",
      outcome:
        "The prototype successfully demonstrated real-time human detection and stable telemetry streaming over a live 5G network. Compared to manual search patterns, Bird's AI improved area coverage efficiency and reduced response time, validating the feasibility of integrating edge AI with cellular-connected UAVs for time-critical emergency response operations.",
    },
    tags: [
      "5G",
      "UAV",
      "Edge AI",
      "Computer Vision",
      "Pixhawk",
      "Raspberry Pi",
      "Autonomous Systems",
    ],
    links: {
      demo: "https://example.com/uav-demo",
      report: "https://example.com/uav-report",
    },

    // ✨ ENHANCED: Metrics for Bird's AI
    metrics: {
      enabled: true,
      results: [
        {
          label: "Detection Accuracy",
          value: "95%",
          description: "Real-time human detection in disaster scenarios"
        },
        {
          label: "5G Latency",
          value: "<100ms",
          description: "End-to-end telemetry transmission time"
        },
        {
          label: "Coverage Area",
          value: "500m²",
          description: "Autonomous search area per deployment"
        },
        {
          label: "Flight Time",
          value: "25 min",
          description: "Mission duration with onboard compute"
        }
      ]
    },

    media: {
      enabled: true,
      video: {
        src: "/videos/Birdai/Birdsai.mp4",
        caption: "Nephele robots interacting with visitors at university open house"
      },
      images: [
        {
          src: "/images/projects/Birds-AI/drone.jpg",
          alt: "Nephele robot platform with sensors and display",
          caption: "Robot hardware: ROS2-enabled platform with LiDAR, camera, and interactive display"
        },
        {
          src: "/images/projects/Birds-AI/detect.png",
          alt: "Fleet management dashboard",
          caption: "Real-time  monitoring dashboard showing Survivor positions"
        }
      ]
    },

    // ✨ NEW: Simple images array for gallery
    images: [
      "/images/projects/Birds-AI/main.jpg",
      "/images/projects/Birds-AI/drone.jpg",
      "/images/projects/Birds-AI/detect.png",
    ],

    // ✨ NEW: My Role
    role: {
      enabled: true,
      position: "Full-Stack Robotics Engineer",
      responsibilities: [
        "Architected and deployed the entire AWS cloud infrastructure (IoT Core, Lambda, DynamoDB, Bedrock integration)",
        "Developed the ROS2 onboard software stack for robot perception, navigation, and cloud communication",
        "Integrated Amazon Bedrock LLM (Claude) for natural language understanding and context-aware responses",
        "Built the React-based fleet management dashboard with real-time telemetry visualization",
        "Implemented swarm coordination algorithms for task allocation and collision avoidance",
        "Managed end-to-end deployment logistics for 3 public events with 6+ hour continuous operation"
      ],
      technologies: [
        "AWS (IoT Core, Lambda, DynamoDB, S3, CloudFront, Bedrock)",
        "ROS2 (Python, rclpy)",
        "MQTT protocol",
        "React (frontend dashboard)",
        "Python (robot control, AWS SDK)",
        "LLM prompt engineering (Claude via Bedrock)"
      ]
    },

    // ✨ NEW: Architecture
    architecture: {
      enabled: true,
      diagram: "/images/projects/Birds-AI/arch.png",
      caption: "Cloud-native architecture showing drone fleet, AWS services, and data flow"
    },

    // ✨ NEW: Associated Companies
    companies: {
      enabled: true,
      list: [
        {
          name: "Nokia",
          logo: "/images/nokia.jpg",
          url: "https://www.nokia.com/"
        }

      ]
    }
  },
  //============================================== Nephele ========================================
  {
    title: "Nephele 2.0 – Interaction Robot",
    slug: "nephele-community-robot",

    description:
      "AI-powered interactive conference robot integrating hardware design, computer vision, machine learning, and AWS cloud services for real-time human interaction.",

    summary:
      "Nephele 2.0 is an intelligent, interactive robot developed under the AWS Cloud Club to enhance conferences and public events. Designed with a custom-built robotic body, precise motor control, real-time face recognition, and cloud-backed voice intelligence, Nephele delivers personalized, engaging interactions for attendees in real-world environments.",

    details: {
      problem:
        "Large conferences and public events face challenges such as limited attendee engagement, manual attendance tracking, lack of personalized assistance, and difficulty scaling human-operated help desks across large venues.",

      approach:
        "Nephele 2.0 combines embedded hardware control, computer vision, and cloud intelligence. A Raspberry Pi 5 manages real-time perception, motor control, and interaction logic. Stepper motors enable precise navigation, while camera-based vision supports face detection and gesture recognition. Machine learning models handle real-time face recognition. AWS services are integrated for speech recognition, natural language understanding, and speech synthesis, enabling seamless voice-based interaction. High-speed wireless (5G) connectivity enables coordination concepts across multiple robots.",

      outcome:
        "Nephele 2.0 successfully demonstrated reliable human–robot interaction in live conference environments. The system delivered personalized greetings, automated attendance workflows, and real-time question answering while maintaining stable performance. The modular design allowed smooth iteration from Nephele 1.0 to later versions, validating the architecture for future expansion."
    },

    tags: [
      "Robotics",
      "Embedded Systems",
      "Computer Vision",
      "Face Recognition",
      "Machine Learning",
      "Stepper Motors",
      "Raspberry Pi 5",
      "5G Connectivity",
      "AWS",
      "Human-Robot Interaction"
    ],

    links: {
      demo: "/nephele-launch",
      customButtonText: "Talk with Nephele",
      //report: "https://example.com/nephele-2-report"
    },

    metrics: {
      enabled: true,
      results: [
        {
          label: "Project Versions Led",
          value: "1.0 → 3.0",
          description: "Led development across three major iterations of Nephele"
        },
        {
          label: "Core Interaction Modes",
          value: "8+",
          description: "Face recognition, gestures, voice commands, FAQs, selfies, QR attendance"
        },
        {
          label: "User Interactions",
          value: "500+",
          description: "Unique conversational interactions across deployments"
        },
        {
          label: "Fleet Size",
          value: "3 Robots",
          description: "Simultaneous coordinated swarm deployment"
        }
      ]
    },

    role: {
      enabled: true,
      position: "Project Lead – Hardware, Robotics & AI Systems",
      responsibilities: [
        "Served as Project Lead for the Nephele initiative across versions 1.0 to 3.0",
        "Designed the complete mechanical and industrial body of the Nephele robot",
        "Implemented stepper motor control and motor mapping using Raspberry Pi 5",
        "Handled hardware integration including motors, drivers, camera, display, and power systems",
        "Developed and optimized machine learning models for real-time face detection and recognition",
        "Built computer vision pipelines for human interaction and gesture-based input",
        "Worked on 5G-based connectivity concepts for inter-robot (swarm) communication",
        "Contributed to cloud engineering by integrating AWS services for speech and AI processing",
        "Collaborated with software and cloud team members to ensure end-to-end system stability",
        "Managed hardware testing, calibration, and live deployment during events"
      ],
      technologies: [
        "Raspberry Pi 5",
        "Stepper Motors & Motor Drivers",
        "Python",
        "Computer Vision",
        "Face Detection & Recognition Models",
        "Embedded Systems",
        "5G / High-Speed Wireless Communication",
        "AWS (Bedrock, Polly, Transcribe, Rekognition)",
        "Mechanical & Industrial Design"
      ]
    },

    architecture: {
      enabled: true,
      diagram: "/images/projects/nephele-community-robot/arch.png",
      caption:
        "System architecture illustrating onboard perception, ML pipelines, and AWS cloud integration"
    },

    media: {
      enabled: true,
      videos: [
        {
          src: "/videos/Linkein (1).mp4",
          caption: "Nephele 2.0 interacting with attendees at a live conference"
        },
        {
          src: "/videos/nephele video.mp4",
          caption: "Nephele 2.0 interacting with attendees at a live conference"
        },
      ],
      images: [
        {
          src: "/images/projects/nephele-community-robot/3.jpg",
          alt: "Nephele 2.0 robot hardware",
          caption: "Custom-designed robot body with integrated sensors and display"
        },
        {
          src: "/images/projects/nephele-community-robot/8.jpeg",
          alt: "Human robot interaction",
          caption: "Face recognition and voice-based interaction in action"
        },
        {
          src: "/images/projects/nephele-community-robot/6.jpeg",
          alt: "Nephele 2.0 and Nephele 3.0",
          caption: "Nephele 2.0 and Nephele 3.0 side by side"
        },
        {
          src: "/images/projects/nephele-community-robot/7.png",
          alt: "Internal hardware setup",
          caption: "Stepper motors, Raspberry Pi 5, and internal hardware layout"
        }
      ]
    },

    images: [
      "/images/projects/nephele-community-robot/1.jpg",
      "/images/projects/nephele-community-robot/2.jpg",
      "/images/projects/nephele-community-robot/3.jpg",
      "/images/projects/nephele-community-robot/4.jpg",
      "/images/projects/nephele-community-robot/5.jpeg",
      "/images/projects/nephele-community-robot/6.jpeg",
      "/images/projects/nephele-community-robot/7.png",
      "/images/projects/nephele-community-robot/8.jpeg",
    ],

    companies: {
      enabled: true,
      list: [
        {
          name: "AWS Cloud Club",
          logo: "/images/logos/aws-cloud-club.png",
          url: "https://aws.amazon.com"
        },
        {
          name: "St. Joseph’s Group of Institutions",
          logo: "/images/logos/sjgi.png",
          url: "https://stjosephs.ac.in"
        }
      ]
    }
  },

  //============================================== 5G N/W ========================================
  {
    title: "5G Network Architecture & O-RAN Implementation",
    slug: "5g-network-implementation",

    description:
      "Comprehensive study and hands-on implementation of 5G network architecture covering evolution from 2G to 5G, O-RAN concepts, RAN/Core internals, and real-world deployment using open-source platforms.",

    summary:
      "This project involved an in-depth architectural and practical exploration of mobile network evolution from 2G to 5G, with strong emphasis on 5G RAN, O-RAN architecture, Core Network, and industry-aligned deployments. The work combined theoretical understanding with real hands-on setup of 5G RAN and Core using open-source tools, interface-level tracing, and system-level analysis.",

    details: {
      problem:
        "Understanding modern 5G networks requires more than theoretical knowledge. The shift from tightly coupled hardware-based systems to software-driven, platform-agnostic (COTS) architectures introduces complexity across RAN, Core, interfaces, splits, and orchestration layers. Bridging this gap demands hands-on exposure to real deployments and interfaces.",

      approach: [
        "Studied the evolution of mobile communication systems from 2G → 3G → 4G → 5G, including India's role in this transition",
        "Analyzed the shift from hard-coded hardware platforms to software-defined, COTS-based architectures",
        "Gained detailed understanding of 5G RAN architecture, including CU/DU separation",
        "Studied Layer 3 modules (RRC, PDCP, SDAP, RRM, OAM) and Layer 2 modules (MAC, RLC)",
        "Analyzed major 5G interfaces: NG, XN, X2, O1, E1, F1, E2, and FAPI",
        "Compared functional splits (Split 2, 6, 7.2x, 8) with their pros and cons",
        "Explored O-RAN architecture, including SMO, Non-RT RIC, Near-RT RIC, rApps, and xApps",
        "Performed hands-on deployment of 5G RAN and Core Network using open-source platforms",
        "Captured and analyzed protocol traces at different interface levels",
        "Modified source code, compiled components, and validated end-to-end call flows"
      ],

      outcome: [
        "Developed a strong architectural and practical understanding of 5G networks",
        "Gained hands-on experience in deploying and analyzing 5G RAN and Core components",
        "Understood interface-level behavior, functional splits, and network orchestration concepts",
        "Built industry-relevant skills aligned with real-world 5G deployments",
        "Established a solid foundation for future evolution toward 6G"
      ]
    },

    role: {
      position: "5G Network Engineer Intern / Trainee",
      company: "Techphosis & PEP 5G",
      duration: "Mar'24 – May'24",
      responsibilities: [
        "Studied end-to-end evolution of mobile networks from 2G to 5G and roadmap toward 6G",
        "Analyzed India’s role in the evolution and deployment of 2G, 3G, 4G, and 5G technologies",
        "Understood transition from hardware-centric platforms to software-defined, COTS-based 5G architectures",
        "Performed detailed study of 5G RAN architecture including CU and DU functional split",
        "Analyzed Layer 3 modules (RRC, PDCP, SDAP, RRM, OAM) and Layer 2 modules (MAC, RLC)",
        "Worked with all major 5G interfaces including NG, XN, X2, O1, E1, F1, E2, and FAPI",
        "Compared functional split options (Split 2, 6, 7.2x, 8) and evaluated their pros and cons",
        "Studied O-RAN architecture including SMO, Non-RT RIC, Near-RT RIC, rApps, and xApps",
        "Explored RAN orchestration, management, and standardization roles in 5G stabilization",
        "Gained detailed understanding of 5G Core Network architecture and modules such as AMF, SMF, UPF, UDM, and UDR",
        "Performed hands-on deployment of 5G RAN and Core Network using open-source tools",
        "Captured and analyzed protocol traces across different interfaces",
        "Modified source code, compiled components, and validated network behavior through practical experiments"
      ],
      technologies: [
        "5G RAN",
        "5G Core Network",
        "O-RAN Architecture",
        "Open5GS",
        "srsRAN",
        "USRP B210",
        "Software Defined Radio (SDR)",
        "Linux",
        "Protocol Analysis",
        "Network Orchestration"
      ]
    },
    architecture: {
      enabled: true,
      diagram: "/images/projects/5g-network-implementation/arch.png",
      caption:
        "System architecture illustrating onboard perception, ML pipelines, and AWS cloud integration"
    },

    media: {
      enabled: true,
      images: [
        {
          src: "/images/projects/5g-network-implementation/1.png",
          caption: "CU AND DU"
        },
        {
          src: "/images/projects/5g-network-implementation/2.png",
          caption: "USRP B210 RADIO"
        },
      ]
    },


    tags: [
      "5G",
      "O-RAN",
      "5G RAN",
      "5G Core",
      "CU/DU Architecture",
      "RIC",
      "SMO",
      "rApps & xApps",
      "COTS Platforms",
      "Open5GS",
      "srsRAN",
      "USRP B210",
      "SDR",
      "Linux"
    ],

    //links: {
    //report: "https://example.com/5g-report"
    //},

    images: [
      "/images/projects/5g-network-implementation/1.png",
      "/images/projects/5g-network-implementation/2.png"
    ],

    companies: {
      enabled: true,
      list: [
        {
          name: "Techphosis",
          logo: "/images/logos/techphosis.png",
          url: "https://techphosis.com"
        },
        {
          name: "PEP 5G",
          logo: "/images/logos/pep5g.png",
          url: "https://pep5g.com"
        }
      ]
    }
  },

  //============================================== DEMS ========================================
  {
    title: "DEMS – Domestic Emotion Monitoring System",
    slug: "emotion-monitoring-system",

    description:
      "An embedded AI-powered emotion detection system on STM32 microcontroller for mental health assessment, providing real-time facial expression analysis to aid psychiatrists in diagnosis and patient monitoring.",

    summary:
      "DEMS (Domestic Emotion Monitoring System) is an innovative embedded AI solution designed to revolutionize mental health evaluation. Built on STM32MP135F-DK microcontroller with TensorFlow Lite, the system analyzes facial expressions in real-time to predict emotions (angry, happy, sad, neutral), providing psychiatrists with data-driven insights and graphical analysis to accelerate diagnosis and improve patient outcomes.",

    details: {
      problem:
        "Mental health disorders affect millions globally, with 43.8 million adults experiencing mental illness annually and 5.6 crore Indians suffering from depression and other mental disorders according to WHO. The diagnosis process for mental health conditions is time-consuming, often taking weeks or even years, purely based on the psychiatrist's subjective perspective. Countless hours are wasted analyzing patients with mental disorders due to lack of objective, data-driven assessment tools. The variation of emotions can be measured from an individual's past data, but current methods lack systematic tracking and analysis capabilities to speed up the diagnostic process.",

      approach: [
        "Designed and implemented an embedded AI system on STM32MP135F-DK microcontroller (Arm Cortex-A7, 1GHz) for real-time emotion detection",
        "Developed facial expression analysis using TensorFlow Lite optimized for resource-constrained embedded hardware",
        "Implemented emotion classification model to predict four emotions: angry, happy, sad, and neutral",
        "Created both web application (using Streamlit) and mobile application (using MIT App Inventor) for multi-platform accessibility",
        "Integrated HP Webcam 720p W100 for high-quality facial image capture and real-time processing",
        "Developed data storage and tracking system using 64GB SanDisk SD card for patient emotion history",
        "Implemented graphical analysis and visualization of emotion patterns over time",
        "Optimized deep learning model for low-power embedded systems with tight memory and power constraints",
        "Utilized Linux OS and PyCharm for development, with GitHub for version control",
        "Designed system to provide insights to doctors prior to consultation and aid during investigation"
      ],

      outcome: [
        "Successfully deployed real-time emotion detection system on embedded STM32 microcontroller platform",
        "Achieved efficient inference within tight memory and power constraints of embedded hardware",
        "Developed dual-platform solution with both web and mobile applications for flexible access",
        "Created data-driven diagnostic support tool that speeds up mental health diagnosis process",
        "Provided psychiatrists with objective emotion tracking and graphical analysis capabilities",
        "Aligned with UN Sustainable Development Goal 3 (Good Health and Well-being)",
        "Received expert validation from Dr. A. Turin Martina, Head of P.G and Research, Department of Rehabilitation Science",
        "Demonstrated working prototype with complete product demonstration",
        "Achieved project completion within budget of ₹15,000 INR"
      ]
    },

    role: {
      enabled: true,
      position: "Team Lead & Embedded AI Engineer",
      company: "St. Joseph's College of Engineering",
      duration: "Academic Project",
      responsibilities: [
        "Led a team of 5 members (Team Ravagers) in developing the DEMS system from concept to deployment",
        "Architected the embedded AI solution on STM32MP135F-DK microcontroller platform",
        "Implemented and optimized TensorFlow Lite models for real-time emotion detection on resource-constrained hardware",
        "Developed facial expression analysis algorithms to classify emotions (angry, happy, sad, neutral)",
        "Designed and implemented the web application using Streamlit for desktop access",
        "Coordinated mobile application development using MIT App Inventor for on-the-go monitoring",
        "Integrated camera hardware (HP Webcam 720p) with embedded system for real-time image capture",
        "Implemented data storage and retrieval system using SD card for patient emotion history tracking",
        "Created graphical analysis and visualization features for emotion pattern recognition",
        "Managed project budget (₹15,000) covering STM32 board, HD cameras, and miscellaneous expenses",
        "Coordinated with mental health expert Dr. A. Turin Martina for system validation and feedback",
        "Prepared comprehensive project documentation and product demonstration materials"
      ],
      technologies: [
        "STM32MP135F-DK Microcontroller",
        "TensorFlow Lite",
        "Embedded AI",
        "Arm Cortex-A7",
        "Python",
        "PyCharm",
        "Streamlit",
        "MIT App Inventor",
        "Linux OS",
        "Computer Vision",
        "Deep Learning",
        "GitHub"
      ]
    },

    metrics: {
      enabled: true,
      results: [
        {
          label: "Emotions Detected",
          value: "4 Types",
          description: "Angry, Happy, Sad, and Neutral classifications"
        },
        {
          label: "Platform",
          value: "STM32MP135F",
          description: "Arm Cortex-A7 @ 1GHz embedded system"
        },
        {
          label: "Team Size",
          value: "5 Members",
          description: "Cross-functional team collaboration"
        },
        {
          label: "Applications",
          value: "Web + Mobile",
          description: "Dual-platform accessibility"
        },
        {
          label: "Processing",
          value: "Real-time",
          description: "Live facial expression analysis"
        },
        {
          label: "Budget",
          value: "₹15,000",
          description: "Cost-effective embedded AI solution"
        },
        {
          label: "SDG Alignment",
          value: "Goal 3",
          description: "Good Health and Well-being"
        },
        {
          label: "Expert Validated",
          value: "✓",
          description: "Approved by rehabilitation science expert"
        }
      ]
    },

    tags: [
      "Embedded AI",
      "STM32",
      "TensorFlow Lite",
      "Mental Health",
      "Emotion Detection",
      "Computer Vision",
      "Deep Learning",
      "Embedded Systems",
      "Healthcare Technology",
      "Real-time Processing",
      "Arm Cortex-A7"
    ],

    links: {
      demo: "https://drive.google.com/file/d/1iBJ43BQU1Wp7gb67GP0Ilq6eSw1Zdu48/view?usp=sharing"
    },

    images: [
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
          src: "/images/projects/emotion-monitoring-system/7.jpeg",
          caption: "STM32MP135F-DK BOARD Working Environment"
        },
        {
          src: "/images/projects/emotion-monitoring-system/1.jpg",
          caption: "STM32MP135F-DK BOARD"
        },
        {
          src: "/images/projects/emotion-monitoring-system/8.png",
          caption: "FACE REC SYSTEM"
        },
        {
          src: "/images/projects/emotion-monitoring-system/5.png",
          caption: "Doctor Login dashboard"
        },
        {
          src: "/images/projects/emotion-monitoring-system/2.png",
          caption: "Emotion Detection Logs of Patient"
        },
        {
          src: "/images/projects/emotion-monitoring-system/3.png",
          caption: "Emotional Analysis Prediction of Patient"
        },
        {
          src: "/images/projects/emotion-monitoring-system/4.png",
          caption: "Emotional Analysis of Patient"
        },
      ]
    },

    companies: {
      enabled: true,
      list: [
        {
          name: "St. Joseph's College of Engineering",
          logo: "/images/logos/sjce.png",
          url: "https://www.sjce.ac.in"
        }
      ]
    }
  },
  //============================================== BPF ========================================
  {
    title: "Miniaturized Dual-Mode Terahertz Bandpass Filter",
    slug: "thz-bandpass-filter",

    description:
      "Design and implementation of a miniaturized dual-mode terahertz bandpass filter based on Swastik slotted fractals for next-generation communication and medical imaging applications.",

    summary:
      "This project presents the design of a miniaturized bandpass filter featuring a square patch perturbed microstrip resonator configuration with Swastik fractal slots for applications in the terahertz regime. The dual-mode behavior demonstrates two transmission zeros on the passband edges, leading to substantial improvement in selectivity while achieving significant size reduction through fractal geometry integration.",

    details: {
      problem:
        "Terahertz systems rely on bandpass filters to reduce interference and ensure signal clarity by selectively allowing specific frequency bands to pass. However, designing such filter structures requires innovative approaches to overcome material and structural limitations. Conventional filter designs at terahertz frequencies face challenges in achieving compact size while maintaining high selectivity, low insertion loss, and good return loss. The shift to terahertz spectrum for next-generation communication systems and medical imaging applications demands miniaturized, high-performance filtering solutions that can be cost-effectively integrated into terahertz systems.",

      approach: [
        "Designed a square patch perturbed microstrip resonator configuration using RT/Duroid 6010 substrate with high relative permittivity (εr = 10.7)",
        "Integrated Swastik fractal slots into the resonator structure through three iterations to achieve miniaturization without compromising filter characteristics",
        "Implemented dual-mode functionality by placing a square perturbation at 45° angle relative to the 50 Ω feedlines, aligned with diagonal symmetry plane",
        "Optimized filter dimensions including perturbation size (2 μm) and gap size (0.1 μm) for enhanced return loss, insertion loss, and selectivity",
        "Utilized full-wave electromagnetic simulator (CST Microwave Studio) for design, simulation, and performance analysis",
        "Analyzed S-parameters, group delay, current distribution, and optical spectra to validate filter performance",
        "Studied the evolution from zeroth iteration (conventional square patch) through three fractal iterations to achieve optimal performance",
        "Evaluated the impact of gap size and perturbation size variations on dual-mode splitting behavior and frequency response"
      ],

      outcome: [
        "Achieved a miniaturized filter design measuring only 8 × 8 μm² with significant 25.93% reduction in patch size compared to conventional design",
        "Demonstrated excellent performance at 3.88 THz with return loss exceeding 38.32 dB and low insertion loss of 1.63 dB",
        "Realized dual-mode behavior with two transmission zeros at 2.86 THz and 5.14 THz providing 33.10 dB and 24.63 dB suppression levels",
        "Obtained narrow 3-dB bandwidth of 0.788 THz with fractional bandwidth of 20.3%, indicating high selectivity",
        "Achieved 70% transmittance at resonance with minimal group delay of 0.8 ps, ensuring excellent signal linearity",
        "Published research findings in Journal of Optics (Springer), contributing to terahertz filter design knowledge"
      ]
    },

    role: {
      enabled: true,
      position: "Co-Author & RF Design Engineer",
      company: "SSN College of Engineering & St. Joseph's College of Engineering",
      duration: "Research Project",
      responsibilities: [
        "Co-designed the miniaturized dual-mode terahertz bandpass filter with Swastik fractal slot integration",
        "Performed electromagnetic simulations using CST Microwave Studio for filter design and optimization",
        "Analyzed and optimized filter parameters including gap size, perturbation size, and fractal iterations",
        "Conducted comprehensive S-parameter analysis to evaluate insertion loss, return loss, and transmission zeros",
        "Studied dual-mode splitting behavior and coupling coefficient variations with perturbation size",
        "Evaluated group delay characteristics and current distribution patterns at different frequencies",
        "Analyzed optical spectra including transmittance, reflectance, and absorbance characteristics",
        "Performed comparative analysis with existing terahertz bandpass filter designs",
        "Contributed to research paper preparation and publication in Journal of Optics (Springer)",
        "Validated filter performance metrics including selectivity, miniaturization, and frequency response"
      ],
      technologies: [
        "CST Microwave Studio",
        "Terahertz Technology",
        "Microstrip Resonator Design",
        "Fractal Geometry",
        "RT/Duroid 6010 Substrate",
        "Electromagnetic Simulation",
        "S-Parameter Analysis",
        "Dual-Mode Filter Design",
        "RF Circuit Design",
        "MATLAB"
      ]
    },

    metrics: {
      enabled: true,
      results: [
        {
          label: "Operating Frequency",
          value: "3.88 THz",
          description: "Center frequency in terahertz regime"
        },
        {
          label: "Return Loss",
          value: "38.32 dB",
          description: "Excellent impedance matching performance"
        },
        {
          label: "Insertion Loss",
          value: "1.63 dB",
          description: "Minimal signal loss in passband"
        },
        {
          label: "Size Reduction",
          value: "25.93%",
          description: "Miniaturization achieved through fractal slots"
        },
        {
          label: "Filter Size",
          value: "8×8 μm²",
          description: "Ultra-compact footprint for integration"
        },
        {
          label: "Transmittance",
          value: "70%",
          description: "Signal transmission efficiency at resonance"
        },
        {
          label: "Bandwidth",
          value: "0.788 THz",
          description: "Narrow 3-dB bandwidth for high selectivity"
        },
        {
          label: "Group Delay",
          value: "0.8 ps",
          description: "Minimal delay ensuring signal linearity"
        }
      ]
    },

    tags: [
      "Terahertz Technology",
      "RF Design",
      "Fractal Geometry",
      "Bandpass Filter",
      "CST Microwave Studio",
      "Microstrip Resonator",
      "Dual-Mode Filter",
      "Medical Imaging",
      "5G/6G Communications",
      "Electromagnetic Simulation"
    ],

    links: {
      report: "/papers/SSN PAPER.pdf"
    },

    images: [
      "/images/projects/thz-bandpass-filter/cst.png",
      "/images/projects/thz-bandpass-filter/struct.png",
      "/images/projects/thz-bandpass-filter/SingleDual.png",
      "/images/projects/thz-bandpass-filter/2.86 left Tz.png",
      "/images/projects/thz-bandpass-filter/3.88 CF.png",
      "/images/projects/thz-bandpass-filter/5.1415 Right Tz.png",
      "/images/projects/thz-bandpass-filter/Transmittance.png",
      "/images/projects/thz-bandpass-filter/FinalIteration.png",

    ],
    media: {
      enabled: true,
      images: [
        {
          src: "/images/projects/thz-bandpass-filter/cst.png",
          caption: "3D view of Filter"
        },
        {
          src: "/images/projects/thz-bandpass-filter/struct.png",
          caption: "2D view of Filter"
        },
        {
          src: "/images/projects/thz-bandpass-filter/SingleDual.png",
          caption: "2D view of Filter"
        },

        {
          src: "/images/projects/thz-bandpass-filter/2.86 left Tz.png",
          caption: "Surface Current at Resonating Frequency 2.86THz"
        },
        {
          src: "/images/projects/thz-bandpass-filter/3.88 CF.png",
          caption: "Surface Current at TARGET Resonating Frequency 3.88THz"
        },

        {
          src: "/images/projects/thz-bandpass-filter/5.1415 Right Tz.png",
          caption: "Surface Current at Resonating Frequency 5.1415THz"
        },
        {
          src: "/images/projects/thz-bandpass-filter/S-parameters.png",
          caption: "S-parameters of Filter of 4 Iterations"
        },
        {
          src: "/images/projects/thz-bandpass-filter/FinalIteration.png",
          caption: "S-parameters of Filter of Final Iteration"
        },
        {
          src: "/images/projects/thz-bandpass-filter/SM_&_DM.png",
          caption: "S-Parameter of Single and Dual Mode Filters"
        },
        {
          src: "/images/projects/thz-bandpass-filter/Transmittance.png",
          caption: "Transmittance of Filter"
        },


      ]
    },
    companies: {
      enabled: true,
      list: [
        {
          name: "SSN College of Engineering",
          logo: "/images/logos/ssn.png",
          url: "https://www.ssn.edu.in"
        },
        {
          name: "St. Joseph's College of Engineering",
          logo: "/images/logos/sjce.png",
          url: "https://www.sjce.ac.in"
        }
      ]
    }
  },

];

export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug);
}