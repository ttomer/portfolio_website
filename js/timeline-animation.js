// Timeline Animation and Intersection Observer
document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    timelineItems.forEach(item => {
        observer.observe(item);
    });

    // Add hover effect for timeline dots
    document.querySelectorAll('.timeline-dot').forEach(dot => {
        dot.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.5) translateX(-30%)';
            this.style.boxShadow = '0 0 30px var(--neon-blue)';
        });

        dot.addEventListener('mouseout', function() {
            this.style.transform = 'translateX(-50%)';
            this.style.boxShadow = '0 0 20px var(--neon-blue)';
        });
    });
});