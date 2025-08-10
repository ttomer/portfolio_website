// Mobile Gestures and Touch Interactions
class MobileGestures {
    constructor() {
        this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.currentProjectIndex = 0;
        this.projects = [];
        
        if (this.isTouchDevice) {
            this.init();
        }
    }

    init() {
        this.setupTouchEvents();
        this.setupProjectSwipe();
        this.improveTouchTargets();
        this.addTouchFeedback();
        this.handleOrientationChange();
    }

    setupTouchEvents() {
        // Global touch event handlers
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
        
        // Prevent zoom on double tap for specific elements
        document.querySelectorAll('.project-card, .skill-category, .timeline-item').forEach(el => {
            el.addEventListener('touchend', this.preventDoubleTabZoom.bind(this));
        });
    }

    setupProjectSwipe() {
        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid) return;

        this.projects = Array.from(document.querySelectorAll('.project-card'));
        
        // Make projects grid swipeable on mobile
        projectsGrid.addEventListener('touchstart', this.handleProjectTouchStart.bind(this), { passive: true });
        projectsGrid.addEventListener('touchmove', this.handleProjectTouchMove.bind(this), { passive: false });
        projectsGrid.addEventListener('touchend', this.handleProjectTouchEnd.bind(this), { passive: true });
    }

    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
        this.touchStartY = e.changedTouches[0].screenY;
    }

    handleTouchMove(e) {
        // Prevent scrolling on horizontal swipes in project area
        const target = e.target.closest('.projects-grid');
        if (target) {
            const touchX = e.changedTouches[0].screenX;
            const touchY = e.changedTouches[0].screenY;
            const diffX = Math.abs(touchX - this.touchStartX);
            const diffY = Math.abs(touchY - this.touchStartY);
            
            if (diffX > diffY && diffX > 10) {
                e.preventDefault();
            }
        }
    }

    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.touchEndY = e.changedTouches[0].screenY;
        this.handleGesture();
    }

    handleProjectTouchStart(e) {
        this.projectTouchStartX = e.changedTouches[0].screenX;
        this.projectTouchStartTime = Date.now();
    }

    handleProjectTouchMove(e) {
        if (!this.projectTouchStartX) return;
        
        const currentTouchX = e.changedTouches[0].screenX;
        const diffX = this.projectTouchStartX - currentTouchX;
        
        // Add visual feedback for swipe
        if (Math.abs(diffX) > 10) {
            e.target.closest('.project-card')?.classList.add('swiping');
        }
    }

    handleProjectTouchEnd(e) {
        if (!this.projectTouchStartX) return;
        
        const touchEndX = e.changedTouches[0].screenX;
        const diffX = this.projectTouchStartX - touchEndX;
        const timeDiff = Date.now() - this.projectTouchStartTime;
        
        // Remove swiping visual feedback
        document.querySelectorAll('.project-card').forEach(card => {
            card.classList.remove('swiping');
        });
        
        // Only register swipe if it's fast enough and far enough
        if (timeDiff < 500 && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                this.nextProject();
            } else {
                this.previousProject();
            }
        }
        
        this.projectTouchStartX = null;
        this.projectTouchStartTime = null;
    }

    handleGesture() {
        const diffX = this.touchStartX - this.touchEndX;
        const diffY = this.touchStartY - this.touchEndY;
        
        // Minimum swipe distance
        const minSwipeDistance = 50;
        
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe
            if (Math.abs(diffX) > minSwipeDistance) {
                if (diffX > 0) {
                    this.onSwipeLeft();
                } else {
                    this.onSwipeRight();
                }
            }
        } else {
            // Vertical swipe
            if (Math.abs(diffY) > minSwipeDistance) {
                if (diffY > 0) {
                    this.onSwipeUp();
                } else {
                    this.onSwipeDown();
                }
            }
        }
    }

    onSwipeLeft() {
        // Navigate to next section or close modal
        const modal = document.querySelector('.project-modal[style*="block"]');
        if (modal) {
            modal.querySelector('.close-modal')?.click();
        }
    }

    onSwipeRight() {
        // Navigate to previous section or open menu
        console.log('Swipe right detected');
    }

    onSwipeUp() {
        // Scroll to next section
        this.scrollToNextSection();
    }

    onSwipeDown() {
        // Scroll to previous section
        this.scrollToPreviousSection();
    }

    nextProject() {
        if (this.projects.length === 0) return;
        
        this.currentProjectIndex = (this.currentProjectIndex + 1) % this.projects.length;
        this.scrollToProject(this.currentProjectIndex);
        this.addHapticFeedback();
    }

    previousProject() {
        if (this.projects.length === 0) return;
        
        this.currentProjectIndex = this.currentProjectIndex === 0 
            ? this.projects.length - 1 
            : this.currentProjectIndex - 1;
        this.scrollToProject(this.currentProjectIndex);
        this.addHapticFeedback();
    }

    scrollToProject(index) {
        const project = this.projects[index];
        if (project) {
            project.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
            
            // Add temporary highlight
            project.classList.add('project-highlight');
            setTimeout(() => {
                project.classList.remove('project-highlight');
            }, 1000);
        }
    }

    scrollToNextSection() {
        const sections = Array.from(document.querySelectorAll('section'));
        const currentScrollY = window.scrollY;
        
        const nextSection = sections.find(section => 
            section.offsetTop > currentScrollY + 100
        );
        
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
            this.addHapticFeedback();
        }
    }

    scrollToPreviousSection() {
        const sections = Array.from(document.querySelectorAll('section')).reverse();
        const currentScrollY = window.scrollY;
        
        const previousSection = sections.find(section => 
            section.offsetTop < currentScrollY - 100
        );
        
        if (previousSection) {
            previousSection.scrollIntoView({ behavior: 'smooth' });
            this.addHapticFeedback();
        }
    }

    preventDoubleTabZoom(e) {
        const now = Date.now();
        if (this.lastTap && (now - this.lastTap) < 300) {
            e.preventDefault();
        }
        this.lastTap = now;
    }

    improveTouchTargets() {
        // Ensure touch targets are at least 44px (iOS guideline)
        const touchTargets = document.querySelectorAll(
            'button, a, .tech-item, .timeline-skill, .nav-dot'
        );
        
        touchTargets.forEach(target => {
            const rect = target.getBoundingClientRect();
            if (rect.width < 44 || rect.height < 44) {
                target.style.minWidth = '44px';
                target.style.minHeight = '44px';
                target.style.display = target.style.display || 'inline-flex';
                target.style.alignItems = 'center';
                target.style.justifyContent = 'center';
            }
        });
    }

    addTouchFeedback() {
        // Add visual feedback for touch interactions
        const interactiveElements = document.querySelectorAll(
            'button, a, .project-card, .tech-item, .timeline-skill'
        );
        
        interactiveElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.classList.add('touch-active');
            });
            
            element.addEventListener('touchend', () => {
                setTimeout(() => {
                    element.classList.remove('touch-active');
                }, 150);
            });
            
            element.addEventListener('touchcancel', () => {
                element.classList.remove('touch-active');
            });
        });
    }

    addHapticFeedback() {
        // Add haptic feedback for supported devices
        if (navigator.vibrate) {
            navigator.vibrate(50); // 50ms vibration
        }
    }

    handleOrientationChange() {
        window.addEventListener('orientationchange', () => {
            // Force re-layout after orientation change
            setTimeout(() => {
                window.scrollTo(0, window.scrollY);
                this.projects = Array.from(document.querySelectorAll('.project-card'));
            }, 500);
        });
    }
}

// Initialize mobile gestures when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MobileGestures();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileGestures;
}