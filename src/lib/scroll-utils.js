/**
 * Centralized Scroll Management System
 * 
 * This utility provides a single, throttled scroll event listener
 * that manages scroll state and notifies subscribed components.
 * This eliminates the need for multiple scroll listeners and
 * reduces DOM queries for better performance.
 */

class ScrollManager {
    constructor() {
        this.subscribers = new Set();
        this.scrollState = {
            scrollY: 0,
            scrollProgress: 0,
            activeSection: null,
            isScrolled: false,
        };
        this.sections = [];
        this.isInitialized = false;
        this.rafId = null;
        this.lastScrollTime = 0;
    }

    /**
     * Initialize the scroll manager
     * Caches section references and sets up the scroll listener
     */
    init(sectionIds = []) {
        if (this.isInitialized) return;

        // Cache section references
        this.sections = sectionIds
            .map((id) => {
                const element = document.getElementById(id);
                return element ? { id, element } : null;
            })
            .filter(Boolean);

        // Add throttled scroll listener
        window.addEventListener("scroll", this.handleScroll, { passive: true });

        // Initial calculation
        this.updateScrollState();

        this.isInitialized = true;
    }

    /**
     * Throttled scroll handler using requestAnimationFrame
     */
    handleScroll = () => {
        if (this.rafId) return;

        this.rafId = requestAnimationFrame(() => {
            this.updateScrollState();
            this.rafId = null;
        });
    };

    /**
     * Update scroll state and notify subscribers
     */
    updateScrollState() {
        const now = performance.now();

        // Throttle to ~60fps (16ms)
        if (now - this.lastScrollTime < 16) return;
        this.lastScrollTime = now;

        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollProgress = documentHeight > 0 ? (scrollY / documentHeight) * 100 : 0;
        const isScrolled = scrollY > 50;

        // Find active section
        const scrollPosition = scrollY + windowHeight / 3;
        let activeSection = null;

        for (let i = this.sections.length - 1; i >= 0; i--) {
            const section = this.sections[i];
            if (section.element.offsetTop <= scrollPosition) {
                activeSection = section.id;
                break;
            }
        }

        // Update state
        const prevState = { ...this.scrollState };
        this.scrollState = {
            scrollY,
            scrollProgress,
            activeSection,
            isScrolled,
            windowHeight,
            documentHeight,
        };

        // Notify subscribers only if state changed
        if (
            prevState.scrollY !== scrollY ||
            prevState.activeSection !== activeSection ||
            prevState.isScrolled !== isScrolled
        ) {
            this.notifySubscribers();
        }
    }

    /**
     * Subscribe to scroll updates
     * @param {Function} callback - Function to call on scroll updates
     * @returns {Function} Unsubscribe function
     */
    subscribe(callback) {
        this.subscribers.add(callback);

        // Immediately call with current state
        callback(this.scrollState);

        // Return unsubscribe function
        return () => {
            this.subscribers.delete(callback);
        };
    }

    /**
     * Notify all subscribers of state changes
     */
    notifySubscribers() {
        this.subscribers.forEach((callback) => {
            callback(this.scrollState);
        });
    }

    /**
     * Get current scroll state
     */
    getState() {
        return { ...this.scrollState };
    }

    /**
     * Smooth scroll to a section
     * @param {string} sectionId - ID of the section to scroll to
     */
    scrollToSection(sectionId) {
        const section = this.sections.find((s) => s.id === sectionId);
        if (section) {
            section.element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    /**
     * Smooth scroll to top
     */
    scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    /**
     * Clean up the scroll manager
     */
    destroy() {
        window.removeEventListener("scroll", this.handleScroll);
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        this.subscribers.clear();
        this.isInitialized = false;
    }
}

// Create singleton instance
const scrollManager = new ScrollManager();

// Default section IDs for the portfolio
export const DEFAULT_SECTIONS = [
    "hero",
    "about",
    "work",
    "achievements",
    "internships",
    "skills",
    "certifications",
    "publications",
    "education",
    "contact",
];

export default scrollManager;
