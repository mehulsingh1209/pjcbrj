document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const scrollContainer = document.createElement('div');
    const scrollbar = document.createElement('div');
    const scrollThumb = document.createElement('div');

    // Setup scroll container
    scrollContainer.className = 'virtual-scroll-container';
    scrollbar.className = 'virtual-scrollbar';
    scrollThumb.className = 'virtual-scrollbar-thumb';

    scrollbar.appendChild(scrollThumb);
    body.appendChild(scrollbar);

    // Calculate and update thumb height
    function updateThumbHeight() {
        const viewportHeight = window.innerHeight;
        const contentHeight = document.documentElement.scrollHeight;
        const scrollPercentage = viewportHeight / contentHeight;
        const thumbHeight = Math.max(viewportHeight * scrollPercentage, 30);
        scrollThumb.style.height = `${thumbHeight}px`;
    }

    // Update thumb position
    function updateThumbPosition() {
        const scrollPercentage = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        const thumbPosition = scrollPercentage * (scrollbar.clientHeight - scrollThumb.clientHeight);
        scrollThumb.style.transform = `translateY(${thumbPosition}px)`;
    }

    // Handle scroll events
    window.addEventListener('scroll', () => {
        updateThumbPosition();
    });

    // Handle resize events
    window.addEventListener('resize', () => {
        updateThumbHeight();
        updateThumbPosition();
    });

    // Initialize
    updateThumbHeight();
    updateThumbPosition();

    // Handle thumb drag
    let isDragging = false;
    let startY = 0;
    let scrollStartY = 0;

    scrollThumb.addEventListener('mousedown', (e) => {
        isDragging = true;
        startY = e.clientY - scrollThumb.offsetTop;
        scrollStartY = window.scrollY;
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const y = e.clientY - startY;
        const percentage = y / (scrollbar.clientHeight - scrollThumb.clientHeight);
        const scrollY = percentage * (document.documentElement.scrollHeight - window.innerHeight);
        window.scrollTo(0, scrollY);
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.userSelect = '';
    });
}));