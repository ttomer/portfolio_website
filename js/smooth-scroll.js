// Smooth Scroll Navigation with Active Section Highlighting
class SmoothScrollNavigation {
    constructor() {
        this.sections = document.querySelectorAll('section[id], section[class*="section"]');
        this.navigationLinks = [];
        this.currentSection = '';
        this.isScrolling = false;
        
        this.init();
    }

    init() {
        // Skip initialization on mobile devices to allow natural scrolling
        if (window.innerWidth <= 768) {
            return;
        }
        
        this.createNavigationDots();
        this.bindEvents();
        this.updateActiveSection();
    }

    createNavigationDots() {
        // Create floating navigation dots
        const nav = document.createElement('nav');
        nav.className = 'scroll-navigation';
        nav.setAttribute('aria-label', 'Page navigation');

        const sections = [
            { id: 'hero', label: 'Home' },
            { id: 'about', label: 'About', selector: '.profile-section' },
            { id: 'projects', label: 'Projects', selector: '.projects-section' },
            { id: 'experience', label: 'Experience', selector: '.experience-section' },
            { id: 'skills', label: 'Skills', selector: '.skills-section' },
            { id: 'contact', label: 'Contact', selector: '.contact-section' }
        ];

        sections.forEach(section => {
            const button = document.createElement('button');
            button.className = 'nav-dot';
            button.setAttribute('data-section', section.id);
            button.setAttribute('aria-label', `Go to ${section.label} section`);
            button.setAttribute('title', section.label);
            
            const dot = document.createElement('span');
            dot.className = 'dot';
            button.appendChild(dot);
            
            const label = document.createElement('span');
            label.className = 'nav-label';
            label.textContent = section.label;
            button.appendChild(label);
            
            nav.appendChild(button);
            this.navigationLinks.push({
                button,
                sectionId: section.id,
                selector: section.selector || `.${section.id}`,
                element: null
            });
        });

        document.body.appendChild(nav);
    }

    bindEvents() {
        // Bind click events to navigation dots
        this.navigationLinks.forEach(link => {
            link.button.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToSection(link.sectionId, link.selector);
            });
        });

        // Throttled scroll event for performance
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = requestAnimationFrame(() => {
                if (!this.isScrolling) {
                    this.updateActiveSection();
                }
            });
        }, { passive: true });

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.navigateByKeyboard(e.key === 'ArrowDown' ? 1 : -1);
                }
            }
        });
    }

    scrollToSection(sectionId, selector) {
        const targetElement = sectionId === 'hero' ? 
            document.querySelector('.hero') : 
            document.querySelector(selector);
        
        if (targetElement) {
            this.isScrolling = true;
            
            const targetPosition = targetElement.offsetTop;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = Math.min(Math.abs(distance) / 2, 1000); // Max 1 second
            
            this.animateScroll(startPosition, distance, duration);
        }
    }

    animateScroll(startPosition, distance, duration) {
        let startTime = null;
        
        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Easing function (ease-in-out-cubic)
            const easedProgress = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            window.scrollTo(0, startPosition + distance * easedProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animation);
            } else {
                this.isScrolling = false;
            }
        };
        
        requestAnimationFrame(animation);
    }

    updateActiveSection() {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        let activeSection = '';

        // Find the current section
        this.navigationLinks.forEach(link => {
            const element = link.sectionId === 'hero' 
                ? document.querySelector('.hero')
                : document.querySelector(link.selector);
            
            if (element) {
                const sectionTop = element.offsetTop;
                const sectionBottom = sectionTop + element.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                    activeSection = link.sectionId;
                }
            }
        });

        // Update active states
        if (activeSection !== this.currentSection) {
            this.currentSection = activeSection;
            this.updateNavigationState(activeSection);
        }
    }

    updateNavigationState(activeSection) {
        this.navigationLinks.forEach(link => {
            const isActive = link.sectionId === activeSection;
            link.button.classList.toggle('active', isActive);
            link.button.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
    }

    navigateByKeyboard(direction) {
        const currentIndex = this.navigationLinks.findIndex(
            link => link.sectionId === this.currentSection
        );
        
        if (currentIndex !== -1) {
            const nextIndex = Math.max(0, Math.min(
                this.navigationLinks.length - 1,
                currentIndex + direction
            ));
            
            const nextLink = this.navigationLinks[nextIndex];
            if (nextLink) {
                this.scrollToSection(nextLink.sectionId, nextLink.selector);
            }
        }
    }
}

// Initialize smooth scroll navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    let smoothScroll = new SmoothScrollNavigation();
    
    // Handle resize events to enable/disable smooth scrolling
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            // Remove navigation on mobile
            const nav = document.querySelector('.scroll-navigation');
            if (nav) {
                nav.remove();
            }
        } else if (!document.querySelector('.scroll-navigation')) {
            // Re-initialize on desktop
            smoothScroll = new SmoothScrollNavigation();
        }
    });
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmoothScrollNavigation;
}