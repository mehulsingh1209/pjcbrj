document.addEventListener('DOMContentLoaded', () => {
    // Testimonial slider
    const testimonialSlider = document.querySelector('.testimonial-slider');
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    
    if (testimonialSlider && testimonials.length > 0) {
        let currentSlide = 0;
        const slideCount = testimonials.length;
        
        // Set up initial state
        testimonials.forEach((testimonial, index) => {
            testimonial.style.transform = `translateX(${index * 100}%)`;
        });
        
        // Update slider position
        const updateSlider = () => {
            testimonials.forEach((testimonial, index) => {
                testimonial.style.transform = `translateX(${(index - currentSlide) * 100}%)`;
            });
        };
        
        // Next button click handler
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % slideCount;
                updateSlider();
            });
        }
        
        // Previous button click handler
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + slideCount) % slideCount;
                updateSlider();
            });
        }
        
        // Auto-advance slides every 5 seconds
        let autoSlide = setInterval(() => {
            currentSlide = (currentSlide + 1) % slideCount;
            updateSlider();
        }, 5000);
        
        // Pause auto-advance on hover
        testimonialSlider.addEventListener('mouseenter', () => {
            clearInterval(autoSlide);
        });
        
        // Resume auto-advance when mouse leaves
        testimonialSlider.addEventListener('mouseleave', () => {
            autoSlide = setInterval(() => {
                currentSlide = (currentSlide + 1) % slideCount;
                updateSlider();
            }, 5000);
        });
    }
    
    // Form validation
    const contactForm = document.querySelector('#contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            let isValid = true;
            const nameInput = document.querySelector('#name');
            const emailInput = document.querySelector('#email');
            const messageInput = document.querySelector('#message');
            
            // Reset error messages
            document.querySelectorAll('.error-message').forEach(el => el.remove());
            
            // Validate name
            if (!nameInput.value.trim()) {
                isValid = false;
                showError(nameInput, 'Please enter your name');
            }
            
            // Validate email
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailInput.value)) {
                isValid = false;
                showError(emailInput, 'Please enter a valid email address');
            }
            
            // Validate message
            if (!messageInput.value.trim()) {
                isValid = false;
                showError(messageInput, 'Please enter your message');
            }
            
            if (!isValid) {
                e.preventDefault();
            }
        });
        
        // Helper function to show errors
        function showError(input, message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            errorDiv.style.color = 'red';
            errorDiv.style.fontSize = '0.8rem';
            errorDiv.style.marginTop = '5px';
            input.parentNode.appendChild(errorDiv);
            input.style.borderColor = 'red';
            
            // Remove error styling on input
            input.addEventListener('input', function() {
                input.style.borderColor = '';
                const error = input.parentNode.querySelector('.error-message');
                if (error) {
                    error.remove();
                }
            });
        }
    }
    
    // Lazy loading images
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if (lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Dark mode toggle
    const darkModeToggle = document.querySelector('#dark-mode-toggle');
    
    if (darkModeToggle) {
        // Check for saved user preference
        const savedTheme = localStorage.getItem('theme');
        
        // Set initial theme based on saved preference or system preference
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            if (savedTheme === 'dark') {
                darkModeToggle.checked = true;
            }
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
            darkModeToggle.checked = true;
        }
        
        // Toggle theme on change
        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }
    
    // Contact form with API submission
    const contactFormAPI = document.getElementById('contactForm');
    
    if (contactFormAPI) {
        contactFormAPI.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            // Get form data
            const formData = new FormData(contactFormAPI);
            const formValues = Object.fromEntries(formData.entries());
            
            // Show loading state
            const submitButton = contactFormAPI.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            try {
                // Send form data to our API
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formValues),
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Form submitted successfully
                    alert('Thank you! Your message has been sent.');
                    contactFormAPI.reset();
                    
                    // Optional: Open WhatsApp
                    if (result.whatsappUrl && confirm('Would you like to continue this conversation on WhatsApp?')) {
                        window.open(result.whatsappUrl, '_blank');
                    }
                } else {
                    // Error occurred
                    alert(`Error: ${result.message || 'Failed to send message. Please try again.'}`);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('An error occurred. Please try again later.');
            } finally {
                // Reset button state
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }
});
