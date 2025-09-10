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
    const cookieConsent   = document.getElementById('cookie-consent');
    if(!cookieConsent) return;
    const cookieSettings  = document.getElementById('cookie-settings');
    const acceptAllBtn    = document.getElementById('cookie-accept-all');
    const advancedBtn     = document.getElementById('cookie-advanced');
    const saveBtn         = document.getElementById('cookie-save');

    // Debug: Log UTM parameters for Meta ads tracking
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'].forEach(param => {
        if (urlParams.get(param)) {
            utmParams[param] = urlParams.get(param);
        }
    });
    
    if (Object.keys(utmParams).length > 0) {
        console.log('DawnoTemu: UTM parameters detected:', utmParams);
        // Store UTM params in sessionStorage for tracking
        sessionStorage.setItem('dawnotemu_utm_params', JSON.stringify(utmParams));
        
        // Send UTM detection event to GA4 once consent is granted
        window.addEventListener('load', function() {
            setTimeout(() => {
                if (typeof gtag === 'function') {
                    gtag('event', 'utm_parameters_detected', {
                        utm_source: utmParams.utm_source || '',
                        utm_medium: utmParams.utm_medium || '',
                        utm_campaign: utmParams.utm_campaign || '',
                        fbclid: utmParams.fbclid ? 'detected' : '',
                        page_location: window.location.href
                    });
                }
            }, 1000); // Wait for GTM to initialize
        });
    }
  
    /* ---------- tiny cookie helpers ---------- */
    function setCookie(name,value,days){
      let expires="";
      if(days){
        const d=new Date();
        d.setTime(d.getTime()+days*24*60*60*1000);
        expires="; expires="+d.toUTCString();
      }
      document.cookie=name+"="+(value||"")+expires+"; path=/; SameSite=Lax";
    }
    function getCookie(name){
      const nameEQ=name+"=";
      const ca=document.cookie.split(';');
      for(let c of ca){
        while(c.charAt(0)===' ') c=c.substring(1);
        if(c.indexOf(nameEQ)===0) return c.substring(nameEQ.length);
      }
      return null;
    }
  
    /* ---------- GA Consent sync helper ---------- */
    function updateGtagConsent(){
      const analytics   = document.getElementById('cookie-analytics').checked;
      const marketing   = document.getElementById('cookie-marketing').checked;
      const functional  = document.getElementById('cookie-functional').checked;
  
      gtag('consent','update',{
        analytics_storage:      analytics  ? 'granted':'denied',
        ad_storage:             marketing  ? 'granted':'denied',
        ad_user_data:           marketing  ? 'granted':'denied',      // v2 field
        ad_personalization:     marketing  ? 'granted':'denied',      // v2 field  
        personalization_storage:marketing  ? 'granted':'denied',
        functionality_storage:  functional ? 'granted':'denied'
      });
      
      // Debug logging for consent updates
      console.log('DawnoTemu: Updated consent -', {
        analytics: analytics ? 'granted' : 'denied',
        marketing: marketing ? 'granted' : 'denied',
        functional: functional ? 'granted' : 'denied'
      });
    }
  
    /* ---------- start-up state ---------- */
    if(getCookie('cookie-consent')){
      cookieConsent.style.display='none';
      updateGtagConsent(); // respect stored prefs on reload
      return; // nothing else to do
    }
  
    /* ---------- toggle switch visuals ---------- */
    document.querySelectorAll('.toggle-container input[type="checkbox"]').forEach(cb=>{
      cb.addEventListener('change',function(){
        const track=this.nextElementSibling; // label
        if(this.checked){
          track.classList.add('bg-lavender');
          track.classList.remove('bg-lavender/30');
          track.querySelector('.toggle-dot').style.transform='translateX(20px)';
        }else{
          track.classList.remove('bg-lavender');
          track.classList.add('bg-lavender/30');
          track.querySelector('.toggle-dot').style.transform='translateX(1px)';
        }
      });
    });
  
    /* ---------- Accept All ---------- */
    acceptAllBtn.addEventListener('click',()=>{
      setCookie('cookie-consent','all',365);
      setCookie('cookie-analytics','true',365);
      setCookie('cookie-marketing','true',365);
      setCookie('cookie-functional','true',365);
  
      gtag('consent','update',{
        ad_storage:'granted',
        analytics_storage:'granted',
        ad_user_data:'granted',           // v2 field
        ad_personalization:'granted',     // v2 field
        personalization_storage:'granted',
        functionality_storage:'granted'
      });
      
      // Debug logging and GA4 event
      console.log('DawnoTemu: Accepted all cookies');
      
      // Send custom event to GA4 for tracking consent acceptance
      if (typeof gtag === 'function') {
        gtag('event', 'consent_accepted', {
          consent_type: 'all',
          custom_parameter: 'dawnotemu_consent'
        });
      }
      
      cookieConsent.style.display='none';
    });
  
    /* ---------- Advanced panel ---------- */
    advancedBtn.addEventListener('click',()=>{
      cookieSettings.classList.toggle('hidden');
      // restore checkbox states from cookies or defaults
      const a=getCookie('cookie-analytics') !== 'false';
      const m=getCookie('cookie-marketing') !== 'false';
      const f=getCookie('cookie-functional') !== 'false';
      document.getElementById('cookie-analytics').checked  = a;
      document.getElementById('cookie-marketing').checked  = m;
      document.getElementById('cookie-functional').checked = f;
      document.querySelectorAll('.toggle-container input').forEach(cb=>cb.dispatchEvent(new Event('change')));
    });
  
    /* ---------- Save prefs ---------- */
    saveBtn.addEventListener('click',()=>{
      setCookie('cookie-consent','custom',365);
      const analytics = document.getElementById('cookie-analytics').checked;
      const marketing = document.getElementById('cookie-marketing').checked;
      const functional= document.getElementById('cookie-functional').checked;
      setCookie('cookie-analytics',analytics,365);
      setCookie('cookie-marketing',marketing,365);
      setCookie('cookie-functional',functional,365);
      updateGtagConsent();
      
      // Send custom event to GA4 for tracking custom consent
      if (typeof gtag === 'function') {
        gtag('event', 'consent_accepted', {
          consent_type: 'custom',
          analytics: analytics ? 'granted' : 'denied',
          marketing: marketing ? 'granted' : 'denied',
          functional: functional ? 'granted' : 'denied'
        });
      }
      
      cookieConsent.style.display='none';
    });
}

function initFeatureHover(){
    // First check if the features section exists on the page
    const featuresSection = document.getElementById('features');
    if (!featuresSection) return; // Exit early if features section doesn't exist

    // Select all feature boxes 
    const featureBoxes = document.querySelectorAll('#features .feature-box');
    if (!featureBoxes.length) return; // Exit if no feature boxes found
      
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
    initFaqToggle();
    initCookieConsent();
    initFeatureHover();
});