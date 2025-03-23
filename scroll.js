document.addEventListener('DOMContentLoaded', () => {
    // Add scroll-reveal class to elements we want to animate
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('scroll-reveal');
    });

    // Function to get dynamic threshold based on viewport size
    const getDynamicThreshold = () => {
        const viewportWidth = window.innerWidth;
        return viewportWidth <= 768 ? 0.15 : 0.2; // Increased threshold for better visibility
    };

    // Function to get dynamic root margin based on viewport size
    const getDynamicRootMargin = () => {
        const viewportWidth = window.innerWidth;
        return viewportWidth <= 768 ? '50px' : '30px'; // Increased margin for better visibility
    };

    // Create an Intersection Observer with dynamic configuration
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add active class with a staggered delay for smoother animation
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, 150);
                // Only observe once
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: getDynamicThreshold(),
        rootMargin: getDynamicRootMargin()
    });

    // Update observer options on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Disconnect existing observer
            observer.disconnect();
            // Create new observer with updated options
            const elements = document.querySelectorAll('.scroll-reveal:not(.active)');
            elements.forEach(element => {
                observer.observe(element);
            });
        }, 250); // Debounce resize events
    });

    // Add touch event handling for mobile devices
    if ('ontouchstart' in window) {
        document.addEventListener('touchmove', () => {
            requestAnimationFrame(() => {
                observer.takeRecords(); // Force update observations
            });
        }, { passive: true }); // Optimize touch events
    }

    // Observe all elements with scroll-reveal class
    document.querySelectorAll('.scroll-reveal').forEach(element => {
        observer.observe(element);
    });
});