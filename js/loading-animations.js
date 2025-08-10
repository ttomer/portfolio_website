// Loading Animations and Skeleton Screens
class LoadingAnimations {
    constructor() {
        // Prevent multiple instances
        if (window.loadingAnimationsInstance) {
            return window.loadingAnimationsInstance;
        }
        
        this.isLoading = true;
        this.currentProgress = 0;
        this.overlay = null;
        this.animationStarted = false;
        this.hideTimer = null;
        
        window.loadingAnimationsInstance = this;
        this.init();
    }

    init() {
        this.createLoadingOverlay();
        this.startProgressAnimation();
        this.observeElementsForAnimation();
        
        // Simple timer-based approach
        this.hideTimer = setTimeout(() => {
            this.hideLoadingOverlay();
        }, 2500); // 2.5 seconds total
    }

    createLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-container">
                <div class="loading-logo">
                    <div class="glitch-loading">
                        TOMER TORGEMAN
                        <span>TOMER TORGEMAN</span>
                        <span>TOMER TORGEMAN</span>
                    </div>
                </div>
                <div class="loading-progress">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <div class="loading-text">Loading Portfolio...</div>
                    <div class="loading-percentage">0%</div>
                </div>
                <div class="loading-particles">
                    ${Array(20).fill().map((_, i) => 
                        `<div class="particle" style="left: ${Math.random() * 100}%; top: ${Math.random() * 100}%; animation-delay: ${Math.random() * 3}s;"></div>`
                    ).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        this.overlay = overlay;
        this.progressBar = overlay.querySelector('.progress-fill');
        this.progressText = overlay.querySelector('.loading-percentage');
        this.loadingText = overlay.querySelector('.loading-text');
        
    }

    startProgressAnimation() {
        let progress = 0;
        const duration = 2000; // 2 seconds
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progressPercent = Math.min((elapsed / duration) * 100, 100);
            
            this.updateProgress(progressPercent);
            
            if (progressPercent < 100 && this.isLoading) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    updateProgress(progress) {
        if (progress <= this.currentProgress) return;
        
        this.currentProgress = Math.min(progress, 100);
        
        if (this.progressBar && this.progressText) {
            this.progressBar.style.width = `${this.currentProgress}%`;
            this.progressText.textContent = `${Math.round(this.currentProgress)}%`;
            
            // Update loading text based on progress
            if (this.loadingText) {
                if (this.currentProgress < 30) {
                    this.loadingText.textContent = 'Loading Portfolio...';
                } else if (this.currentProgress < 60) {
                    this.loadingText.textContent = 'Loading Assets...';
                } else if (this.currentProgress < 90) {
                    this.loadingText.textContent = 'Almost Ready...';
                } else {
                    this.loadingText.textContent = 'Welcome!';
                }
            }
        }
    }

    hideLoadingOverlay() {
        if (!this.isLoading || !this.overlay || this.animationStarted) {
            return;
        }
        
        this.isLoading = false;
        this.animationStarted = true;
        
        // Clear any existing timer
        if (this.hideTimer) {
            clearTimeout(this.hideTimer);
            this.hideTimer = null;
        }
        
        // Final progress update
        this.updateProgress(100);
        
        // Start the name transition immediately
        this.startNameTransition();
    }

    startNameTransition() {
        console.log('Starting INTENSE seamless name transition');
        
        const loadingName = this.overlay?.querySelector('.glitch-loading');
        const heroName = document.querySelector('.hero .glitch');
        
        if (!loadingName || !heroName) {
            console.error('Loading name or hero name element not found');
            this.fallbackHideOverlay();
            return;
        }

        // Step 0: Instantly fade out progress and particles
        const progressEl = this.overlay?.querySelector('.loading-progress');
        const particlesEl = this.overlay?.querySelector('.loading-particles');
        
        if (progressEl) progressEl.style.opacity = '0';
        if (particlesEl) particlesEl.style.opacity = '0';
        
        // Step 1: First, remove any existing duplicate elements from previous transitions
        document.querySelectorAll('.morphing-clone').forEach(clone => clone.remove());
        
        // Create perfect clone for seamless handoff
        requestAnimationFrame(() => {
            // Create temporary text measurement elements to get EXACT text size without spans
            const measureLoading = document.createElement('div');
            measureLoading.textContent = 'TOMER TORGEMAN';
            measureLoading.style.position = 'absolute';
            measureLoading.style.visibility = 'hidden';
            measureLoading.style.whiteSpace = 'nowrap';
            measureLoading.style.fontSize = window.getComputedStyle(loadingName).fontSize;
            measureLoading.style.fontWeight = window.getComputedStyle(loadingName).fontWeight;
            measureLoading.style.fontFamily = window.getComputedStyle(loadingName).fontFamily;
            measureLoading.style.letterSpacing = window.getComputedStyle(loadingName).letterSpacing;
            document.body.appendChild(measureLoading);
            
            const measureHero = document.createElement('div');
            measureHero.textContent = 'TOMER TORGEMAN';
            measureHero.style.position = 'absolute';
            measureHero.style.visibility = 'hidden';
            measureHero.style.whiteSpace = 'nowrap';
            measureHero.style.fontSize = window.getComputedStyle(heroName).fontSize;
            measureHero.style.fontWeight = window.getComputedStyle(heroName).fontWeight;
            measureHero.style.fontFamily = window.getComputedStyle(heroName).fontFamily;
            measureHero.style.letterSpacing = window.getComputedStyle(heroName).letterSpacing;
            document.body.appendChild(measureHero);
            
            // Get PURE text measurements without glitch effects
            const loadingTextRect = measureLoading.getBoundingClientRect();
            const heroTextRect = measureHero.getBoundingClientRect();
            
            // Clean up measurement elements
            measureLoading.remove();
            measureHero.remove();
            
            // Get actual element positions for the morphing animation
            const loadingRect = loadingName.getBoundingClientRect();
            const heroRect = heroName.getBoundingClientRect();
            
            // Calculate center-to-center movement with sub-pixel precision
            const loadingCenterX = loadingRect.left + loadingRect.width / 2;
            const loadingCenterY = loadingRect.top + loadingRect.height / 2;
            const heroCenterX = heroRect.left + heroRect.width / 2;
            const heroCenterY = heroRect.top + heroRect.height / 2;
            
            const deltaX = heroCenterX - loadingCenterX;
            const deltaY = heroCenterY - loadingCenterY;
            
            // Get computed font sizes - this is the MOST reliable method
            const loadingFontSize = parseFloat(window.getComputedStyle(loadingName).fontSize);
            const heroFontSize = parseFloat(window.getComputedStyle(heroName).fontSize);
            const fontScaleRatio = heroFontSize / loadingFontSize;
            
            // Calculate precise scale ratio
            const scaleX = fontScaleRatio;
            const scaleY = fontScaleRatio;
            
            // Make sure hero text is completely hidden during transition
            heroName.style.opacity = '0';
            heroName.style.visibility = 'hidden';
            const finalHeroRect = heroName.getBoundingClientRect();
            
            
            // Create a perfect clone of the loading name for ultra-smooth transition
            const loadingClone = loadingName.cloneNode(true);
            loadingClone.classList.add('morphing-clone');
            loadingClone.style.position = 'fixed';
            loadingClone.style.left = `${loadingRect.left}px`;
            loadingClone.style.top = `${loadingRect.top}px`;
            loadingClone.style.width = `${loadingRect.width}px`;
            loadingClone.style.height = `${loadingRect.height}px`;
            loadingClone.style.zIndex = '10001';
            loadingClone.style.transformOrigin = 'center center';
            loadingClone.style.pointerEvents = 'none';
            loadingClone.style.margin = '0';
            loadingClone.style.padding = '0';
            loadingClone.style.border = 'none';
            loadingClone.style.outline = 'none'; // No debug outline for clean production look
            
            
            // IMPORTANT: Hide original loading name completely to prevent overlapping
            loadingName.style.opacity = '0';
            loadingName.style.visibility = 'hidden'; // Extra insurance against visibility
            
            // Also ensure the entire overlay background isn't creating visual artifacts
            if (this.overlay) {
                this.overlay.style.pointerEvents = 'none'; // Make it non-interactive
            }
            
            // Add clone to body for perfect positioning
            document.body.appendChild(loadingClone);
            
            
            // CLEAN morphing - no visual effects that could distort size perception
            setTimeout(() => {
                // Ultra-smooth easing with GPU acceleration
                loadingClone.style.transition = 'transform 2.2s cubic-bezier(0.165, 0.84, 0.44, 1), opacity 0.3s ease';
                
                // Pure transform with NO effects that could make text appear larger
                loadingClone.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale3d(${scaleX}, ${scaleY}, 1)`;
                loadingClone.style.filter = 'none'; // Remove ALL filters to prevent size illusion
                
                // Perfect overlay synchronization
                if (this.overlay) {
                    this.overlay.style.transition = 'background-color 2.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    this.overlay.style.backgroundColor = 'rgba(10, 10, 15, 0)';
                }
                
                
            }, 30);
            
            // Perfect handoff - millisecond precision
            setTimeout(() => {
                // NO filter effects - keep it clean
                loadingClone.style.filter = 'none';
                
                // Instant seamless handoff with size validation
                requestAnimationFrame(() => {
                    // Validate final positioning before handoff
                    const cloneRect = loadingClone.getBoundingClientRect();
                    const finalHeroRect = heroName.getBoundingClientRect();
                    
                    const positionMatch = Math.abs(cloneRect.left - finalHeroRect.left) < 1 && 
                                        Math.abs(cloneRect.top - finalHeroRect.top) < 1;
                    const sizeMatch = Math.abs(cloneRect.width - finalHeroRect.width) < 2 && 
                                    Math.abs(cloneRect.height - finalHeroRect.height) < 2;
                    
                    
                    // Perfect seamless handoff - fade out clone and show hero
                    loadingClone.style.opacity = '0';
                    
                    // Show the hero text with clean styling
                    heroName.style.transition = 'opacity 0.05s ease';
                    heroName.style.opacity = '1';
                    heroName.style.visibility = 'visible';
                    heroName.style.animation = 'glitch 2s infinite';
                    heroName.style.filter = 'none';
                    heroName.style.outline = 'none'; // Clean production look
                    
                });
                
                // Thorough cleanup with perfect timing
                setTimeout(() => {
                    // Remove the morphing clone
                    if (loadingClone.parentNode) {
                        loadingClone.remove();
                    }
                    
                    // Remove any other morphing clones that might be lingering
                    document.querySelectorAll('.morphing-clone').forEach(clone => clone.remove());
                }, 100);
                
                // Remove overlay after hero is fully active
                setTimeout(() => {
                    if (this.overlay) {
                        this.overlay.remove();
                        this.overlay = null;
                    }
                    
                    this.startRevealAnimations();
                }, 200);
            }, 2200); // Perfect sync with 2.2s transform duration
        });
    }

    fallbackHideOverlay() {
        
        // Show hero name immediately
        const heroName = document.querySelector('.hero .glitch');
        if (heroName) {
            heroName.style.opacity = '1';
            heroName.style.animation = 'glitch 2s infinite';
        }
        
        // Remove overlay immediately
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
        
        this.startRevealAnimations();
    }

    observeElementsForAnimation() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for reveal animation
        document.querySelectorAll(
            '.profile-card, .project-card, .timeline-item, .skill-category, .contact-card'
        ).forEach(el => {
            el.classList.add('reveal-element');
            observer.observe(el);
        });
    }

    startRevealAnimations() {
        // Trigger hero section animations
        const hero = document.querySelector('.hero');
        if (hero) hero.classList.add('loaded');
        
        // Stagger reveal animations
        const revealElements = document.querySelectorAll('.reveal-element');
        revealElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('reveal-ready');
            }, index * 100);
        });
    }

    createSkeletonLoader(element) {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton-loader';
        skeleton.innerHTML = `
            <div class="skeleton-header"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line short"></div>
            <div class="skeleton-avatar"></div>
        `;
        
        element.appendChild(skeleton);
        return skeleton;
    }

    removeSkeletonLoader(skeleton) {
        skeleton.style.opacity = '0';
        setTimeout(() => {
            skeleton.remove();
        }, 300);
    }
}

// Initialize loading animations
function initLoadingAnimations() {
    try {
        new LoadingAnimations();
    } catch (error) {
        console.error('Failed to initialize loading animations:', error);
        // Immediate fallback
        const heroName = document.querySelector('.hero .glitch');
        if (heroName) {
            heroName.style.opacity = '1';
        }
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
}

// Initialize immediately or wait for DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoadingAnimations);
} else {
    initLoadingAnimations();
}

// Emergency fallback after 5 seconds
setTimeout(() => {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.remove();
        const heroName = document.querySelector('.hero .glitch');
        if (heroName) {
            heroName.style.opacity = '1';
        }
    }
}, 5000);

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoadingAnimations;
}