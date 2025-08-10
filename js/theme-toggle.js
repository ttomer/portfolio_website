// Theme Toggle Functionality
class ThemeToggle {
    constructor() {
        this.currentTheme = this.getStoredTheme() || this.getPreferredTheme();
        this.themeToggleBtn = document.getElementById('theme-toggle');
        this.themeIcon = document.getElementById('theme-icon');
        
        this.init();
    }

    init() {
        // Set initial theme
        this.setTheme(this.currentTheme);
        
        // Add event listener
        this.themeToggleBtn?.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!this.getStoredTheme()) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    getPreferredTheme() {
        // Check system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    getStoredTheme() {
        return localStorage.getItem('portfolio-theme');
    }

    setStoredTheme(theme) {
        localStorage.setItem('portfolio-theme', theme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        this.updateIcon(theme);
        this.updateThemeColor(theme);
        
        // Store the theme preference
        this.setStoredTheme(theme);
        
        // Dispatch custom event for other components
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme }
        }));
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        // Add animation class
        this.themeToggleBtn.classList.add('theme-switching');
        setTimeout(() => {
            this.themeToggleBtn.classList.remove('theme-switching');
        }, 300);
    }

    updateIcon(theme) {
        if (!this.themeIcon) return;
        
        if (theme === 'dark') {
            this.themeIcon.className = 'fas fa-sun';
            this.themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
        } else {
            this.themeIcon.className = 'fas fa-moon';
            this.themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
        }
    }

    updateThemeColor(theme) {
        // Update meta theme-color for mobile browsers
        const themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (themeColorMeta) {
            themeColorMeta.content = theme === 'dark' ? '#0a0a0f' : '#f8f9fa';
        }
    }
}

// Initialize theme toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeToggle();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeToggle;
}