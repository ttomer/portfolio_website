// Audio Control System
class AudioController {
    constructor() {
        this.audio = document.getElementById('background-audio');
        this.audioToggle = document.getElementById('audio-toggle');
        this.audioIcon = document.getElementById('audio-icon');
        this.isPlaying = false;
        this.userInteracted = false;
        
        this.init();
    }

    init() {
        // Set initial volume
        this.audio.volume = 0.3; // 30% volume for background music
        
        // Set up click handler
        this.audioToggle.addEventListener('click', () => {
            this.toggleAudio();
        });
        
        // Modern browsers require user interaction before playing audio
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
    
    setupUserInteraction() {
        // Wait for any user interaction to enable audio
        const enableAudio = () => {
            this.userInteracted = true;
            this.startAudio();
            
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
        } else {
            this.startAudio();
        }
    }
    
    pauseAudio() {
        this.audio.pause();
        this.isPlaying = false;
        this.updateIcon();
        console.log('Background music paused');
    }
    
    updateIcon() {
        if (this.isPlaying) {
            this.audioIcon.className = 'fas fa-volume-up';
            this.audioToggle.classList.remove('muted');
            this.audioToggle.setAttribute('aria-label', 'Mute background music');
        } else {
            this.audioIcon.className = 'fas fa-volume-mute';
            this.audioToggle.classList.add('muted');
            this.audioToggle.setAttribute('aria-label', 'Unmute background music');
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