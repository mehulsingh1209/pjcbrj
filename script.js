document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Enhancement - IMPROVED FOR BETTER RESPONSIVENESS
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if(mobileMenuBtn && navLinks) {
        // Improved touch target size for mobile
        mobileMenuBtn.style.minWidth = '44px';
        mobileMenuBtn.style.minHeight = '44px';
        
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent document click from immediately closing menu
            navLinks.classList.toggle('active');
            const expanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true' || false;
            mobileMenuBtn.setAttribute('aria-expanded', !expanded);
            // Change icon based on state
            const icon = this.querySelector('i');
            if (icon) {
                if (expanded) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                } else {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                }
            }
            
            // Prevent body scrolling when menu is open
            if (!expanded) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on a link - improved for touch devices
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = ''; // Re-enable scrolling
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });

        // Close menu when clicking outside - improved with passive event
        document.addEventListener('click', function(event) {
            if (!navLinks.contains(event.target) && !mobileMenuBtn.contains(event.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = ''; // Re-enable scrolling
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        }, { passive: true });
        
        // Add swipe to close functionality for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        navLinks.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        navLinks.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            // If swiping left (for right-side menu)
            if (touchEndX < touchStartX - 50) {
                navLinks.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = ''; // Re-enable scrolling
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        }, { passive: true });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Get the height of the fixed header
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;
                
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');
    
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY;
        
        // Get the height of the fixed header
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 0;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
        
        // Special case for top of page
        if (scrollPosition < 200) {
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === '#home') {
                    item.classList.add('active');
                }
            });
        }
    }
    
    window.addEventListener('scroll', updateActiveNavLink, { passive: true });
    updateActiveNavLink(); // Initial call on page load
    
    // Lazy Loading enhancements with IntersectionObserver
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if (lazyImages.length > 0 && 'IntersectionObserver' in window) {
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
        }, {
            rootMargin: '50px 0px', // Start loading images before they enter viewport
            threshold: 0.1
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else if (lazyImages.length > 0) {
        // Fallback for browsers that don't support IntersectionObserver
        function lazyLoad() {
            lazyImages.forEach(img => {
                if (img.getBoundingClientRect().top <= window.innerHeight && img.getBoundingClientRect().bottom >= 0) {
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                }
            });
        }
        
        window.addEventListener('scroll', lazyLoad, { passive: true });
        window.addEventListener('resize', lazyLoad, { passive: true });
        window.addEventListener('orientationchange', lazyLoad, { passive: true });
        lazyLoad(); // Initial call
    }
    
    // Testimonial slider
    const testimonialSlider = document.querySelector('.testimonials');
    const testimonials = document.querySelectorAll('.testimonial');
    
    if (testimonialSlider && testimonials.length > 0) {
        let currentSlide = 0;
        const slideCount = testimonials.length;
        let touchStartX = 0;
        let touchEndX = 0;
        let autoSlide;
        
        // Add navigation buttons if they don't exist
        if (!document.querySelector('.testimonial-nav')) {
            const navDiv = document.createElement('div');
            navDiv.className = 'testimonial-nav';
            
            const prevBtn = document.createElement('button');
            prevBtn.className = 'testimonial-prev';
            prevBtn.setAttribute('aria-label', 'Previous testimonial');
            prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
            
            const nextBtn = document.createElement('button');
            nextBtn.className = 'testimonial-next';
            nextBtn.setAttribute('aria-label', 'Next testimonial');
            nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            
            navDiv.appendChild(prevBtn);
            navDiv.appendChild(nextBtn);
            testimonialSlider.parentNode.appendChild(navDiv);
            
            // Add indicator dots
            const dotsDiv = document.createElement('div');
            dotsDiv.className = 'testimonial-dots';
            
            for (let i = 0; i < slideCount; i++) {
                const dot = document.createElement('button');
                dot.className = i === 0 ? 'dot active' : 'dot';
                dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
                dot.dataset.slide = i;
                dotsDiv.appendChild(dot);
            }
            
            testimonialSlider.parentNode.appendChild(dotsDiv);
        }
        
        const prevBtn = document.querySelector('.testimonial-prev');
        const nextBtn = document.querySelector('.testimonial-next');
        const dots = document.querySelectorAll('.testimonial-dots .dot');
        
        // Set up initial state - IMPROVED FOR MOBILE
        function setupSliderLayout() {
            if (window.innerWidth <= 768) {
                // For mobile: stack them
                testimonials.forEach(testimonial => {
                    testimonial.style.transform = 'none';
                    testimonial.style.position = 'relative';
                    testimonial.style.width = '100%';
                    testimonial.style.opacity = '1';
                    testimonial.style.zIndex = '1';
                });
            } else {
                // For desktop: side by side
                testimonials.forEach((testimonial, index) => {
                    testimonial.style.transform = `translateX(${(index - currentSlide) * 100}%)`;
                    testimonial.style.position = 'absolute';
                    testimonial.style.width = '100%';
                    testimonial.style.opacity = index === currentSlide ? '1' : '0.6';
                    testimonial.style.zIndex = index === currentSlide ? '1' : '0';
                });
            }
        }
        
        // Update slider position
        const updateSlider = () => {
            if (window.innerWidth <= 768) return; // Skip on mobile
            
            testimonials.forEach((testimonial, index) => {
                testimonial.style.transform = `translateX(${(index - currentSlide) * 100}%)`;
                testimonial.style.opacity = index === currentSlide ? '1' : '0.6';
                testimonial.style.zIndex = index === currentSlide ? '1' : '0';
            });
            
            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        };
        
        // Swipe detection for mobile
        testimonialSlider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        testimonialSlider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
                // Swipe left
                currentSlide = (currentSlide + 1) % slideCount;
                updateSlider();
            } else if (touchEndX > touchStartX + 50) {
                // Swipe right
                currentSlide = (currentSlide - 1 + slideCount) % slideCount;
                updateSlider();
            }
        }
        
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
        
        // Dot click handlers
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                currentSlide = parseInt(dot.dataset.slide);
                updateSlider();
            });
        });
        
        // Auto-advance slides every 5 seconds
        const startAutoSlide = () => {
            autoSlide = setInterval(() => {
                currentSlide = (currentSlide + 1) % slideCount;
                updateSlider();
            }, 5000);
        };
        
        // Start auto-slide
        startAutoSlide();
        
        // Pause auto-advance on hover or touch
        testimonialSlider.addEventListener('mouseenter', () => {
            clearInterval(autoSlide);
        });
        
        testimonialSlider.addEventListener('touchstart', () => {
            clearInterval(autoSlide);
        }, { passive: true });
        
        // Resume auto-advance when mouse leaves
        testimonialSlider.addEventListener('mouseleave', () => {
            startAutoSlide();
        });
        
        testimonialSlider.addEventListener('touchend', () => {
            startAutoSlide();
        }, { passive: true });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            setupSliderLayout();
            
            if (window.innerWidth <= 768) {
                clearInterval(autoSlide); // Stop auto-slide on mobile
            } else {
                clearInterval(autoSlide);
                startAutoSlide();
            }
        }, { passive: true });
        
        // Initial setup
        setupSliderLayout();
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
            document.querySelectorAll('[style*="border-color: red"]').forEach(el => {
                el.style.borderColor = '';
            });
            
            // Validate name
            if (nameInput && !nameInput.value.trim()) {
                isValid = false;
                showError(nameInput, 'Please enter your name');
            }
            
            // Validate email
            if (emailInput) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailInput.value)) {
                    isValid = false;
                    showError(emailInput, 'Please enter a valid email address');
                }
            }
            
            // Validate message
            if (messageInput && !messageInput.value.trim()) {
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
            
            // Announce error for screen readers
            const ariaLive = document.createElement('div');
            ariaLive.setAttribute('aria-live', 'polite');
            ariaLive.className = 'sr-only';
            ariaLive.textContent = message;
            document.body.appendChild(ariaLive);
            
            // Remove after announcement
            setTimeout(() => {
                document.body.removeChild(ariaLive);
            }, 3000);
        }
    }
    
    // API contact form
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
                
                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}`);
                }
                
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
                alert('An error occurred. Please try again later or contact us directly via phone.');
            } finally {
                // Reset button state
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }
    
    // Stats counter animation
    const stats = document.querySelectorAll('.counter');
    
    if (stats.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000; // 2 seconds
                    const stepTime = 50; // Update every 50ms
                    const totalSteps = duration / stepTime;
                    const stepSize = target / totalSteps;
                    let current = 0;
                    
                    const updateCounter = () => {
                        current += stepSize;
                        counter.textContent = Math.round(current);
                        
                        if (current < target) {
                            setTimeout(updateCounter, stepTime);
                        } else {
                            counter.textContent = target;
                        }
                    };
                    
                    updateCounter();
                    statsObserver.unobserve(counter);
                }
            });
        }, {
            threshold: 0.1
        });
        
        stats.forEach(stat => {
            statsObserver.observe(stat);
        });
    }
    
    // Interactive flip cards for contact section
    const contactCards = document.querySelectorAll('.contact-card');
    
    contactCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
        });
        
        // Also handle enter key for accessibility
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.classList.toggle('flipped');
            }
        });
        
        // Auto flip back after some time
        card.addEventListener('mouseleave', function() {
            setTimeout(() => {
                this.classList.remove('flipped');
            }, 2000);
        });
    });
    
    // Dark mode toggle functionality
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
    
    // Button hover effects and touch feedback
    const buttons = document.querySelectorAll('.btn, button:not([disabled])');
    
    buttons.forEach(button => {
        // Add ripple effect for touch feedback
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size/2}px`;
            ripple.style.top = `${e.clientY - rect.top - size/2}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Performance optimization for mobile
    let isScrolling;
    let ticking = false;
    
    // Listen for scroll events (debounced)
    window.addEventListener('scroll', function() {
        // Clear our timeout throughout the scroll
        window.clearTimeout(isScrolling);
        
        // Set a timeout to run after scrolling ends
        isScrolling = setTimeout(function() {
            // Run the callback
            console.log('Scrolling has stopped');
            ticking = false;
        }, 66);
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                // Run scroll-dependent functions at 60fps
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
});
