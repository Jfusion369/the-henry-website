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
  window.addEventListener('scroll', () => {
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
  }, false);
  
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
  row.style.animationDelay = `${index * 0.1}s`;
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

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ===== API CONFIGURATION ===== */

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api'
  : '/api';

console.log('🔧 API_URL configured:', API_URL);
console.log('📍 Current hostname:', window.location.hostname);
console.log('📍 Current origin:', window.location.origin);
console.log('🌐 Using backend:', window.location.hostname === 'localhost' ? 'LOCAL (localhost:3000)' : 'PRODUCTION (/api)');

/* ===== CONTACT FORM WITH VISUAL SECURITY ===== */

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  console.log('✅ Contact form found');
  
  let currentCaptchaId = null;
  let captchaVerified = false;
  let isVisualQuestion = false;
  
  // Initialize security question on form load
  async function initializeSecurity() {
    try {
      console.log('🔐 Initializing visual security question...');
      const response = await fetch(`${API_URL}/captcha/generate`, {
        method: 'GET'
      });
      
      const data = await response.json();
      
      if (data.success) {
        currentCaptchaId = data.captchaId;
        isVisualQuestion = data.isVisual || false;
        
        if (isVisualQuestion && data.imageSvg) {
          // Display visual question
          console.log(`🖼️ Visual question loaded: ${data.type}`);
          document.getElementById('captchaVisualContainer').style.display = 'block';
          document.getElementById('captchaQuestion').style.display = 'none';
          document.getElementById('captchaQuestionText').textContent = data.question;
          document.getElementById('captchaSvgDisplay').innerHTML = data.imageSvg;
          document.getElementById('captchaHint').textContent = `💡 Hint: ${data.hint}`;
          
          // Accept text input for visual questions
          document.getElementById('captchaAnswer').type = 'text';
          document.getElementById('captchaAnswer').placeholder = 'Enter your answer';
        } else {
          // Display math question (fallback)
          console.log('🔐 Math question loaded (fallback)');
          document.getElementById('captchaVisualContainer').style.display = 'none';
          document.getElementById('captchaQuestion').style.display = 'block';
          document.getElementById('captchaQuestion').innerHTML = `<p>${data.question}</p>`;
          
          // Accept numeric input for math questions
          document.getElementById('captchaAnswer').type = 'number';
          document.getElementById('captchaAnswer').placeholder = 'Your answer';
        }
        
        document.getElementById('captchaAnswer').disabled = false;
        document.getElementById('verifyCaptchaBtn').disabled = false;
        document.getElementById('captchaFeedback').textContent = '';
        document.getElementById('captchaFeedback').classList.remove('show', 'success', 'error', 'loading');
        captchaVerified = false;
        document.getElementById('submitContactBtn').disabled = true;
        console.log(`✅ Security question ready: ${currentCaptchaId}`);
      } else {
        showCaptchaFeedback(data.message || 'Error loading security question', 'error');
        console.error('Security question generation failed:', data);
      }
    } catch (error) {
      console.error('❌ Error initializing security:', error);
      showCaptchaFeedback('Error loading security question. Please refresh.', 'error');
    }
  }
  
  // Verify security question answer
  document.getElementById('verifyCaptchaBtn').addEventListener('click', async function(e) {
    e.preventDefault();
    
    const answer = document.getElementById('captchaAnswer').value;
    
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
          answer: answer
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        showCaptchaFeedback('✓ Verified! You can now submit the form.', 'success');
        document.querySelector('.captcha-box').classList.add('verified');
        document.querySelector('.captcha-box').classList.remove('error');
        captchaVerified = true;
        document.getElementById('submitContactBtn').disabled = false;
        document.getElementById('captchaAnswer').disabled = true;
        this.disabled = true;
        console.log('✅ Security verification passed');
      } else {
        showCaptchaFeedback(data.message || 'Incorrect answer. Please try again.', 'error');
        document.querySelector('.captcha-box').classList.add('error');
        document.querySelector('.captcha-box').classList.remove('verified');
        this.disabled = false;
        console.warn('❌ Verification failed:', data);
      }
    } catch (error) {
      console.error('❌ Error verifying answer:', error);
      showCaptchaFeedback('Error verifying answer. Please try again.', 'error');
      this.disabled = false;
    }
  });
  
  function showCaptchaFeedback(message, type) {
    const feedbackDiv = document.getElementById('captchaFeedback');
    feedbackDiv.textContent = message;
    feedbackDiv.className = `captcha-feedback show ${type}`;
  }
  
  // Initialize security on form ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSecurity);
  } else {
    initializeSecurity();
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
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        phone: document.getElementById('contactPhone').value || '',
        subject: document.getElementById('contactSubject').value || '',
        message: document.getElementById('contactMessage').value,
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
        document.querySelector('.captcha-box').classList.remove('verified', 'error');
        document.getElementById('submitContactBtn').disabled = true;
        document.getElementById('captchaAnswer').disabled = false;
        document.getElementById('verifyCaptchaBtn').disabled = false;
        // Regenerate new security question for next submission
        initializeSecurity();
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
  newsletterForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('newsletter-email').value;
    const messageDiv = document.getElementById('newsletter-message');
    const submitButton = this.querySelector('button[type="submit"]');
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
        messageDiv.textContent = '✓ Thanks for subscribing! Check your email for confirmation.';
        messageDiv.className = 'newsletter-message success';
        newsletterForm.reset();
        
        setTimeout(() => {
          messageDiv.textContent = '';
          messageDiv.className = '';
        }, 5000);
      } else {
        messageDiv.textContent = data.message || 'Error subscribing. Please try again.';
        messageDiv.className = 'newsletter-message error';
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      messageDiv.textContent = 'Error subscribing. Please try again later.';
      messageDiv.className = 'newsletter-message error';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
}

/* ===== NOTIFICATION HELPER ===== */

function showNotification(message, type = 'success') {
  const notificationDiv = document.createElement('div');
  notificationDiv.className = `notification notification-${type}`;
  notificationDiv.textContent = message;
  notificationDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#2f8f55' : '#d32f2f'};
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    font-weight: 600;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideInDown 0.3s ease-out;
    max-width: 90%;
  `;
  
  document.body.appendChild(notificationDiv);
  
  setTimeout(() => {
    notificationDiv.style.animation = 'slideOutUp 0.3s ease-out';
    setTimeout(() => notificationDiv.remove(), 300);
  }, 4000);
}

/* ===== CTA BUTTON CALL REMINDER ===== */

// Add click handlers to phone/call buttons
document.querySelectorAll('a[href^="tel:"]').forEach(callButton => {
  callButton.addEventListener('click', function(e) {
    // Show a visual reminder/confirmation
    const phoneNumber = this.getAttribute('href').replace('tel:', '');
    
    // Create and show a reminder notification
    const reminderDiv = document.createElement('div');
    reminderDiv.className = 'call-reminder';
    reminderDiv.textContent = `📞 Calling ${phoneNumber}...`;
    reminderDiv.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #2f8f55;
      color: white;
      padding: 15px 25px;
      border-radius: 8px;
      font-weight: 600;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideInUp 0.3s ease-out;
    `;
    
    document.body.appendChild(reminderDiv);
    
    // Remove reminder after 3 seconds
    setTimeout(() => {
      reminderDiv.style.animation = 'slideOutDown 0.3s ease-out';
      setTimeout(() => reminderDiv.remove(), 300);
    }, 3000);
  });
});

/* ===== CTA BUTTON EMAIL REMINDER ===== */

// Add click handlers to email buttons
document.querySelectorAll('a[href^="mailto:"]').forEach(emailButton => {
  emailButton.addEventListener('click', function(e) {
    // Show a visual reminder/confirmation
    const emailAddress = this.getAttribute('href').replace('mailto:', '').split('?')[0];
    
    // Create and show a reminder notification
    const reminderDiv = document.createElement('div');
    reminderDiv.className = 'email-reminder';
    reminderDiv.textContent = `📧 Opening email to ${emailAddress}...`;
    reminderDiv.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #9E1B32;
      color: white;
      padding: 15px 25px;
      border-radius: 8px;
      font-weight: 600;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideInUp 0.3s ease-out;
    `;
    
    document.body.appendChild(reminderDiv);
    
    // Remove reminder after 3 seconds
    setTimeout(() => {
      reminderDiv.style.animation = 'slideOutDown 0.3s ease-out';
      setTimeout(() => reminderDiv.remove(), 300);
    }, 3000);
  });
});
