document.addEventListener('DOMContentLoaded', () => {
  // Select all sections and add scroll-reveal class
  const sections = document.querySelectorAll('section');
  sections.forEach(section => section.classList.add('scroll-reveal'));
  
  // Create observer with mobile-optimized settings
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: window.innerWidth <= 768 ? 0.15 : 0.2,
    rootMargin: window.innerWidth <= 768 ? '50px' : '30px'
  });
  
  // Observe all scroll-reveal elements
  document.querySelectorAll('.scroll-reveal').forEach(element => {
    observer.observe(element);
  });
  
  // Handle resize with debouncing
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Update observer for remaining elements
      observer.disconnect();
      document.querySelectorAll('.scroll-reveal:not(.active)').forEach(element => {
        observer.observe(element);
      });
    }, 200);
  });
  
  // Optimize for touch devices
  if ('ontouchstart' in window) {
    document.addEventListener('touchmove', () => {
      requestAnimationFrame(() => observer.takeRecords());
    }, {passive: true});
  }
});
