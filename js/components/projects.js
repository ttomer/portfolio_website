class ProjectsManager {
    constructor() {
        this.initializeVideoLoading();
        this.initializeProjectModals();
    }

    initializeVideoLoading() {
        const videos = document.querySelectorAll('video[data-src]');
        
        if ('IntersectionObserver' in window) {
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadVideo(entry.target);
                        videoObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px'
            });

            videos.forEach(video => videoObserver.observe(video));
        } else {
            videos.forEach(video => this.loadVideo(video));
        }
    }

    loadVideo(video) {
        video.src = video.dataset.src;
        video.removeAttribute('data-src');
        video.load();
        video.play().catch(error => {
            console.log("Video play failed:", error);
        });
    }

    initializeProjectModals() {
        const detailButtons = document.querySelectorAll('.project-link');
        
        detailButtons.forEach(button => {
            if (button.textContent.trim() === 'Details') {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const projectCard = button.closest('.project-card');
                    if (!projectCard) return;

                    const video = projectCard.querySelector('.project-video');
                    const videoSrc = video ? (video.getAttribute('data-src') || video.src) : '';
                    const titleElement = projectCard.querySelector('.project-title');
                    const projectTitle = titleElement ? titleElement.textContent.trim() : '';

                    this.showProjectDetails(projectTitle, videoSrc);
                });
            }
        });
    }

    showProjectDetails(projectTitle, videoSrc) {
        // Modal creation and handling code...
        // (Previous modal creation code remains the same)
    }
}

// Initialize projects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProjectsManager();
});