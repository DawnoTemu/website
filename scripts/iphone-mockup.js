/**
 * iPhone3DMockup - A lightweight library to create 3D iPhone mockups around content elements
 * @version 1.0.1
 * @author Claude
 * @license MIT
 */
(function(global) {
    'use strict';
  
    /**
     * Creates a 3D iPhone mockup around the specified element
     * @param {Element|String} element - DOM element or selector to be wrapped in an iPhone mockup
     * @param {Object} options - Configuration options
     * @returns {Object} - Methods to control the mockup
     */
    function iPhone3DMockup(element, options = {}) {
      // If string is provided, treat it as a selector
      if (typeof element === 'string') {
        element = document.querySelector(element);
      }
      
      // Check if element exists
      if (!element) {
        console.error('iPhone3DMockup: Target element not found');
        return null;
      }
      
      // Default options
      const defaults = {
        autoRotate: false, // Changed to false by default
        draggable: true, // Enable mouse/touch dragging
        rotationRange: 45, // Maximum angle in degrees (left/right)
        rotationSpeed: 15, // seconds per rotation (only used if autoRotate is true)
        thickness: 20,
        color: '#1d1d1f',
        style: 'notch', // 'notch' or 'dynamicIsland'
        width: 250,
        height: 500,
        replace: false // whether to replace the original element
      };
      
      // Merge options with defaults
      const settings = Object.assign({}, defaults, options);
      
      // Create unique ID for CSS
      const uniqueId = 'iphone-mockup-' + Math.floor(Math.random() * 1000000);
      
      // Store original element data
      const originalParent = element.parentNode;
      const originalNextSibling = element.nextSibling;
      
      // Create required elements
      const mockup = createMockupElements(element, settings, uniqueId);
      
      // Add CSS to document
      addCssToDocument(settings, uniqueId);
      
      // Add mockup to DOM
      if (settings.replace) {
        originalParent.replaceChild(mockup.container, element);
      } else {
        originalParent.insertBefore(mockup.container, element);
        element.style.display = 'none';
      }
      
      // Control API
      const api = {
        // Pause rotation
        pause: function() {
          mockup.iphone.style.animationPlayState = 'paused';
          return api;
        },
        
        // Resume rotation
        play: function() {
          mockup.iphone.style.animationPlayState = 'running';
          return api;
        },
        
        // Set rotation speed (seconds per rotation)
        setSpeed: function(seconds) {
          mockup.iphone.style.animationDuration = seconds + 's';
          return api;
        },
        
        // Toggle phone style (notch or dynamic island)
        setStyle: function(style) {
          if (style === 'notch') {
            mockup.notch.style.display = 'block';
            mockup.dynamicIsland.style.display = 'none';
          } else if (style === 'dynamicIsland') {
            mockup.notch.style.display = 'none';
            mockup.dynamicIsland.style.display = 'block';
          }
          return api;
        },
        
        // Destroy the mockup and restore original element
        destroy: function() {
          if (settings.replace) {
            mockup.container.parentNode.replaceChild(element, mockup.container);
            element.style.display = '';
          } else {
            mockup.container.parentNode.removeChild(mockup.container);
            element.style.display = '';
          }
          
          // Remove the CSS
          const styleElement = document.getElementById(uniqueId + '-style');
          if (styleElement) {
            styleElement.parentNode.removeChild(styleElement);
          }
        }
      };
      
      return api;
    }
    
    /**
     * Create all the DOM elements needed for the iPhone mockup
     */
    function createMockupElements(contentElement, settings, uniqueId) {
      // Create container elements
      const container = document.createElement('div');
      container.className = `${uniqueId}-scene iphone-mockup-scene`;
      
      const iphone = document.createElement('div');
      iphone.className = `${uniqueId}-iphone iphone-mockup-iphone`;
      
      const iphoneBody = document.createElement('div');
      iphoneBody.className = `${uniqueId}-body iphone-mockup-body`;
      
      // Create iPhone back and sides for 3D thickness
      const iphoneBack = document.createElement('div');
      iphoneBack.className = `${uniqueId}-back iphone-mockup-back`;
      
      const sides = ['top', 'bottom', 'left', 'right'];
      const sideElements = {};
      
      sides.forEach(side => {
        // const sideElement = document.createElement('div');
        // sideElement.className = `${uniqueId}-side-${side} iphone-mockup-side iphone-mockup-side-${side}`;
        // sideElements[side] = sideElement;
        // iphoneBody.appendChild(sideElement);
      });
      
      // Create iPhone screen
      const iphoneScreen = document.createElement('div');
      iphoneScreen.className = `${uniqueId}-screen iphone-mockup-screen`;
      
      // Create iPhone features (notch, etc.)
      const notch = document.createElement('div');
      notch.className = `${uniqueId}-notch iphone-mockup-notch`;
      
      const camera = document.createElement('div');
      camera.className = `${uniqueId}-camera iphone-mockup-camera`;
      notch.appendChild(camera);
      
      const dynamicIsland = document.createElement('div');
      dynamicIsland.className = `${uniqueId}-dynamic-island iphone-mockup-dynamic-island`;
      
      // Initially set the style based on settings
      if (settings.style === 'notch') {
        notch.style.display = 'block';
        dynamicIsland.style.display = 'none';
      } else {
        notch.style.display = 'none';
        dynamicIsland.style.display = 'block';
      }
      
      // Create home indicator
      const homeIndicator = document.createElement('div');
      homeIndicator.className = `${uniqueId}-home-indicator iphone-mockup-home-indicator`;
      
      // Clone the content element for insertion into the iPhone screen
      const content = contentElement.cloneNode(true);
      content.style.width = '100%';  // Fixed: Added % unit
      content.style.height = '100%';
      
      // If the content is a video or img, ensure it covers the area properly
      if (content.tagName === 'VIDEO' || content.tagName === 'IMG') {
        content.style.objectFit = '';  // Uncommented to ensure media fits properly
        
        // If it's a video, ensure it autoplays and loops silently
        if (content.tagName === 'VIDEO') {
          content.setAttribute('autoplay', '');
          content.setAttribute('loop', '');
          content.setAttribute('muted', '');
          content.setAttribute('playsinline', '');
        }
      }
      
      // Assemble the iPhone mockup
      iphoneScreen.appendChild(content);
      iphoneBody.appendChild(iphoneBack);
      iphoneBody.appendChild(iphoneScreen);
      iphoneBody.appendChild(notch);
      iphoneBody.appendChild(dynamicIsland);
      iphoneBody.appendChild(homeIndicator);
      
      iphone.appendChild(iphoneBody);
      container.appendChild(iphone);
      
      // Variables for drag functionality
      let isDragging = false;
      let startX = 0;
      let currentRotation = 0;
      
      // Set initial transform without animation
      iphone.style.transform = 'rotateY(0deg) rotateX(5deg)';
      
      // Set rotation animation if enabled
      if (settings.autoRotate) {
        iphone.style.animation = `${uniqueId}-rotate ${settings.rotationSpeed}s infinite linear`;
      } else if (settings.draggable) {
        // Add mouse/touch event listeners for dragging
        container.addEventListener('mousedown', handleDragStart);
        container.addEventListener('touchstart', handleDragStart, { passive: false });
        
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('touchmove', handleDragMove, { passive: false });
        
        document.addEventListener('mouseup', handleDragEnd);
        document.addEventListener('touchend', handleDragEnd);
        
        // Set cursor to indicate draggable
        container.style.cursor = 'grab';
      }
      
      // Handle drag start
      function handleDragStart(e) {
        isDragging = true;
        container.style.cursor = 'grabbing';
        
        // Get starting position
        startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        
        // Remove any existing animation
        iphone.style.animation = 'none';
        iphone.style.transition = 'none';
        
        // Prevent default to avoid text selection during drag
        e.preventDefault();
      }
      
      // Handle drag movement
      function handleDragMove(e) {
        if (!isDragging) return;
        
        // Calculate how far the mouse has moved
        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const deltaX = clientX - startX;
        
        // Convert the movement to rotation angle (sensitivity factor)
        const sensitivity = 0.5;
        const newRotation = deltaX * sensitivity;
        
        // Limit rotation to the specified range
        const clampedRotation = Math.max(-settings.rotationRange, Math.min(settings.rotationRange, newRotation));
        
        // Apply the rotation
        iphone.style.transform = `rotateY(${clampedRotation}deg) rotateX(5deg)`;
        currentRotation = clampedRotation;
        
        // Prevent default to stop scrolling on touch devices
        e.preventDefault();
      }
      
      // Handle drag end
      function handleDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        container.style.cursor = 'grab';
        
        // Add a smooth transition for animation back to center
        iphone.style.transition = 'transform 0.5s ease-out';
        
        // Optional: animate back to center when released
        // iphone.style.transform = 'rotateY(0deg) rotateX(5deg)';
      }
      
      // Return references to all created elements
      return {
        container,
        iphone,
        iphoneBody,
        iphoneScreen,
        notch,
        dynamicIsland,
        homeIndicator,
        content
      };
    }
    
    /**
     * Add required CSS to the document
     */
    function addCssToDocument(settings, uniqueId) {
      const cssRules = `
        /* Container styles */
        .${uniqueId}-scene {
          width: 300px;
          height: 600px;
          perspective: 1500px;
          margin: 0 auto;
        }
        
        /* iPhone container */
        .${uniqueId}-iphone {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
        }
        
        /* iPhone body */
        .${uniqueId}-body {
          width: ${settings.width}px;
          height: ${settings.height}px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: linear-gradient(145deg, ${settings.color}, #3a3a3c);
          border-radius: 40px;
          border: 1px solid #444;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          transform-style: preserve-3d;
        }
        
        /* iPhone back */
        .${uniqueId}-back {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: #2c2c2e;
          border-radius: 40px;
          transform: translateZ(${-settings.thickness}px);
        }
        
        /* iPhone sides for thickness */
        .${uniqueId}-side-top {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: ${settings.thickness}px;
          background-color: #2a2a2c;
          transform-origin: top center;
          transform: rotateX(90deg);
          border-radius: 40px 40px 0 0;
        }
        
        .${uniqueId}-side-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: ${settings.thickness}px;
          background-color: #2a2a2c;
          transform-origin: bottom center;
          transform: rotateX(-90deg);
          border-radius: 0 0 40px 40px;
        }
        
        .${uniqueId}-side-left {
          position: absolute;
          top: 0;
          left: 0;
          width: ${settings.thickness}px;
          height: 100%;
          background-color: #2a2a2c;
          transform-origin: left center;
          transform: rotateY(-90deg);
          border-radius: 40px 0 0 40px;
        }
        
        .${uniqueId}-side-right {
          position: absolute;
          top: 0;
          right: 0;
          width: ${settings.thickness}px;
          height: 100%;
          background-color: #2a2a2c;
          transform-origin: right center;
          transform: rotateY(90deg);
          border-radius: 0 40px 40px 0;
        }
        
        /* iPhone screen */
        .${uniqueId}-screen {
          width: calc(${settings.width}px - 20px);
          height: calc(${settings.height}px - 20px);
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) translateZ(1px);
          background-color: #fff;
          border-radius: 30px;
          overflow: hidden;
          box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Notch */
        .${uniqueId}-notch {
          width: 90px;
          height: 30px;
          position: absolute;
          top: 0px;
          left: 50%;
          transform: translateX(-50%) translateZ(2px);
          background-color: ${settings.color};
          border-radius: 0 0 15px 15px;
          z-index: 2;
        }
        
        /* Camera */
        .${uniqueId}-camera {
          width: 10px;
          height: 10px;
          position: absolute;
          top: 10px;
          right: 25px;
          background-color: #333;
          border-radius: 50%;
          box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.8);
        }
        
        /* Dynamic Island (for newer iPhones) */
        .${uniqueId}-dynamic-island {
          width: 120px;
          height: 35px;
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%) translateZ(2px);
          background-color: ${settings.color};
          border-radius: 20px;
          z-index: 2;
        }
        
        /* Bottom bar for home indicator */
        .${uniqueId}-home-indicator {
          width: 100px;
          height: 5px;
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%) translateZ(2px);
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        
        /* Rotation animation */
        @keyframes ${uniqueId}-rotate {
          0% {
            transform: rotateY(${-settings.rotationRange}deg) rotateX(5deg);
          }
          50% {
            transform: rotateY(${settings.rotationRange}deg) rotateX(5deg);
          }
          100% {
            transform: rotateY(${-settings.rotationRange}deg) rotateX(5deg);
          }
        }
      `;
      
      // Create style element and add to document
      const styleElement = document.createElement('style');
      styleElement.id = uniqueId + '-style';
      styleElement.innerHTML = cssRules;
      document.head.appendChild(styleElement);
    }
    
    // Attach to window or export as a module
    if (typeof module !== 'undefined' && module.exports) {
      module.exports = iPhone3DMockup;
    } else {
      global.iPhone3DMockup = iPhone3DMockup;
    }
  })(typeof window !== 'undefined' ? window : this);