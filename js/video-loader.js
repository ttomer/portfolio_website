// Video Lazy Loading and Intersection Observer
document.addEventListener('DOMContentLoaded', function() {
    const videos = document.querySelectorAll('video[data-src]');
    
    const loadVideo = (video) => {
        video.src = video.dataset.src;
        video.removeAttribute('data-src');
        video.load();
        video.play().catch(function(error) {
            console.log("Video play failed:", error);
        });
    };

    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    loadVideo(video);
                    videoObserver.unobserve(video);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        videos.forEach(video => {
            videoObserver.observe(video);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        videos.forEach(video => loadVideo(video));
    }
});