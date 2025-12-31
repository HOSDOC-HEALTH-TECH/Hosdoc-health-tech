// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
  initRevealAnimations();
  initDemoFlow();
  initWaitlistForm();
  initMobileMenu();
  initSmoothScroll();
  updateYear();
  initParallax();
});

// Premium reveal animations with Intersection Observer
function initRevealAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('[data-reveal]').forEach(el => {
    observer.observe(el);
  });
}

// Enhanced demo flow with 5 steps
function initDemoFlow() {
  const steps = document.querySelectorAll('.demo-step');
  if (steps.length === 0) return;

  let currentStep = 0;
  const stepDuration = 3500; // 3.5 seconds per step

  function activateStep(index) {
    steps.forEach((step, i) => {
      if (i === index) {
        step.classList.add('active');
        // Add subtle animation
        step.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      } else {
        step.classList.remove('active');
      }
    });
  }

  function nextStep() {
    currentStep = (currentStep + 1) % steps.length;
    activateStep(currentStep);
  }

  // Start with first step
  activateStep(0);

  // Auto-advance with smooth transitions
  setInterval(nextStep, stepDuration);
  
  // Pause on hover for better UX
  const demoContainer = document.querySelector('.demo-container');
  if (demoContainer) {
    let isPaused = false;
    let intervalId = setInterval(nextStep, stepDuration);
    
    demoContainer.addEventListener('mouseenter', () => {
      isPaused = true;
      clearInterval(intervalId);
    });
    
    demoContainer.addEventListener('mouseleave', () => {
      isPaused = false;
      intervalId = setInterval(nextStep, stepDuration);
    });
  }
}

// Premium waitlist form handling
function initWaitlistForm() {
  const form = document.getElementById('waitlistForm');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(form);
    const email = formData.get('email');
    
    if (!email || !isValidEmail(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const input = form.querySelector('input[type="email"]');
    const originalText = submitButton.textContent;
    const originalWidth = submitButton.offsetWidth;
    
    submitButton.textContent = 'Joining...';
    submitButton.style.width = originalWidth + 'px';
    submitButton.disabled = true;
    input.disabled = true;

    try {
      // Replace with your actual endpoint
      const endpoint = form.dataset.endpoint || 'https://formspree.io/f/xleqzqvd';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData
      });

      if (response.ok) {
      form.reset();
        showToast('🎉 Success! You\'re on the early access list.', 'success');
        
        // Track conversion (if analytics is set up)
        if (typeof gtag !== 'undefined') {
          gtag('event', 'conversion', {
            'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
            'value': 1.0,
            'currency': 'USD'
          });
        }
        
        // Track with custom event
        if (typeof analytics !== 'undefined') {
          analytics.track('Waitlist Signup', {
            email: email
          });
        }
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      showToast('Something went wrong. Please try again or email us directly.', 'error');
    } finally {
      submitButton.textContent = originalText;
      submitButton.style.width = '';
      submitButton.disabled = false;
      input.disabled = false;
    }
  });
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Premium toast notification
function showToast(message, type = 'success') {
  // Remove existing toasts
  const existingToasts = document.querySelectorAll('.toast');
  existingToasts.forEach(toast => {
    toast.style.animation = 'toastSlideOut 0.3s ease-out forwards';
    setTimeout(() => toast.remove(), 300);
  });

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  // Premium styles
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '32px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: type === 'success' ? '#10b981' : '#ef4444',
    color: 'white',
    padding: '16px 24px',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1)',
    zIndex: '10000',
    fontSize: '0.9375rem',
    fontWeight: '500',
    maxWidth: '90%',
    textAlign: 'center',
    animation: 'toastSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  });

  // Add animations if not already present
  if (!document.querySelector('style[data-toast-animations]')) {
    const style = document.createElement('style');
    style.setAttribute('data-toast-animations', '');
    style.textContent = `
      @keyframes toastSlideIn {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0) scale(1);
        }
      }
      @keyframes toastSlideOut {
        to {
          opacity: 0;
          transform: translateX(-50%) translateY(-20px) scale(0.95);
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);

  // Auto remove after 4 seconds
  setTimeout(() => {
    toast.style.animation = 'toastSlideOut 0.3s ease-out forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Enhanced mobile menu
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.nav-links');
  const navCta = document.querySelector('.nav-cta');
  
  if (!toggle) return;

  toggle.addEventListener('click', function() {
    const isOpen = toggle.classList.toggle('active');
    
    if (isOpen) {
      // Animate hamburger to X
      toggle.querySelectorAll('span').forEach((span, index) => {
        if (index === 0) span.style.transform = 'rotate(45deg) translateY(8px)';
        if (index === 1) span.style.opacity = '0';
        if (index === 2) span.style.transform = 'rotate(-45deg) translateY(-8px)';
      });
      
      // Create mobile menu overlay
      const overlay = document.createElement('div');
      overlay.className = 'mobile-menu-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(15, 23, 42, 0.6);
        backdrop-filter: blur(8px);
        z-index: 999;
        animation: fadeIn 0.3s ease;
      `;
      
      const menu = document.createElement('div');
      menu.className = 'mobile-menu';
      menu.style.cssText = `
        position: fixed;
        top: 70px;
        left: 0;
        right: 0;
        background: white;
        padding: 24px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-top: 1px solid #e9ecef;
      `;
      
      // Clone nav links
      if (nav) {
        const navClone = nav.cloneNode(true);
        navClone.style.cssText = 'display: flex; flex-direction: column; gap: 20px; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #e9ecef;';
        navClone.querySelectorAll('a').forEach(a => {
          a.style.fontSize = '16px';
          a.style.padding = '8px 0';
        });
        menu.appendChild(navClone);
      }
      
      // Clone CTA buttons
      if (navCta) {
        const ctaClone = navCta.cloneNode(true);
        ctaClone.style.cssText = 'display: flex; flex-direction: column; gap: 12px;';
        ctaClone.querySelectorAll('a').forEach(a => {
          a.style.width = '100%';
          a.style.justifyContent = 'center';
        });
        menu.appendChild(ctaClone);
      }
      
      document.body.appendChild(overlay);
      document.body.appendChild(menu);
      document.body.style.overflow = 'hidden';
      
      // Close on overlay click
      overlay.addEventListener('click', closeMobileMenu);
      
      // Add close animation styles
      if (!document.querySelector('style[data-mobile-menu-animations]')) {
        const style = document.createElement('style');
        style.setAttribute('data-mobile-menu-animations', '');
        style.textContent = `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `;
        document.head.appendChild(style);
      }
    } else {
      closeMobileMenu();
    }
  });
  
  function closeMobileMenu() {
    toggle.classList.remove('active');
    toggle.querySelectorAll('span').forEach((span, index) => {
      span.style.transform = '';
      span.style.opacity = '';
    });
    const overlay = document.querySelector('.mobile-menu-overlay');
    const menu = document.querySelector('.mobile-menu');
    if (overlay) overlay.remove();
    if (menu) menu.remove();
    document.body.style.overflow = '';
  }
  
  // Close on window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        const toggle = document.querySelector('.mobile-menu-toggle');
        if (toggle && toggle.classList.contains('active')) {
          toggle.click();
        }
      }
    });
  });
}

// Subtle parallax effect for hero orbs
function initParallax() {
  const orbs = document.querySelectorAll('.gradient-orb');
  if (orbs.length === 0) return;
  
  let ticking = false;
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        
        orbs.forEach((orb, index) => {
          const speed = (index + 1) * 0.2;
          orb.style.transform = `translateY(${rate * speed}px)`;
        });
        
        ticking = false;
      });
      
      ticking = true;
    }
  });
}

// Update copyright year
function updateYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// Add premium hover effects
document.querySelectorAll('.solution-card, .trust-item, .testimonial-card, .integration-item').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  });
});

// Add click tracking for CTAs (if analytics is set up)
document.querySelectorAll('.primary-btn, .secondary-btn').forEach(button => {
  button.addEventListener('click', function() {
    const text = this.textContent.trim();
    const section = this.closest('section')?.id || 'unknown';
    
    // Track button clicks (replace with your analytics)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'button_click', {
        'button_text': text,
        'button_location': section
      });
    }
    
    if (typeof analytics !== 'undefined') {
      analytics.track('Button Click', {
        text: text,
        location: section
      });
    }
  });
});

// Performance: Lazy load images if any are added later
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  }, {
    rootMargin: '50px'
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
  // Close mobile menu on Escape
  if (e.key === 'Escape') {
    const toggle = document.querySelector('.mobile-menu-toggle');
    if (toggle && toggle.classList.contains('active')) {
      toggle.click();
    }
  }
});

// Add loading state management
window.addEventListener('load', function() {
  document.body.classList.add('loaded');
  
  // Add fade-in animation for body
  if (!document.querySelector('style[data-body-load]')) {
    const style = document.createElement('style');
    style.setAttribute('data-body-load', '');
    style.textContent = `
      body:not(.loaded) {
        opacity: 0;
      }
      body.loaded {
        opacity: 1;
        transition: opacity 0.5s ease;
      }
    `;
    document.head.appendChild(style);
  }
});

// Smooth scroll reveal for sections
function initSectionReveal() {
  const sections = document.querySelectorAll('.section');
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
    if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });
  
  sections.forEach(section => {
    sectionObserver.observe(section);
  });
}

// Initialize section reveal
initSectionReveal();

// Add cursor effect for interactive elements (optional premium touch)
document.querySelectorAll('a, button').forEach(element => {
  element.addEventListener('mouseenter', function() {
    this.style.cursor = 'pointer';
  });
});

// Performance monitoring (optional)
if ('PerformanceObserver' in window) {
  try {
    const perfObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Log performance metrics if needed
        if (entry.entryType === 'navigation') {
          console.log('Page Load Time:', entry.loadEventEnd - entry.fetchStart, 'ms');
        }
      }
    });
    perfObserver.observe({ entryTypes: ['navigation', 'paint'] });
  } catch (e) {
    // Performance observer not supported
  }
}
