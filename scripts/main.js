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

/* ===== NEWSLETTER FORM ===== */

const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('newsletter-email').value;
    const messageDiv = document.getElementById('newsletter-message');
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      messageDiv.textContent = 'Please enter a valid email address.';
      messageDiv.className = 'newsletter-message error';
      return;
    }
    
    // Store email in localStorage (for future CMS integration)
    let subscribers = JSON.parse(localStorage.getItem('newsletter-subscribers')) || [];
    if (!subscribers.includes(email)) {
      subscribers.push(email);
      localStorage.setItem('newsletter-subscribers', JSON.stringify(subscribers));
    }
    
    // Show success message
    messageDiv.textContent = '✓ Thanks for subscribing! Check your email for confirmation.';
    messageDiv.className = 'newsletter-message success';
    
    // Reset form
    newsletterForm.reset();
    
    // Clear message after 5 seconds
    setTimeout(() => {
      messageDiv.textContent = '';
      messageDiv.className = '';
    }, 5000);
  });
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