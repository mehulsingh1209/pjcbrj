document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu - Simplified
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if(mobileMenuBtn && navLinks) {
        // Improved touch target size
        mobileMenuBtn.style.minWidth = '44px';
        mobileMenuBtn.style.minHeight = '44px';
        
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            const expanded = navLinks.classList.contains('active');
            mobileMenuBtn.setAttribute('aria-expanded', expanded);
            
            // Toggle icon
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars', !expanded);
                icon.classList.toggle('fa-times', expanded);
            }
            
            // Toggle body scroll
            document.body.style.overflow = expanded ? 'hidden' : '';
        });
        
        // Close menu when clicking links
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navLinks.contains(event.target) && 
                !mobileMenuBtn.contains(event.target) && 
                navLinks.classList.contains('active')) {
                closeMenu();
            }
        }, { passive: true });
        
        // Add swipe to close
        let touchStartX = 0;
        navLinks.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        navLinks.addEventListener('touchend', e => {
            if (e.changedTouches[0].screenX < touchStartX - 50) {
                closeMenu();
            }
        }, { passive: true });
        
        // Helper function for menu closing
        function closeMenu() {
            navLinks.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    }
    
    // Smooth scrolling - simplified
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Optimized active navigation tracking
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');
    
    if (sections.length && navItems.length) {
        let isScrolling;
        
        function updateActiveNavLink() {
            clearTimeout(isScrolling);
            
            isScrolling = setTimeout(() => {
                const scrollPosition = window.scrollY;
                const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                
                // Default to home for top of page
                if (scrollPosition < 200) {
                    navItems.forEach(item => {
                        item.classList.toggle('active', item.getAttribute('href') === '#home');
                    });
                    return;
                }
                
                // Find current section
                for (const section of sections) {
                    const sectionTop = section.offsetTop - headerHeight - 100;
                    if (scrollPosition >= sectionTop && 
                        scrollPosition < sectionTop + section.offsetHeight) {
                        const sectionId = section.getAttribute('id');
                        navItems.forEach(item => {
                            item.classList.toggle('active', item.getAttribute('href') === `#${sectionId}`);
                        });
                        break;
                    }
                }
            }, 100); // Debounce for better performance
        }
        
        window.addEventListener('scroll', updateActiveNavLink, { passive: true });
        updateActiveNavLink(); // Initial call
    }
    
    // Optimized lazy loading
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if (lazyImages.length) {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.getAttribute('data-src');
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Simpler fallback with performance optimizations
            let isBusy = false;
            
            function lazyLoad() {
                if (isBusy) return;
                isBusy = true;
                
                setTimeout(() => {
                    const viewportHeight = window.innerHeight;
                    
                    lazyImages.forEach(img => {
                        const rect = img.getBoundingClientRect();
                        if (rect.top <= viewportHeight && rect.bottom >= 0 && img.hasAttribute('data-src')) {
                            img.src = img.getAttribute('data-src');
                            img.removeAttribute('data-src');
                            img.classList.add('loaded');
                        }
                    });
                    
                    isBusy = false;
                }, 50);
            }
            
            window.addEventListener('scroll', lazyLoad, { passive: true });
            window.addEventListener('resize', lazyLoad, { passive: true });
            window.addEventListener('orientationchange', lazyLoad, { passive: true });
            lazyLoad(); // Initial call
        }
    }
    
    // Testimonial slider - mobile optimized
    const testimonialSlider = document.querySelector('.testimonials');
    
    if (testimonialSlider) {
        const testimonials = document.querySelectorAll('.testimonial');
        if (testimonials.length > 1) {
            let currentSlide = 0;
            let autoSlideTimer;
            const slideCount = testimonials.length;
            
            // Create nav controls if needed
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
                
                // Add dots for navigation
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
            
            // Simplified layout setup
            function setupSlider() {
                const isMobile = window.innerWidth <= 768;
                
                testimonials.forEach((testimonial, index) => {
                    if (isMobile) {
                        // Stack for mobile
                        testimonial.style.transform = 'none';
                        testimonial.style.position = 'relative';
                        testimonial.style.width = '100%';
                        testimonial.style.opacity = '1';
                    } else {
                        // Side by side for desktop
                        testimonial.style.position = 'absolute';
                        testimonial.style.width = '100%';
                        testimonial.style.transform = `translateX(${(index - currentSlide) * 100}%)`;
                        testimonial.style.opacity = index === currentSlide ? '1' : '0.6';
                        testimonial.style.zIndex = index === currentSlide ? '1' : '0';
                    }
                });
                
                // Update dots
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentSlide);
                });
                
                // Handle auto-slide based on device
                clearInterval(autoSlideTimer);
                if (!isMobile) {
                    startAutoSlide();
                }
            }
            
            // Change slide function
            function goToSlide(slideIndex) {
                currentSlide = slideIndex;
                setupSlider();
            }
            
            // Auto-advance slides
            function startAutoSlide() {
                autoSlideTimer = setInterval(() => {
                    goToSlide((currentSlide + 1) % slideCount);
                }, 5000);
            }
            
            // Handle swipe
            let touchStartX = 0;
            testimonialSlider.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
                clearInterval(autoSlideTimer);
            }, { passive: true });
            
            testimonialSlider.addEventListener('touchend', e => {
                const touchEndX = e.changedTouches[0].screenX;
                const diff = touchEndX - touchStartX;
                
                if (Math.abs(diff) > 50) {
                    if (diff < 0) {
                        // Swipe left
                        goToSlide((currentSlide + 1) % slideCount);
                    } else {
                        // Swipe right
                        goToSlide((currentSlide - 1 + slideCount) % slideCount);
                    }
                }
                
                if (window.innerWidth > 768) {
                    startAutoSlide();
                }
            }, { passive: true });
            
            // Button controls
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    goToSlide((currentSlide - 1 + slideCount) % slideCount);
                });
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    goToSlide((currentSlide + 1) % slideCount);
                });
            }
            
            // Dot navigation
            dots.forEach(dot => {
                dot.addEventListener('click', () => {
                    goToSlide(parseInt(dot.dataset.slide));
                });
            });
            
            // Pause on mouse/touch
            testimonialSlider.addEventListener('mouseenter', () => {
                clearInterval(autoSlideTimer);
            });
            
            testimonialSlider.addEventListener('mouseleave', () => {
                if (window.innerWidth > 768) {
                    startAutoSlide();
                }
            });
            
            // Handle resize
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(setupSlider, 250);
            }, { passive: true });
            
            // Initial setup
            setupSlider();
        }
    }
    
    // Simplified form validation
    const contactForm = document.querySelector('#contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            let isValid = true;
            const inputs = {
                name: document.querySelector('#name'),
                email: document.querySelector('#email'),
                message: document.querySelector('#message')
            };
            
            // Clear previous errors
            contactForm.querySelectorAll('.error-message').forEach(el => el.remove());
            contactForm.querySelectorAll('[style*="border-color: red"]').forEach(el => {
                el.style.borderColor = '';
            });
            
            // Validate fields
            if (inputs.name && !inputs.name.value.trim()) {
                showError(inputs.name, 'Please enter your name');
                isValid = false;
            }
            
            if (inputs.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email.value)) {
                showError(inputs.email, 'Please enter a valid email address');
                isValid = false;
            }
            
            if (inputs.message && !inputs.message.value.trim()) {
                showError(inputs.message, 'Please enter your message');
                isValid = false;
            }
            
            if (!isValid) {
                e.preventDefault();
            }
        });
        
        // Simplified error display
        function showError(input, message) {
            input.style.borderColor = 'red';
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            errorDiv.style.color = 'red';
            errorDiv.style.fontSize = '0.8rem';
            errorDiv.style.marginTop = '5px';
            input.parentNode.appendChild(errorDiv);
            
            // Clear error on input
            input.addEventListener('input', function() {
                input.style.borderColor = '';
                const error = input.parentNode.querySelector('.error-message');
                if (error) error.remove();
            }, { once: true });
        }
    }
    
    // API contact form - optimized
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
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formValues)
                });
                
                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}`);
                }
                
                const result = await response.json();
                
                if (result.success) {
                    alert('Thank you! Your message has been sent.');
                    contactFormAPI.reset();
                    
                    if (result.whatsappUrl && confirm('Would you like to continue this conversation on WhatsApp?')) {
                        window.open(result.whatsappUrl, '_blank');
                    }
                } else {
                    alert(`Error: ${result.message || 'Failed to send message. Please try again.'}`);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('An error occurred. Please try again later or contact us directly.');
            } finally {
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }
    
    // Stats counter - simplified
    const stats = document.querySelectorAll('.counter');
    
    if (stats.length > 0 && 'IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    const frameDuration = 1000/30; // 30fps
                    const totalDuration = 1500; // 1.5 seconds (faster on mobile)
                    const increment = target / (totalDuration / frameDuration);
                    let current = 0;
                    
                    function updateCounter() {
                        current += increment;
                        if (current > target) {
                            counter.textContent = target;
                        } else {
                            counter.textContent = Math.round(current);
                            requestAnimationFrame(updateCounter);
                        }
                    }
                    
                    requestAnimationFrame(updateCounter);
                    statsObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.1 });
        
        stats.forEach(stat => statsObserver.observe(stat));
    }
    
    // Contact cards - simplified
    document.querySelectorAll('.contact-card').forEach(card => {
        let flipTimeout;
        
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
        });
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.classList.toggle('flipped');
            }
        });
        
        card.addEventListener('mouseleave', function() {
            clearTimeout(flipTimeout);
            flipTimeout = setTimeout(() => {
                this.classList.remove('flipped');
            }, 2000);
        });
    });
    
    // Dark mode toggle - unchanged
    const darkModeToggle = document.querySelector('#dark-mode-toggle');
    
    if (darkModeToggle) {
        // Set initial theme
        const savedTheme = localStorage.getItem('theme') || 
                           (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        document.documentElement.setAttribute('data-theme', savedTheme);
        darkModeToggle.checked = savedTheme === 'dark';
        
        // Toggle theme on change
        darkModeToggle.addEventListener('change', function() {
            const theme = this.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        });
    }
    
    // Simplified ripple effect
    document.querySelectorAll('.btn, button:not([disabled])').forEach(button => {
        button.addEventListener('click', function(e) {
            // Only add ripple on mobile devices when needed
            if (window.innerWidth <= 768) {
                const ripple = document.createElement('span');
                ripple.classList.add('ripple-effect');
                
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${e.clientX - rect.left - size/2}px`;
                ripple.style.top = `${e.clientY - rect.top - size/2}px`;
                
                this.appendChild(ripple);
                
                // Remove after animation completes
                setTimeout(() => ripple.remove(), 600);
            }
        });
    });
});
