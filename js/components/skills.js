class SkillsAnimation {
    constructor() {
        this.initializeSkillBars();
        this.initializeSkillCategories();
    }

    initializeSkillBars() {
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
                    skillObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        skillBars.forEach(bar => skillObserver.observe(bar));
    }

    initializeSkillCategories() {
        const categories = document.querySelectorAll('.skill-category');
        
        categories.forEach(category => {
            category.addEventListener('mouseenter', () => {
                category.style.transform = 'translateY(-10px)';
            });

            category.addEventListener('mouseleave', () => {
                category.style.transform = 'translateY(0)';
            });
        });
    }
}

// Initialize skills animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SkillsAnimation();
});