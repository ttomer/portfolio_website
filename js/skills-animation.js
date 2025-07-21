// Skills Bar Animation
document.addEventListener('DOMContentLoaded', () => {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const animateSkill = (bar) => {
        const width = bar.dataset.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = `${width}%`;
        }, 100);
    };

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkill(entry.target);
                skillObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
});