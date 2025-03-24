document.addEventListener('DOMContentLoaded', () => {
  // Create elements only once
  const scrollbar = document.createElement('div');
  const scrollThumb = document.createElement('div');
  
  // Setup with minimal DOM operations
  scrollbar.className = 'virtual-scrollbar';
  scrollThumb.className = 'virtual-scrollbar-thumb';
  scrollbar.appendChild(scrollThumb);
  document.body.appendChild(scrollbar);
  
  // Track drag state
  let isDragging = false;
  let startY = 0;
  
  // Optimize calculations with cached values
  let scrollbarHeight = scrollbar.clientHeight;
  let viewportHeight = window.innerHeight;
  let contentHeight = document.documentElement.scrollHeight;
  
  // Combined update function to reduce calculations
  function updateThumb() {
    // Calculate thumb dimensions
    const scrollPercentage = viewportHeight / contentHeight;
    const thumbHeight = Math.max(viewportHeight * scrollPercentage, 30);
    scrollThumb.style.height = `${thumbHeight}px`;
    
    // Position the thumb
    const scrollRatio = window.scrollY / (contentHeight - viewportHeight);
    const thumbPosition = scrollRatio * (scrollbarHeight - thumbHeight);
    
    // Use transform for better performance
    scrollThumb.style.transform = `translateY(${thumbPosition}px)`;
  }
  
  // Update cached dimensions when needed
  function updateDimensions() {
    scrollbarHeight = scrollbar.clientHeight;
    viewportHeight = window.innerHeight;
    contentHeight = document.documentElement.scrollHeight;
    updateThumb();
  }
  
  // Touch event handlers for mobile
  scrollThumb.addEventListener('touchstart', (e) => {
    isDragging = true;
    startY = e.touches[0].clientY;
    e.preventDefault();
    document.body.style.overflow = 'hidden'; // Prevent page scroll during drag
  });
  
  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    
    const touchY = e.touches[0].clientY;
    const deltaY = touchY - startY;
    startY = touchY;
    
    const scrollRatio = deltaY / (scrollbarHeight - scrollThumb.clientHeight);
    const scrollAmount = scrollRatio * contentHeight;
    
    window.scrollBy(0, scrollAmount);
    e.preventDefault();
  });
  
  document.addEventListener('touchend', () => {
    isDragging = false;
    document.body.style.overflow = ''; // Restore scrolling
  });
  
  // Desktop event handlers (throttled)
  scrollThumb.addEventListener('mousedown', (e) => {
    isDragging = true;
    startY = e.clientY;
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });
  
  // Use passive listeners where possible for better performance
  window.addEventListener('scroll', updateThumb, { passive: true });
  
  // Throttle resize events
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateDimensions, 100);
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const deltaY = e.clientY - startY;
    startY = e.clientY;
    
    const scrollRatio = deltaY / (scrollbarHeight - scrollThumb.clientHeight);
    const scrollAmount = scrollRatio * contentHeight;
    
    window.scrollBy(0, scrollAmount);
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.userSelect = '';
  });
  
  // Initialize once on load
  updateDimensions();
});
