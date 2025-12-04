const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

function toggleMenu() {
  hamburger.classList.toggle('active');
  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
}

function closeMenu() {
  hamburger.classList.remove('active');
  sidebar.classList.remove('active');
  overlay.classList.remove('active');
}

hamburger.addEventListener('click', toggleMenu);
overlay.addEventListener('click', closeMenu);

// Close menu when clicking a link
sidebar.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

/* ===== DESKTOP NAVIGATION AUTO-RETRACT ===== */

const navDesktop = document.querySelector('.nav-desktop');
let lastScrollTop = 0;
let scrollTimeout = null;
let isScrolling = false;

if (navDesktop) {
  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Show nav when at top
    if (scrollTop < 50) {
      navDesktop.classList.remove('hide');
      isScrolling = false;
      return;
    }
    
    // Hide nav when scrolling down, show when scrolling up
    if (scrollTop > lastScrollTop) {
      // Scrolling down
      navDesktop.classList.add('hide');
      isScrolling = true;
    } else {
      // Scrolling up
      navDesktop.classList.remove('hide');
      isScrolling = false;
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  };

  // Use requestAnimationFrame for throttled scroll performance
  window.addEventListener('scroll', () => {
    if (scrollTimeout) return;
    
    scrollTimeout = requestAnimationFrame(() => {
      handleScroll();
      scrollTimeout = null;
    });
  }, { passive: true });
  
  // Add click handlers to nav links to auto-hide after click
  navDesktop.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      // Show nav briefly after clicking a link
      navDesktop.classList.remove('hide');
    });
  });
}

/* ===== SCROLL ANIMATIONS ===== */

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all sections, cards, and images
document.querySelectorAll('section, .owner-card, .owner-photo, table').forEach(el => {
  observer.observe(el);
});

// Fade-in animation for headers
window.addEventListener('load', () => {
  const header = document.querySelector('header');
  if (header) {
    header.classList.add('animate-in');
  }
});

// Stagger animation for table rows
const tableRows = document.querySelectorAll('table tr');
tableRows.forEach((row, index) => {
  row.style.setProperty('--delay', `${index * 0.1}s`);
  row.classList.add('stagger-animate');
});

// Enhanced table row interactions
tableRows.forEach((row) => {
  row.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.02)';
  });
  row.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
  });
});

// Smooth scroll for anchor links - using event delegation for better performance
document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a[href^="#"]');
  if (anchor) {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }
});

/* ===== API CONFIGURATION ===== */

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api'
  : '/api';

console.log('🔧 API_URL configured:', API_URL);
console.log('📍 Current hostname:', window.location.hostname);
console.log('📍 Current origin:', window.location.origin);
console.log('🌐 Using backend:', window.location.hostname === 'localhost' ? 'LOCAL (localhost:3000)' : 'PRODUCTION (/api)');

/* ===== CONTACT FORM WITH MATH CAPTCHA ===== */

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  console.log('✅ Contact form found');
  
  // Cache frequently accessed DOM elements
  const contactElements = {
    form: contactForm,
    nameInput: document.getElementById('contactName'),
    emailInput: document.getElementById('contactEmail'),
    phoneInput: document.getElementById('contactPhone'),
    subjectInput: document.getElementById('contactSubject'),
    messageInput: document.getElementById('contactMessage'),
    captchaQuestion: document.getElementById('captchaQuestion'),
    captchaAnswer: document.getElementById('captchaAnswer'),
    verifyCaptchaBtn: document.getElementById('verifyCaptchaBtn'),
    captchaFeedback: document.getElementById('captchaFeedback'),
    captchaBox: document.querySelector('.captcha-box'),
    submitBtn: document.getElementById('submitContactBtn')
  };
  
  let currentCaptchaId = null;
  let captchaVerified = false;
  
  // Initialize captcha on form load
  async function initializeCaptcha() {
    try {
      console.log('🔐 Initializing math captcha...');
      const response = await fetch(`${API_URL}/captcha/generate`, {
        method: 'GET'
      });
      
      const data = await response.json();
      
      if (data.success) {
        currentCaptchaId = data.captchaId;
        contactElements.captchaQuestion.innerHTML = `<p>${data.question}</p>`;
        contactElements.captchaAnswer.disabled = false;
        contactElements.verifyCaptchaBtn.disabled = false;
        contactElements.captchaFeedback.textContent = '';
        contactElements.captchaFeedback.classList.remove('show', 'success', 'error', 'loading');
        captchaVerified = false;
        contactElements.submitBtn.disabled = true;
        console.log(`🔐 Math captcha generated: ${currentCaptchaId}`);
      } else {
        showCaptchaFeedback(data.message || 'Error generating captcha', 'error');
        console.error('Captcha generation failed:', data);
      }
    } catch (error) {
      console.error('❌ Error initializing captcha:', error);
      showCaptchaFeedback('Error loading security challenge. Please refresh.', 'error');
    }
  }
  
  // Verify captcha answer
  contactElements.verifyCaptchaBtn.addEventListener('click', async function(e) {
    e.preventDefault();
    
    const answer = contactElements.captchaAnswer.value;
    
    if (!answer) {
      showCaptchaFeedback('Please enter your answer', 'error');
      return;
    }
    
    try {
      showCaptchaFeedback('Verifying...', 'loading');
      this.disabled = true;
      
      const response = await fetch(`${API_URL}/captcha/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          captchaId: currentCaptchaId,
          answer: parseInt(answer)
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        showCaptchaFeedback('✓ Verified! You can now submit the form.', 'success');
        contactElements.captchaBox.classList.add('verified');
        contactElements.captchaBox.classList.remove('error');
        captchaVerified = true;
        contactElements.submitBtn.disabled = false;
        contactElements.captchaAnswer.disabled = true;
        this.disabled = true;
        console.log('✅ Math captcha verified successfully');
      } else {
        showCaptchaFeedback(data.message || 'Incorrect answer', 'error');
        contactElements.captchaBox.classList.add('error');
        contactElements.captchaBox.classList.remove('verified');
        this.disabled = false;
        console.warn('❌ Captcha verification failed:', data);
      }
    } catch (error) {
      console.error('❌ Error verifying captcha:', error);
      showCaptchaFeedback('Error verifying captcha. Please try again.', 'error');
      this.disabled = false;
    }
  });
  
  function showCaptchaFeedback(message, type) {
    contactElements.captchaFeedback.textContent = message;
    contactElements.captchaFeedback.className = `captcha-feedback show ${type}`;
  }
  
  // Initialize captcha when form is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCaptcha);
  } else {
    initializeCaptcha();
  }
  
  // Handle form submission
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!captchaVerified) {
      showNotification('Please complete the security verification first', 'error');
      return;
    }
    
    console.log('📝 Contact form submitted');
    
    const submitButton = this.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    try {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      
      const formData = {
        name: contactElements.nameInput.value,
        email: contactElements.emailInput.value,
        phone: contactElements.phoneInput.value || '',
        subject: contactElements.subjectInput.value || '',
        message: contactElements.messageInput.value,
        captchaId: currentCaptchaId
      };
      
      console.log('📤 Sending data to:', `${API_URL}/contact`);
      
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      console.log('📬 Response received:', response.status, response.statusText);
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log('✅ Success!');
        showNotification('Thank you! Your message has been sent successfully.', 'success');
        contactForm.reset();
        captchaVerified = false;
        contactElements.captchaBox.classList.remove('verified', 'error');
        contactElements.submitBtn.disabled = true;
        contactElements.captchaAnswer.disabled = false;
        contactElements.verifyCaptchaBtn.disabled = false;
        // Regenerate new captcha for next submission
        initializeCaptcha();
      } else {
        const errorMsg = data.message || data.error || 'Error sending message. Please try again.';
        console.error('Contact form response error:', errorMsg);
        showNotification(errorMsg, 'error');
      }
    } catch (error) {
      console.error('❌ Contact form error:', error);
      showNotification('Error sending message. Please try again or contact us directly.', 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
}

/* ===== NEWSLETTER FORM ===== */

const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  // Cache newsletter form elements
  const newsletterElements = {
    form: newsletterForm,
    emailInput: document.getElementById('newsletter-email'),
    submitBtn: newsletterForm.querySelector('button[type="submit"]'),
    messageDiv: document.getElementById('newsletter-message')
  };
  
  newsletterForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = newsletterElements.emailInput.value;
    const submitButton = newsletterElements.submitBtn;
    const originalButtonText = submitButton.textContent;
    
    try {
      submitButton.disabled = true;
      submitButton.textContent = 'Subscribing...';
      
      const response = await fetch(`${API_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (data.success) {
        newsletterElements.messageDiv.textContent = '✓ Thanks for subscribing! Check your email for confirmation.';
        newsletterElements.messageDiv.className = 'newsletter-message success';
        newsletterForm.reset();
        
        setTimeout(() => {
          newsletterElements.messageDiv.textContent = '';
          newsletterElements.messageDiv.className = '';
        }, 5000);
      } else {
        newsletterElements.messageDiv.textContent = data.message || 'Error subscribing. Please try again.';
        newsletterElements.messageDiv.className = 'newsletter-message error';
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      newsletterElements.messageDiv.textContent = 'Error subscribing. Please try again later.';
      newsletterElements.messageDiv.className = 'newsletter-message error';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
}

/* ===== NOTIFICATION MANAGER - UNIFIED NOTIFICATION SYSTEM ===== */

const notificationManager = {
  show(message, type = 'success', duration = 4000) {
    const div = document.createElement('div');
    div.className = `notification notification-${type}`;
    div.textContent = message;
    
    document.body.appendChild(div);
    
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      setTimeout(() => {
        div.classList.add('notification-exit');
        setTimeout(() => div.remove(), 300);
      }, duration);
    });
  },
  
  success: (msg, duration = 4000) => notificationManager.show(msg, 'success', duration),
  error: (msg, duration = 4000) => notificationManager.show(msg, 'error', duration),
  call: (phone) => notificationManager.show(`📞 Calling ${phone}...`, 'success', 3000),
  email: (email) => notificationManager.show(`📧 Opening email to ${email}...`, 'error', 3000)
};

// Alias for legacy code compatibility
function showNotification(message, type = 'success') {
  notificationManager.show(message, type);
}

/* ===== CTA BUTTON HANDLERS ===== */

// Add click handlers to phone/call buttons
document.addEventListener('click', (e) => {
  const callButton = e.target.closest('a[href^="tel:"]');
  if (callButton) {
    const phoneNumber = callButton.getAttribute('href').replace('tel:', '');
    notificationManager.call(phoneNumber);
  }
});

// Add click handlers to email buttons
document.addEventListener('click', (e) => {
  const emailButton = e.target.closest('a[href^="mailto:"]');
  if (emailButton) {
    const emailAddress = emailButton.getAttribute('href').replace('mailto:', '').split('?')[0];
    notificationManager.email(emailAddress);
  }
});
