// Audio Control System
class AudioController {
    constructor() {
        this.audio = document.getElementById('background-audio');
        this.audioToggle = document.getElementById('audio-toggle');
        this.audioIcon = document.getElementById('audio-icon');
        this.isPlaying = false;
        this.userInteracted = false;
        this.autoPlayAttempted = false;
        this.isMuted = this.getMutedState(); // Load cached mute state
        
        this.init();
    }

    init() {
        // Set initial volume
        this.audio.volume = 0.3; // 30% volume for background music
        
        // Set up click handler
        this.audioToggle.addEventListener('click', () => {
            this.toggleAudio();
        });
        
        // Try to autoplay immediately, then set up fallback for user interaction
        this.attemptAutoplay();
        this.setupUserInteraction();
        
        // Handle audio loading
        this.audio.addEventListener('loadeddata', () => {
            console.log('Background audio loaded');
        });
        
        this.audio.addEventListener('error', (e) => {
            console.log('Audio loading error - this is normal if file doesn\'t exist yet');
            this.handleAudioError();
        });
    }
    
    async attemptAutoplay() {
        this.autoPlayAttempted = true;
        
        // Don't attempt autoplay if user has muted
        if (this.isMuted) {
            console.log('🔇 Audio muted by user preference - skipping autoplay');
            this.isPlaying = false;
            this.updateIcon();
            return;
        }
        
        try {
            // Try to play immediately on page load
            await this.audio.play();
            this.isPlaying = true;
            this.userInteracted = true; // Mark as if user interacted since autoplay worked
            this.updateIcon();
            console.log('🎵 Background music auto-started successfully!');
        } catch (error) {
            console.log('⏸️ Autoplay blocked by browser - waiting for user interaction');
            this.isPlaying = false;
            this.updateIcon();
        }
    }
    
    setupUserInteraction() {
        // Only set up user interaction listeners if autoplay failed
        if (this.userInteracted) {
            return; // Autoplay succeeded, no need for user interaction listeners
        }
        
        // Wait for any user interaction to enable audio
        const enableAudio = () => {
            this.userInteracted = true;
            // Only start audio if not muted by user preference
            if (!this.isMuted) {
                this.startAudio();
            }
            
            // Remove listeners after first interaction
            document.removeEventListener('click', enableAudio);
            document.removeEventListener('keydown', enableAudio);
            document.removeEventListener('scroll', enableAudio);
        };
        
        document.addEventListener('click', enableAudio);
        document.addEventListener('keydown', enableAudio);
        document.addEventListener('scroll', enableAudio);
    }
    
    async startAudio() {
        if (!this.userInteracted) return;
        
        try {
            await this.audio.play();
            this.isPlaying = true;
            this.updateIcon();
            console.log('Background music started');
        } catch (error) {
            console.log('Could not start audio:', error.message);
            this.handleAudioError();
        }
    }
    
    toggleAudio() {
        if (!this.userInteracted) {
            this.userInteracted = true;
        }
        
        if (this.isPlaying) {
            this.pauseAudio();
            this.isMuted = true;
        } else {
            this.startAudio();
            this.isMuted = false;
        }
        
        // Cache the mute state
        this.saveMutedState(this.isMuted);
    }
    
    pauseAudio() {
        this.audio.pause();
        this.isPlaying = false;
        this.updateIcon();
        console.log('Background music paused');
    }
    
    updateIcon() {
        if (this.isPlaying && !this.isMuted) {
            this.audioIcon.className = 'fas fa-volume-up';
            this.audioToggle.classList.remove('muted');
            this.audioToggle.setAttribute('aria-label', 'Mute background music');
        } else {
            this.audioIcon.className = 'fas fa-volume-mute';
            this.audioToggle.classList.add('muted');
            this.audioToggle.setAttribute('aria-label', 'Unmute background music');
        }
    }
    
    getMutedState() {
        try {
            return localStorage.getItem('audioMuted') === 'true';
        } catch (error) {
            console.log('LocalStorage not available, using default mute state');
            return false;
        }
    }
    
    saveMutedState(isMuted) {
        try {
            localStorage.setItem('audioMuted', isMuted.toString());
        } catch (error) {
            console.log('Could not save mute state to localStorage');
        }
    }
    
    handleAudioError() {
        // Hide audio button if there's no audio file
        this.audioToggle.style.display = 'none';
        console.log('Audio button hidden - no audio file found');
    }
}

// Initialize audio control when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AudioController();
});