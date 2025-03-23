// Mobile Navigation
function initMobileNav() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (!mobileMenuToggle || !mobileNav) return;
    
    mobileMenuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileNav.classList.toggle('hidden');
        mobileNav.classList.toggle('flex');
        
        // Toggle transform for slide effect
        if (mobileNav.classList.contains('translate-x-full')) {
            mobileNav.classList.remove('translate-x-full');
        } else {
            mobileNav.classList.add('translate-x-full');
        }
        
        // Toggle body scroll
        if (!mobileNav.classList.contains('hidden')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        
        // Animate hamburger to X
        const spans = this.querySelectorAll('span');
        if (this.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        }
    });
    
    // Close mobile menu when clicking a link
    const mobileNavLinks = mobileNav.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileNav.classList.add('hidden');
            mobileNav.classList.remove('flex');
            mobileNav.classList.add('translate-x-full');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset hamburger icon
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        });
    });
    
    // Handle resize events
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && !mobileNav.classList.contains('hidden')) {
            mobileNav.classList.add('hidden');
            mobileNav.classList.remove('flex');
            mobileNav.classList.add('translate-x-full');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset hamburger icon
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        }
    });
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

// Initialize all components on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    initMobileNav();
    initForms();
    initSmoothScroll();
    initFaqToggle();
});