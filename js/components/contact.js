class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.successMessage = document.getElementById('success-message');
        this.initializeForm();
    }

    initializeForm() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit(e);
        });
    }

    async handleSubmit(e) {
        const submitBtn = this.form.querySelector('.submit-btn');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        const formData = {
            name: document.getElementById('user_name').value,
            email: document.getElementById('user_email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        try {
            const response = await emailjs.send(
                'service_ho6xoq3',
                'template_s5kfuer',
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                }
            );

            this.showMessage('Message sent successfully!', 'success');
            this.form.reset();
        } catch (error) {
            this.showMessage('Failed to send message. Please try again.', 'error');
            console.error('EmailJS Error:', error);
        } finally {
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    }

    showMessage(message, type) {
        this.successMessage.textContent = message;
        this.successMessage.style.display = 'block';
        this.successMessage.style.background = type === 'success' 
            ? 'rgba(0,255,0,0.1)' 
            : 'rgba(255,0,0,0.1)';
        this.successMessage.style.border = type === 'success'
            ? '1px solid rgba(0,255,0,0.2)'
            : '1px solid rgba(255,0,0,0.2)';

        setTimeout(() => {
            this.successMessage.style.display = 'none';
        }, 3000);
    }
}

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});