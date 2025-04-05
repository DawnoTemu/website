// Mobile Navigation
function initMobileNav() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    
    if (!mobileMenuToggle || !mobileNav) return;
    
    // Toggle mobile menu function
    function toggleMobileMenu(show) {
        const spans = mobileMenuToggle.querySelectorAll('span');
        
        if (show) {
            // Show menu
            mobileMenuToggle.classList.add('active');
            mobileNav.classList.remove('hidden');
            mobileNav.classList.add('flex');
            
            // Delay the transform to ensure the display change happens first
            setTimeout(() => {
                mobileNav.classList.remove('translate-x-full');
            }, 10);
            
            // Show overlay with a slight delay for a nice effect
            if (mobileNavOverlay) {
                mobileNavOverlay.classList.remove('hidden', 'opacity-0');
                setTimeout(() => {
                    mobileNavOverlay.classList.add('opacity-100');
                }, 50);
            }
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
            // Animate hamburger to X
            spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
        } else {
            // Hide menu
            mobileMenuToggle.classList.remove('active');
            mobileNav.classList.add('translate-x-full');
            
            // Hide overlay with animation
            if (mobileNavOverlay) {
                mobileNavOverlay.classList.remove('opacity-100');
                mobileNavOverlay.classList.add('opacity-0');
            }
            
            // Reset body scroll
            document.body.style.overflow = '';
            
            // Reset hamburger icon
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
            
            // Delay the hiding to allow for animation
            setTimeout(() => {
                if (mobileNav.classList.contains('translate-x-full')) {
                    mobileNav.classList.remove('flex');
                    mobileNav.classList.add('hidden');
                    
                    if (mobileNavOverlay) {
                        mobileNavOverlay.classList.add('hidden');
                    }
                }
            }, 300); // Match this with the CSS transition duration
        }
    }
    
    // Toggle menu on hamburger click
    mobileMenuToggle.addEventListener('click', function() {
        const isCurrentlyHidden = mobileNav.classList.contains('hidden') || mobileNav.classList.contains('translate-x-full');
        toggleMobileMenu(isCurrentlyHidden);
    });
    
    // Close menu when overlay is clicked
    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', () => {
            toggleMobileMenu(false);
        });
    }
    
    // Close mobile menu when clicking a link
    const mobileNavLinks = mobileNav.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            toggleMobileMenu(false);
        });
    });
    
    // Handle accordion submenus if present
    const subMenuToggles = document.querySelectorAll('.submenu-toggle');
    subMenuToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const submenu = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            // Toggle submenu visibility
            if (submenu) {
                if (submenu.classList.contains('hidden')) {
                    // Open submenu
                    submenu.classList.remove('hidden');
                    this.setAttribute('aria-expanded', 'true');
                    
                    // Animate height from 0 to auto
                    submenu.style.height = '0';
                    const height = submenu.scrollHeight;
                    submenu.style.height = height + 'px';
                    
                    // Rotate icon
                    if (icon) {
                        icon.style.transform = 'rotate(180deg)';
                    }
                } else {
                    // Close submenu
                    submenu.style.height = '0';
                    this.setAttribute('aria-expanded', 'false');
                    
                    // Reset icon
                    if (icon) {
                        icon.style.transform = 'rotate(0)';
                    }
                    
                    // After animation completes, hide the element
                    setTimeout(() => {
                        submenu.classList.add('hidden');
                    }, 300);
                }
            }
        });
    });
    
    // Handle resize events
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && (!mobileNav.classList.contains('hidden') || !mobileNav.classList.contains('translate-x-full'))) {
            toggleMobileMenu(false);
        }
    });
    
    // Handle escape key to close menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && (!mobileNav.classList.contains('hidden') || !mobileNav.classList.contains('translate-x-full'))) {
            toggleMobileMenu(false);
        }
    });
    
    // Highlight current page in mobile menu
    highlightCurrentPage();
}

// Form submission handler
function initForms() {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]')?.value;
            
            // Display success message
            const successMessage = document.createElement('div');
            successMessage.className = 'bg-mint text-text-dark p-4 rounded-lg mt-4 text-sm font-medium animate-fade-in';
            successMessage.textContent = email 
                ? `Dziękujemy! Na adres ${email} wyślemy informacje o dostępie do aplikacji.`
                : 'Dziękujemy! Twoja wiadomość została wysłana.';
            
            form.appendChild(successMessage);
            form.reset();
            
            // Remove message after 5 seconds
            setTimeout(() => {
                successMessage.className += ' animate-fade-out';
                setTimeout(() => {
                    form.removeChild(successMessage);
                }, 500);
            }, 5000);
        });
    });
}

// Smooth scrolling
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// FAQ Toggle handler
function initFaqToggle() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (!faqQuestions.length) return;
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentNode;
            const isActive = item.classList.contains('active');
            const toggleIcon = question.querySelector('span');
            
            // Close all others
            document.querySelectorAll('.faq-item').forEach(faqItem => {
                faqItem.classList.remove('active');
                const answer = faqItem.querySelector('.faq-answer');
                answer.style.maxHeight = null;
                faqItem.querySelector('span').textContent = '+';
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                toggleIcon.textContent = '−';
                item.classList.add('shadow-sm-custom', 'border-lavender/30');
            }
        });
    });
}

// Function to highlight current page in navigation
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    
    // Map of paths to their respective nav IDs
    const pathToNavMap = {
        '/': 'nav-home',
        '/index.html': 'nav-home',
        '/o-nas': 'nav-about',
        '/o-nas.html': 'nav-about',
        '/biblioteka': 'nav-library',
        '/biblioteka.html': 'nav-library',
        '/kontakt': 'nav-contact',
        '/kontakt.html': 'nav-contact'
    };
    
    // Get all navigation links in desktop and mobile menu
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Remove active class from all links
    navLinks.forEach(link => {
        link.classList.remove('active-nav');
    });
    
    // Add active class to current page link
    const currentNavId = pathToNavMap[currentPath];
    if (currentNavId) {
        const activeLinks = document.querySelectorAll(`#${currentNavId}`);
        activeLinks.forEach(link => {
            link.classList.add('active-nav');
        });
    }
}

function initCookieConsent() {
    const cookieConsent = document.getElementById('cookie-consent');
    if (!cookieConsent) return; // Exit if banner doesn't exist

    const cookieSettings = document.getElementById('cookie-settings');
    const acceptAllBtn = document.getElementById('cookie-accept-all');
    const advancedBtn = document.getElementById('cookie-advanced');
    const saveBtn = document.getElementById('cookie-save');

    // Cookie utility functions
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Hide the banner if consent was already given
    if (getCookie('cookie-consent')) {
        cookieConsent.style.display = 'none';
    }

    // Set up toggle switches
    document.querySelectorAll('.toggle-container input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
        if (this.checked) {
            this.nextElementSibling.classList.add('bg-lavender');
            this.nextElementSibling.classList.remove('bg-lavender/30');
            this.nextElementSibling.querySelector('.toggle-dot').style.transform = 'translateX(20px)';
        } else {
            this.nextElementSibling.classList.remove('bg-lavender');
            this.nextElementSibling.classList.add('bg-lavender/30');
            this.nextElementSibling.querySelector('.toggle-dot').style.transform = 'translateX(1px)';
        }
        });
    });

    // Accept all cookies
    acceptAllBtn.addEventListener('click', function() {
        setCookie('cookie-consent', 'all', 365);
        setCookie('cookie-analytics', 'true', 365);
        setCookie('cookie-marketing', 'true', 365);
        setCookie('cookie-functional', 'true', 365);
        
        cookieConsent.style.display = 'none';
    });

    // Show advanced settings
    advancedBtn.addEventListener('click', function() {
        cookieSettings.classList.toggle('hidden');
        
        // Update toggle states based on cookie values or default to checked
        document.getElementById('cookie-analytics').checked = getCookie('cookie-analytics') !== 'false';
        document.getElementById('cookie-marketing').checked = getCookie('cookie-marketing') !== 'false';
        document.getElementById('cookie-functional').checked = getCookie('cookie-functional') !== 'false';
        
        // Manually trigger change event for each checkbox to update visuals
        document.querySelectorAll('.toggle-container input[type="checkbox"]').forEach(checkbox => {
        const event = new Event('change');
        checkbox.dispatchEvent(event);
        });
    });

    // Save cookie preferences
    saveBtn.addEventListener('click', function() {
        setCookie('cookie-consent', 'custom', 365);
        setCookie('cookie-analytics', document.getElementById('cookie-analytics').checked, 365);
        setCookie('cookie-marketing', document.getElementById('cookie-marketing').checked, 365);
        setCookie('cookie-functional', document.getElementById('cookie-functional').checked, 365);
        
        cookieConsent.style.display = 'none';
    });
}

function initFeatureHover(){
          // Select all feature boxes 
  const featureBoxes = document.querySelectorAll('#features .feature-box');
  
  // Disable normal hover effects with CSS
  const style = document.createElement('style');
  style.textContent = `
    #features .flex.items-start.gap-6.p-6.rounded-md-custom {
      pointer-events: none !important;
    }
  `;
  document.head.appendChild(style);
  
  let currentIndex = 0;
  
  // Function to apply hover effect to one box at a time
  function rotateHoverEffect() {
    // Remove effect from all boxes
    featureBoxes.forEach(box => {
      box.style.transform = '';
      box.style.boxShadow = '';
      box.style.borderColor = '';
    });
    
    // Apply hover effect to current box
    const currentBox = featureBoxes[currentIndex];
    currentBox.style.transform = 'translateY(-0.25rem)'; // hover:-translate-y-1
    currentBox.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'; // hover:shadow-md-custom
    currentBox.style.borderColor = 'rgba(212, 193, 236, 0.3)'; // hover:border-lavender/30
    
    // Move to next box for the next iteration
    currentIndex = (currentIndex + 1) % featureBoxes.length;
  }
  
  // Apply initial effect to first box
  rotateHoverEffect();
  
  // Set up interval to cycle through boxes
  setInterval(rotateHoverEffect, 3000); // Changes every 3 seconds
}
// Initialize all components on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    initMobileNav();
    initForms();
    initSmoothScroll();
    initFaqToggle();
    initCookieConsent();
    initFeatureHover();
});