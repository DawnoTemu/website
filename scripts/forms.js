/**
 * DawnoTemu Forms Handler
 * Unified handler for all forms (newsletter, contact, research)
 */

// Main configuration
const FORM_CONFIG = {
    // Single endpoint for all form submissions
    endpoint: 'https://hook.eu1.make.com/47b6i2oi75axrdg9u1fkvhg0gze2d79w',
    
    // Form types with their specific fields
    types: {
      newsletter: {
        requiredFields: ['email'],
        successMessage: 'Dziękujemy! Adres {email} został dodany do listy oczekujących rodziców!',
        // New option to redirect after success
        redirectToThankYou: true
      },
      contact: {
        requiredFields: ['email', 'message'],
        successMessage: 'Dziękujemy! Twoja wiadomość została wysłana. Odpowiemy najszybciej jak to możliwe.'
      },
      casting: {
        requiredFields: ['first_name', 'last_name', 'email', 'role_interest', 'consent'],
        successMessage: 'Dziękujemy! Prześlemy pełny brief castingu na adres {email}.'
      },
      research: {
        requiredFields: ['first_name', 'last_name', 'email', 'story_id', 'voice_sample', 'consent'],
        successMessage: 'Dziękujemy za udział w badaniu! Przygotujemy spersonalizowaną bajkę i wyślemy na podany adres email.'
      }
    }
  };
  
  /**
   * Initialize all forms on the page
   */
  function initForms() {
    // Get all forms with the data-form-type attribute
    document.querySelectorAll('form[data-form-type]').forEach((form, index) => {
      // Set a unique ID for each form if it doesn't have one
      if (!form.id) {
        form.id = `form-${form.getAttribute('data-form-type')}-${index}`;
      }
      
      // Add submit event listener to the form
      form.addEventListener('submit', handleFormSubmit);
    });
  
    // Also initialize form file upload listeners for research forms
    initFileUploads();
  }
  
  /**
   * Initialize file upload previews for research forms
   */
  function initFileUploads() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
      const fileInfo = input.parentElement.querySelector('.file-info') || 
                      document.getElementById('file-info');
      
      if (input && fileInfo) {
        input.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) {
            fileInfo.classList.remove('hidden');
            fileInfo.innerHTML = `
              <div class="flex items-center gap-2">
                <span class="text-lavender"><i class="fas fa-file-audio"></i></span>
                <span class="font-medium">${file.name}</span>
                <span class="text-text-light">(${(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            `;
          } else {
            fileInfo.classList.add('hidden');
          }
        });
      }
    });
  }
  
  /**
   * Handle form submission
   * @param {Event} e - The form submit event
   */
  function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formType = form.getAttribute('data-form-type');
    
    // Validate if this is a recognized form type
    if (!FORM_CONFIG.types[formType]) {
      console.error(`Unknown form type: ${formType}`);
      showMessage(form, 'Błąd konfiguracji formularza.', 'error');
      return;
    }
    
    // Get required fields for this form type
    const requiredFields = FORM_CONFIG.types[formType].requiredFields;
    
    // Create formData object with all possible fields (with empty values for fields not in this form)
    const formData = {
      // Common fields
      email: form.querySelector('input[name="email"]')?.value || '',
      message: form.querySelector('textarea[name="message"]')?.value || '',
      first_name: form.querySelector('input[name="first_name"]')?.value || '',
      last_name: form.querySelector('input[name="last_name"]')?.value || '',
      story_id: form.querySelector('select[name="story_id"]')?.value || '',
      phone: form.querySelector('input[name="phone"]')?.value || '',
      role_interest: form.querySelector('[name="role_interest"]')?.value || '',
      city: form.querySelector('input[name="city"]')?.value || '',
      links: form.querySelector('[name="links"]')?.value || '',
      talent_birth_year: form.querySelector('input[name="talent_birth_year"]')?.value || '',
      availability: form.querySelector('input[name="availability"]')?.value || '',
      motivation: form.querySelector('textarea[name="motivation"]')?.value || '',
      consent: form.querySelector('input[name="consent"]')?.checked || false,
      
      // Add metadata
      form_type: formType,
      source: window.location.pathname,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent
    };
    
    // Validation - make sure all required fields for this form type are present
    const missingFields = requiredFields.filter(field => {
      // Skip file validation here, we'll handle it separately
      if (field === 'voice_sample') return false;
      
      // Check all other fields
      const value = formData[field];
      return !value || (typeof value === 'string' && value.trim() === '');
    });
    
    // Special validation for file input (if required)
    const fileInput = form.querySelector('input[type="file"]');
    if (requiredFields.includes('voice_sample') && fileInput && fileInput.files.length === 0) {
      missingFields.push('voice_sample');
    }
    
    // If there are missing fields, show error
    if (missingFields.length > 0) {
      let errorMessage = 'Proszę wypełnić wszystkie wymagane pola.';
      if (missingFields.includes('email')) {
        errorMessage = 'Proszę podać prawidłowy adres email.';
      } else if (missingFields.includes('voice_sample')) {
        errorMessage = 'Proszę załączyć plik z nagraniem głosu.';
      } else if (missingFields.includes('consent')) {
        errorMessage = 'Proszę wyrazić zgodę na przetwarzanie danych.';
      }
      
      showMessage(form, errorMessage, 'error');
      return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Wysyłanie...';
    
    // Handle file upload if present
    if (fileInput && fileInput.files.length > 0) {
      // For research form with file upload, we need to use FormData
      const fileFormData = new FormData();
      
      // Add all form fields to the FormData
      Object.keys(formData).forEach(key => {
        fileFormData.append(key, formData[key]);
      });
      
      // Add the file
      fileFormData.append('voice_sample', fileInput.files[0]);
      
      // Send data to the endpoint
      fetch(FORM_CONFIG.endpoint, {
        method: 'POST',
        body: fileFormData
      })
      .then(handleResponse)
      .then(data => handleSuccess(form, formData, formType))
      .catch(error => handleError(form, error))
      .finally(() => resetButton(submitBtn, originalBtnText));
    } else {
      // For forms without file upload, we can use JSON
      fetch(FORM_CONFIG.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      .then(handleResponse)
      .then(data => handleSuccess(form, formData, formType))
      .catch(error => handleError(form, error))
      .finally(() => resetButton(submitBtn, originalBtnText));
    }
  }
  
  /**
   * Handle API response
   * @param {Response} response - The fetch response
   * @returns {Promise} - The promise with response data
   */
  function handleResponse(response) {
    if (!response.ok) {
      throw new Error(`Network response error: ${response.status}`);
    }
    
    // Try to parse as JSON, but don't fail if not JSON
    return response.text().then(text => {
      try {
        return text ? JSON.parse(text) : {};
      } catch (e) {
        return { message: text };
      }
    });
  }
  
  /**
   * Handle successful form submission
   * @param {HTMLFormElement} form - The form element
   * @param {Object} formData - The submitted form data
   * @param {string} formType - The type of form
   */
  function handleSuccess(form, formData, formType) {
    // Check if this form type should redirect to thank you page
    if (FORM_CONFIG.types[formType].redirectToThankYou) {
      // We'll redirect to the thank you page
      window.location.href = "/podziekowanie";
      return;
    }
    
    // For other form types, show toast message as before
    
    // Get success message for this form type
    let successMessage = FORM_CONFIG.types[formType].successMessage;
    
    // Replace placeholders in success message with actual values
    Object.keys(formData).forEach(key => {
      successMessage = successMessage.replace(`{${key}}`, formData[key]);
    });
    
    // Display success message
    showMessage(form, successMessage, 'success');
    
    // Reset form
    form.reset();
    
    // Reset file preview if exists
    const fileInfo = form.querySelector('.file-info');
    if (fileInfo) {
      fileInfo.classList.add('hidden');
    }
  }
  
  /**
   * Handle form submission error
   * @param {HTMLFormElement} form - The form element
   * @param {Error} error - The error object
   */
  function handleError(form, error) {
    console.error('Error submitting form:', error);
    showMessage(form, 'Przepraszamy, wystąpił błąd. Spróbuj ponownie później.', 'error');
  }
  
  /**
   * Reset submit button state
   * @param {HTMLButtonElement} button - The submit button
   * @param {string} originalText - The original button text
   */
  function resetButton(button, originalText) {
    button.disabled = false;
    button.innerHTML = originalText;
  }
  
  /**
   * Show toast message to the user
   * @param {HTMLFormElement} form - The form element
   * @param {string} message - The message to display
   * @param {string} type - The type of message (success or error)
   */
  function showMessage(form, message, type = 'success') {
    // Get or create toast container
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type} animate-fade-in`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    // Toast icon based on type
    const icon = document.createElement('div');
    icon.className = 'toast-icon';
    icon.innerHTML = type === 'success' 
      ? '<i class="fas fa-check-circle"></i>' 
      : '<i class="fas fa-exclamation-circle"></i>';
    
    // Toast content
    const content = document.createElement('div');
    content.className = 'toast-content';
    
    const title = document.createElement('div');
    title.className = 'toast-title';
    title.textContent = type === 'success' ? 'Sukces!' : 'Uwaga!';
    
    const messageText = document.createElement('div');
    messageText.className = 'toast-message';
    messageText.textContent = message;
    
    content.appendChild(title);
    content.appendChild(messageText);
    
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'toast-close';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.setAttribute('aria-label', 'Close');
    
    // Assemble toast
    toast.appendChild(icon);
    toast.appendChild(content);
    toast.appendChild(closeBtn);
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Close button functionality
    closeBtn.addEventListener('click', () => {
      removeToast(toast);
    });
    
    // Auto-remove toast after 5 seconds
    const timeoutId = setTimeout(() => {
      removeToast(toast);
    }, 5000);
    
    // Store timeout ID to clear if manually closed
    toast.dataset.timeoutId = timeoutId;
  }
  
  /**
   * Remove toast with animation
   * @param {HTMLElement} toast - The toast element to remove
   */
  function removeToast(toast) {
    // Clear the timeout if it exists
    if (toast.dataset.timeoutId) {
      clearTimeout(parseInt(toast.dataset.timeoutId));
    }
    
    // Add fade out animation
    toast.classList.add('animate-fade-out');
    
    // Remove after animation completes
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
        
        // If no more toasts, remove the container
        const container = document.querySelector('.toast-container');
        if (container && container.children.length === 0) {
          container.remove();
        }
      }
    }, 500);
  }
  
  // Initialize all forms on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function() {
    initForms();
  });
