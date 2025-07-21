// Contact Form with EmailJS Integration
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with your public key
    (function() {
        emailjs.init("BWgW4SB4ZhnT3OjvF"); // Replace with your EmailJS public key
    })();

    document.getElementById('contact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = this.querySelector('.submit-btn');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Gather form data
        const formData = {
            name: document.getElementById('user_name').value,
            email: document.getElementById('user_email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Send email using EmailJS
        emailjs.send(
            'service_ho6xoq3', // Replace with your EmailJS service ID
            'template_s5kfuer', // Replace with your EmailJS template ID
            {
                from_name: formData.name,
                from_email: formData.email,
                subject: formData.subject,
                message: formData.message,
            }
        ).then(
            function(response) {
                // Show success message
                const successMessage = document.getElementById('success-message');
                successMessage.style.display = 'block';
                successMessage.textContent = 'Message sent successfully!';
                
                // Reset form and button
                document.getElementById('contact-form').reset();
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;

                // Hide success message after 3 seconds
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 3000);
            },
            function(error) {
                // Show error message
                const successMessage = document.getElementById('success-message');
                successMessage.style.display = 'block';
                successMessage.style.background = 'rgba(255,0,0,0.1)';
                successMessage.style.border = '1px solid rgba(255,0,0,0.2)';
                successMessage.textContent = 'Failed to send message. Please try again.';
                
                // Reset button
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;

                // Hide error message after 3 seconds
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 3000);
            }
        );
    });
});