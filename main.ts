// main.ts - TypeScript code for enhancing Parsa Job Centre website mobile experience

/**
 * Interface for elements that need to be tracked for animation
 */
interface AnimatedElement {
  element: HTMLElement;
  animationClass: string;
  triggered: boolean;
}

/**
 * Mobile menu management
 */
class MobileNavigation {
  private menuBtn: HTMLElement;
  private navLinks: HTMLElement;
  private isOpen: boolean = false;
  private navItems: NodeListOf<HTMLElement>;

  constructor() {
    this.menuBtn = document.querySelector('.mobile-menu-btn') as HTMLElement;
    this.navLinks = document.querySelector('.nav-links') as HTMLElement;
    this.navItems = document.querySelectorAll('.nav-links li') as NodeListOf<HTMLElement>;
    
    this.init();
  }

  private init(): void {
    // Add event listener to toggle menu
    this.menuBtn.addEventListener('click', this.toggleMenu.bind(this));
    
    // Add event listeners to each nav item to close menu when clicked
    this.navItems.forEach(item => {
      item.addEventListener('click', this.closeMenu.bind(this));
    });

    // Close menu on resize if screen becomes larger than mobile breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isOpen) {
        this.closeMenu();
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (this.isOpen && !this.navLinks.contains(target) && !this.menuBtn.contains(target)) {
        this.closeMenu();
      }
    });
  }

  private toggleMenu(): void {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  private openMenu(): void {
    this.navLinks.classList.add('show');
    this.menuBtn.classList.add('active');
    this.isOpen = true;
    document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    
    // Animate items in with staggered delay
    this.navItems.forEach((item, index) => {
      item.style.animation = `fadeInDown 0.4s ease forwards ${index * 0.1}s`;
    });
  }

  private closeMenu(): void {
    this.navLinks.classList.remove('show');
    this.menuBtn.classList.remove('active');
    this.isOpen = false;
    document.body.style.overflow = ''; // Re-enable scrolling
    
    // Reset animations
    this.navItems.forEach(item => {
      item.style.animation = '';
    });
  }
}

/**
 * ScrollSpy for navigation highlighting
 */
class ScrollSpy {
  private sections: NodeListOf<HTMLElement>;
  private navItems: NodeListOf<HTMLAnchorElement>;
  private currentActive: HTMLAnchorElement | null = null;
  private scrollOffset: number = 100;

  constructor() {
    this.sections = document.querySelectorAll('section[id]') as NodeListOf<HTMLElement>;
    this.navItems = document.querySelectorAll('.nav-links a') as NodeListOf<HTMLAnchorElement>;
    
    this.init();
  }

  private init(): void {
    // Add scroll event listener
    window.addEventListener('scroll', this.onScroll.bind(this));
    
    // Initial check
    this.onScroll();
  }

  private onScroll(): void {
    const scrollPosition = window.scrollY + this.scrollOffset;
    
    this.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (
        scrollPosition >= sectionTop && 
        scrollPosition < sectionTop + sectionHeight
      ) {
        // Remove active class from all nav items
        this.navItems.forEach(item => {
          item.classList.remove('active');
        });
        
        // Add active class to current nav item
        const targetNavItem = document.querySelector(`.nav-links a[href="#${sectionId}"]`) as HTMLAnchorElement;
        if (targetNavItem) {
          targetNavItem.classList.add('active');
          this.currentActive = targetNavItem;
        }
      }
    });
  }
}

/**
 * Smooth scroll implementation for navigation links
 */
class SmoothScroll {
  private links: NodeListOf<HTMLAnchorElement>;
  private scrollOffset: number = 70; // Offset for fixed header

  constructor() {
    this.links = document.querySelectorAll('a[href^="#"]') as NodeListOf<HTMLAnchorElement>;
    this.init();
  }

  private init(): void {
    this.links.forEach(link => {
      link.addEventListener('click', this.onLinkClick.bind(this));
    });
  }

  private onLinkClick(e: Event): void {
    e.preventDefault();
    
    const link = e.currentTarget as HTMLAnchorElement;
    const targetId = link.getAttribute('href');
    
    if (targetId && targetId !== '#') {
      const targetElement = document.querySelector(targetId) as HTMLElement;
      
      if (targetElement) {
        const targetPosition = targetElement.offsetTop - this.scrollOffset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  }
}

/**
 * Animated counters for stats section
 */
class CounterAnimation {
  private counters: NodeListOf<HTMLElement>;
  private speed: number = 200;
  private observer: IntersectionObserver;

  constructor() {
    this.counters = document.querySelectorAll('.counter') as NodeListOf<HTMLElement>;
    this.observer = new IntersectionObserver(this.onIntersection.bind(this), {
      root: null,
      threshold: 0.1
    });
    
    this.init();
  }

  private init(): void {
    this.counters.forEach(counter => {
      counter.innerText = '0';
      this.observer.observe(counter);
    });
  }

  private onIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target as HTMLElement;
        const target = parseInt(counter.getAttribute('data-target') || '0');
        const increment = Math.ceil(target / this.speed);
        let currentValue = 0;
        
        const updateCounter = () => {
          currentValue += increment;
          counter.innerText = currentValue.toString();
          
          if (currentValue < target) {
            setTimeout(updateCounter, 1);
          } else {
            counter.innerText = target.toString();
          }
        };
        
        updateCounter();
        this.observer.unobserve(counter);
      }
    });
  }
}

/**
 * Lazy loading for images
 */
class LazyLoader {
  private images: NodeListOf<HTMLImageElement>;
  private observer: IntersectionObserver;

  constructor() {
    this.images = document.querySelectorAll('img[data-src]') as NodeListOf<HTMLImageElement>;
    this.observer = new IntersectionObserver(this.onIntersection.bind(this), {
      root: null,
      rootMargin: '0px 0px 100px 0px',
      threshold: 0.1
    });
    
    this.init();
  }

  private init(): void {
    this.images.forEach(image => {
      this.observer.observe(image);
    });
  }

  private onIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.getAttribute('data-src');
        
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
        }
        
        this.observer.unobserve(img);
      }
    });
  }
}

/**
 * Interactive contact cards
 */
class InteractiveContactCards {
  private cards: NodeListOf<HTMLElement>;

  constructor() {
    this.cards = document.querySelectorAll('.contact-card') as NodeListOf<HTMLElement>;
    this.init();
  }

  private init(): void {
    // For touch devices, make the cards work with touch
    if ('ontouchstart' in window) {
      this.cards.forEach(card => {
        card.addEventListener('touchstart', () => {
          // First, remove active class from all cards
          this.cards.forEach(c => c.classList.remove('active'));
          // Then toggle the current card
          card.classList.toggle('active');
        });
      });
    }
    
    // For non-touch, keep the hover effect from CSS
  }
}

/**
 * Scroll animation for elements
 */
class ScrollAnimation {
  private animatedElements: AnimatedElement[] = [];
  private observer: IntersectionObserver;

  constructor() {
    // Initialize with default animation classes for different sections
    const sections = document.querySelectorAll('section') as NodeListOf<HTMLElement>;
    
    sections.forEach((section, index) => {
      let animation = 'fade-in';
      
      // Alternate animations for visual interest
      if (index % 3 === 0) animation = 'fade-in-up';
      if (index % 3 === 1) animation = 'fade-in-left';
      if (index % 3 === 2) animation = 'fade-in-right';
      
      this.animatedElements.push({
        element: section,
        animationClass: animation,
        triggered: false
      });
    });
    
    // Add specific elements that need animations
    const serviceBenefits = [
      ...Array.from(document.querySelectorAll('.service-card')), 
      ...Array.from(document.querySelectorAll('.testimonial')),
      ...Array.from(document.querySelectorAll('.category')),
      ...Array.from(document.querySelectorAll('.stat-card'))
    ] as HTMLElement[];
    
    serviceBenefits.forEach((element, index) => {
      this.animatedElements.push({
        element,
        animationClass: 'pop-in',
        triggered: false
      });
    });
    
    this.observer = new IntersectionObserver(this.onIntersection.bind(this), {
      root: null,
      threshold: 0.2
    });
    
    this.init();
  }

  private init(): void {
    this.animatedElements.forEach(item => {
      item.element.classList.add('animate-init');
      this.observer.observe(item.element);
    });
  }

  private onIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetElement = entry.target as HTMLElement;
        const animatedItem = this.animatedElements.find(item => item.element === targetElement);
        
        if (animatedItem && !animatedItem.triggered) {
          targetElement.classList.add(animatedItem.animationClass);
          animatedItem.triggered = true;
          this.observer.unobserve(targetElement);
        }
      }
    });
  }
}

/**
 * Form validation and submission
 */
class ContactForm {
  private form: HTMLFormElement;
  private submitBtn: HTMLButtonElement;
  private formFields: NodeListOf<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
  private formStatus: HTMLElement;

  constructor() {
    this.form = document.getElementById('contactForm') as HTMLFormElement;
    if (!this.form) return;
    
    this.submitBtn = this.form.querySelector('button[type="submit"]') as HTMLButtonElement;
    this.formFields = this.form.querySelectorAll('input, textarea, select') as NodeListOf<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
    
    // Create status element
    this.formStatus = document.createElement('div');
    this.formStatus.className = 'form-status';
    this.form.appendChild(this.formStatus);
    
    this.init();
  }

  private init(): void {
    this.form.addEventListener('submit', this.onSubmit.bind(this));
    
    // Real-time validation as user types
    this.formFields.forEach(field => {
      field.addEventListener('blur', () => this.validateField(field));
      field.addEventListener('input', () => this.validateField(field));
    });
  }

  private validateField(field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): boolean {
    // Remove existing error messages
    const existingError = field.parentElement?.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
    
    field.classList.remove('invalid');
    
    if (!field.value.trim()) {
      this.showFieldError(field, 'This field is required');
      return false;
    }
    
    // Email validation
    if (field.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        this.showFieldError(field, 'Please enter a valid email address');
        return false;
      }
    }
    
    // Phone validation - allow different formats
    if (field.type === 'tel') {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{3,4}[-\s.]?[0-9]{3,4}$/;
      if (!phoneRegex.test(field.value)) {
        this.showFieldError(field, 'Please enter a valid phone number');
        return false;
      }
    }
    
    return true;
  }

  private showFieldError(field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, message: string): void {
    field.classList.add('invalid');
    
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    
    field.parentElement?.appendChild(errorMessage);
  }

  private validateForm(): boolean {
    let isValid = true;
    
    this.formFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    
    return isValid;
  }

  private onSubmit(e: Event): void {
    e.preventDefault();
    
    if (!this.validateForm()) {
      this.showFormStatus('Please check the form for errors', 'error');
      return;
    }
    
    // Show loading state
    this.submitBtn.disabled = true;
    this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Simulate form submission with a timeout (replace with actual AJAX)
    setTimeout(() => {
      // In a real implementation, you would use fetch API to send the form
      /*
      fetch('your-endpoint', {
        method: 'POST',
        body: new FormData(this.form)
      })
      .then(response => response.json())
      .then(data => {
        this.showFormStatus('Message sent successfully! We will contact you soon.', 'success');
        this.form.reset();
      })
      .catch(error => {
        this.showFormStatus('Failed to send message. Please try again.', 'error');
      })
      .finally(() => {
        this.submitBtn.disabled = false;
        this.submitBtn.innerHTML = 'Send Message';
      });
      */
      
      // Success simulation
      this.showFormStatus('Message sent successfully! We will contact you soon.', 'success');
      this.form.reset();
      this.submitBtn.disabled = false;
      this.submitBtn.innerHTML = 'Send Message';
    }, 1500);
  }

  private showFormStatus(message: string, type: 'success' | 'error'): void {
    this.formStatus.textContent = message;
    this.formStatus.className = `form-status ${type}`;
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      this.formStatus.className = 'form-status';
    }, 5000);
  }
}

/**
 * Nepali date and time display
 */
class NepaliDateTime {
  private clockElement: HTMLElement | null;
  private dateElement: HTMLElement | null;

  constructor() {
    this.clockElement = document.getElementById('nepali-clock');
    this.dateElement = document.getElementById('nepali-date');
    
    if (this.clockElement && this.dateElement) {
      this.init();
    }
  }

  private init(): void {
    // Update time initially
    this.updateTime();
    
    // Update time every second
    setInterval(() => this.updateTime(), 1000);
    
    // Update date (doesn't need frequent updates)
    this.updateDate();
  }

  private updateTime(): void {
    if (!this.clockElement) return;
    
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be displayed as 12
    
    this.clockElement.innerHTML = `
      <span class="time-number">${hours}</span>:
      <span class="time-number">${minutes}</span>:
      <span class="time-number">${seconds}</span>
      <span class="time-ampm">${ampm}</span>
    `;
  }

  private updateDate(): void {
    if (!this.dateElement) return;
    
    // Basic Nepali date calculation - for accurate conversion use a Nepali date library
    // This is a simplified example
    const englishDate = new Date();
    
    // Array of Nepali months (this is simplified)
    const nepaliMonths = [
      'Baishakh', 'Jestha', 'Ashadh', 'Shrawan', 
      'Bhadra', 'Ashwin', 'Kartik', 'Mangsir',
      'Poush', 'Magh', 'Falgun', 'Chaitra'
    ];
    
    // Simplified calculation - this should be replaced with proper conversion
    // This is just an approximation for demonstration
    let nepaliYear = englishDate.getFullYear() + 56; // Rough estimate of difference
    let nepaliMonth = (englishDate.getMonth() + 3) % 12; // Roughly 3 months difference
    let nepaliDay = (englishDate.getDate() + 15) % 30 || 30; // Rough estimate
    
    this.dateElement.textContent = `${nepaliDay} ${nepaliMonths[nepaliMonth]}, ${nepaliYear} BS`;
  }
}

/**
 * Responsive image handling 
 */
class ResponsiveImages {
  private images: NodeListOf<HTMLImageElement>;

  constructor() {
    this.images = document.querySelectorAll('img:not([data-src])') as NodeListOf<HTMLImageElement>;
    this.init();
  }

  private init(): void {
    // Add loading="lazy" attribute to all images
    this.images.forEach(img => {
      img.setAttribute('loading', 'lazy');
      
      // Add a lightweight placeholder effect
      this.addPlaceholder(img);
    });
    
    // Listen for window resize to possibly load different image sizes
    window.addEventListener('resize', this.checkBreakpoints.bind(this));
  }

  private addPlaceholder(img: HTMLImageElement): void {
    // Create a wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'img-placeholder';
    wrapper.style.backgroundColor = '#f3f3f3';
    
    // Set the wrapper dimensions based on the image's aspect ratio
    if (img.width && img.height) {
      const ratio = (img.height / img.width) * 100;
      wrapper.style.paddingBottom = `${ratio}%`;
    } else {
      wrapper.style.paddingBottom = '56.25%'; // Default 16:9 ratio
    }
    
    // Replace the image with the wrapper containing the image
    const parent = img.parentNode;
    if (parent) {
      parent.replaceChild(wrapper, img);
      wrapper.appendChild(img);
      
      // Add load event
      img.addEventListener('load', () => {
        wrapper.classList.add('loaded');
      });
    }
  }

  private checkBreakpoints(): void {
    const width = window.innerWidth;
    
    this.images.forEach(img => {
      const dataSrcMobile = img.getAttribute('data-src-mobile');
      const dataSrcTablet = img.getAttribute('data-src-tablet');
      const dataSrcDesktop = img.getAttribute('data-src-desktop');
      
      if (width <= 576 && dataSrcMobile) {
        img.src = dataSrcMobile;
      } else if (width <= 992 && dataSrcTablet) {
        img.src = dataSrcTablet;
      } else if (dataSrcDesktop) {
        img.src = dataSrcDesktop;
      }
    });
  }
}

/**
 * Touch optimizations for mobile
 */
class TouchOptimizations {
  constructor() {
    this.init();
  }

  private init(): void {
    // Increase tap target sizes for mobile
    this.increaseTapTargets();
    
    // Implement touch-friendly hover alternatives
    this.handleTouchHover();
  }

  private increaseTapTargets(): void {
    const smallButtons = document.querySelectorAll('a, button') as NodeListOf<HTMLElement>;
    
    smallButtons.forEach(button => {
      const rect = button.getBoundingClientRect();
      if (rect.width < 48 || rect.height < 48) {
        // Add padding to small buttons to increase tap target
        button.style.padding = '10px';
        button.style.minWidth = '44px';
        button.style.minHeight = '44px';
      }
    });
  }

  private handleTouchHover(): void {
    // Find elements that rely on hover states
    const hoverElements = document.querySelectorAll('.service-card, .category, .logo-placeholder') as NodeListOf<HTMLElement>;
    
    hoverElements.forEach(element => {
      element.addEventListener('touchstart', function(this: HTMLElement) {
        // First remove .touch-hover from all elements
        hoverElements.forEach(el => el.classList.remove('touch-hover'));
        
        // Add the class to the tapped element
        this.classList.add('touch-hover');
      });
    });
    
    // Remove all touch-hover classes when tapping elsewhere
    document.addEventListener('touchstart', (e) => {
      const target = e.target as HTMLElement;
      let isHoverElement = false;
      
      hoverElements.forEach(el => {
        if (el.contains(target)) {
          isHoverElement = true;
        }
      });
      
      if (!isHoverElement) {
        hoverElements.forEach(el => el.classList.remove('touch-hover'));
      }
    });
  }
}

/**
 * Performance optimizations
 */
class PerformanceOptimizations {
  constructor() {
    this.init();
  }

  private init(): void {
    // Defer non-critical JavaScript
    this.deferNonCriticalJS();
    
    // Add passive event listeners for touch events
    this.addPassiveEventListeners();
  }

  private deferNonCriticalJS(): void {
    // Dynamically load non-critical scripts
    window.addEventListener('load', () => {
      setTimeout(() => {
        // Example: defer loading social media widgets
        const socialScripts = [
          // List of non-critical script URLs
        ];
        
        socialScripts.forEach(url => {
          const script = document.createElement('script');
          script.src = url;
          script.defer = true;
          document.body.appendChild(script);
        });
      }, 2000); // 2 second delay after page load
    });
  }

  private addPassiveEventListeners(): void {
    // Use passive event listeners for scroll events
    // This is a polyfill for browsers that don't support passive
    try {
      const options = {
        get passive() {
          // This function will be called if passive is supported
          window.addEventListener('test', null as any, {
            get passive() {
              return true;
            }
          });
          return true;
        }
      };
      
      window.addEventListener('test', null as any, options);
      window.removeEventListener('test', null as any, options);
    } catch (err) {
      console.error('Passive event listeners not supported');
    }
  }
}

/**
 * Initial app setup to run all enhancements
 */
class App {
  constructor() {
    // Add a class to body based on device capability
    this.detectDeviceCapabilities();
    
    // Initialize all enhancements
    this.initializeEnhancements();
    
    // Add CSS Animations
    this.addAnimationStyles();
  }

  private detectDeviceCapabilities(): void {
    const body = document.body;
    
    // Check for touch capability
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      body.classList.add('touch-device');
    } else {
      body.classList.add('no-touch');
    }
    
    // Check for mobile vs desktop
    if (window.innerWidth < 768) {
      body.classList.add('mobile-view');
    } else {
      body.classList.add('desktop-view');
    }
    
    // Listen for changes
    window.addEventListener('resize', () => {
      if (window.innerWidth < 768) {
        body.classList.remove('desktop-view');
        body.classList.add('mobile-view');
      } else {
        body.classList.remove('mobile-view');
        body.classList.add('desktop-view');
      }
    });
  }

  private initializeEnhancements(): void {
    // Initialize all classes
    new MobileNavigation();
    new ScrollSpy();
    new SmoothScroll();
    new CounterAnimation();
    new LazyLoader();
    new InteractiveContactCards();
    new ScrollAnimation();
    new ContactForm();
    new NepaliDateTime();
    new ResponsiveImages();
    new TouchOptimizations();
    new PerformanceOptimizations();
  }

  private addAnimationStyles(): void {
    // Create a style element
    const style = document.createElement('style');
    style.textContent = `
      /* Animation keyframes and classes */
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeInDown {
        from {
          opacity: 0;
          transform: translateY(-30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeInLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes fadeInRight {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes popIn {
        from {
          opacity: 0;
          transform: scale(0.8);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      /* Animation initial state */
      .animate-init {
        opacity: 0;
      }
      
      /* Animation classes */
      .fade-in-up {
        animation: fadeInUp 0.6s ease forwards;
      }
      
      .fade-in-down {
        animation: fadeInDown 0.6s ease forwards;
      }
      
      .fade-in-left {
        animation: fadeInLeft 0.6s ease forwards;
      }
      
      .fade-in-right {
        animation: fadeInRight 0.6s ease forwards;
      }
      
      .pop-in {
        animation: popIn 0.5s ease forwards;
      }
      
      /* Mobile-specific styles */
      @media (max-width: 768px) {
        .mobile-view .container {
          padding-left: 15px;
          padding-right: 15px;
        }
        
        .mobile-view .nav-links {
          position: fixed;
          top: 0;
          right: -100%;
          width: 80%;
          height: 100vh;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          padding: 40px 20px;
          transition: right 0.3s ease;
          z-index: 1000;
        }
        
        .mobile-view .nav-links.show {
          right: 0;
        }
        
        .mobile-view .nav-links li {
          margin: 15px 0;
          width: 100%;
          opacity: 0;
        }
        
        .mobile-view .mobile-menu-btn {
          display: block;
          z-index: 1001;
          background: transparent;
          border: none;
          font-size: 24px;
          color: #4a89dc;
          cursor: pointer;
        }
        
        .mobile-view .mobile-menu-btn.active {
          color: #e74c3c;
        }
        
        /* Contact card improvements for mobile */
        .mobile-view .contact-card {
          height: auto;
          min-height: 180px;
        }
        
        .mobile-view .contact-card.active .card-front {
          transform: rotateY(180deg);
        }
        
        .mobile-view .contact-card.active .card-back {
          transform: rotateY(0deg);
        }
        
        /* Form improvements for mobile */
        .mobile-view .form-group {
          margin-bottom: 15px;
        }
        
        .mobile-view input,
        .mobile-view textarea,
        .mobile-view select,
        .mobile-view button {
          font-size: 16px; /* Prevent iOS zoom on focus */
        }
        
        /* Error message styling */
        .error-message {
          color: #e74c3c;
          font-size: 12px;
          margin-top: 5px;
        }
        
        .invalid {
  border-color: #e74c3c !important;
  background-color: rgba(231, 76, 60, 0.05);
}

/* Form status message */
.form-status {
  padding: 10px;
  border-radius: 4px;
  margin-top: 15px;
  display: none;
}

.form-status.success {
  display: block;
  background-color: #dff0d8;
  color: #3c763d;
  border: 1px solid #d6e9c6;
}

.form-status.error {
  display: block;
  background-color: #f2dede;
  color: #a94442;
  border: 1px solid #ebccd1;
}

/* Mobile image placeholders */
.mobile-view .img-placeholder {
  position: relative;
  overflow: hidden;
  background-color: #f9f9f9;
  transition: background-color 0.3s ease;
}

.mobile-view .img-placeholder img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.mobile-view .img-placeholder.loaded {
  background-color: transparent;
}

.mobile-view .img-placeholder.loaded img {
  opacity: 1;
}

/* Touch hover alternative */
.touch-hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
  transition: all 0.3s ease;
}

/* Better touch feedback */
.touch-device button:active,
.touch-device a:active {
  transform: scale(0.95);
}

/* Optimize fonts for better readability on mobile */
.mobile-view {
  font-size: 16px;
  line-height: 1.5;
}

.mobile-view h1 {
  font-size: 24px;
}

.mobile-view h2 {
  font-size: 20px;
}

.mobile-view h3 {
  font-size: 18px;
}

/* Better mobile grid layout */
.mobile-view .grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
}

.mobile-view .grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

/* Mobile-friendly buttons */
.mobile-view .btn {
  padding: 12px 20px;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Optimized scroll behavior */
.mobile-view {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

/* Time and date display for mobile */
.mobile-view .time-display {
  font-size: 14px;
}

.mobile-view .time-number {
  font-size: 16px;
  font-weight: bold;
}

.mobile-view .time-ampm {
  font-size: 12px;
}

/* Optimize service cards for mobile */
.mobile-view .service-card {
  padding: 15px;
  min-height: 120px;
}

/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Mobile-friendly lists */
.mobile-view ul,
.mobile-view ol {
  padding-left: 20px;
}

/* Mobile-friendly tables */
.mobile-view table {
  width: 100%;
  display: block;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Print styles for job listings */
@media print {
  header,
  footer,
  nav,
  .sidebar,
  .no-print {
    display: none !important;
  }
  
  body {
    background: white;
    font-size: 12pt;
    color: black;
  }
  
  .job-listing {
    page-break-inside: avoid;
    border: 1px solid #ddd;
    padding: 10px;
    margin: 10px 0;
  }
}
    `;
    
    document.head.appendChild(style);
  }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new App();
});

// Register service worker for offline capability
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registered: ', registration);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}
