# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DawnoTemu is a Polish voice-powered bedtime stories website that allows parents to create AI-cloned voices to read stories to their children. This is a static website built with vanilla HTML, CSS, and JavaScript, featuring a custom CSS framework and multilingual content.

## Development Commands

This is a static website project with no build process or package management. Development is done by:

- Opening HTML files directly in the browser for testing
- Using a local web server for development: `python -m http.server 8000` or similar
- No compilation, bundling, or dependency installation required

## Architecture and Structure

### Core Pages
- `index.html` - Main landing page with hero section, features, and call-to-action
- `o-nas.html` - About us page with team and company information
- `badania.html` - Research page showing scientific backing
- `biblioteka.html` - Story library page
- `kontakt.html` - Contact page with forms
- `doc.html` - Documentation page
- `polityka-prywatnosci.html` - Privacy policy page
- `podziekowanie.html` - Thank you page
- `email_template.html` - Email template for communications

### Styling System
- **Custom CSS Framework**: Uses a custom framework with consistent design tokens
- **Tailwind Integration**: Some pages use Tailwind CSS with custom configuration in `scripts/tailwind-config.js`
- **Main Stylesheets**: 
  - `styles/styles.css` - Primary stylesheet with custom components and utilities
  - `styles/icons.css` - Icon definitions and custom icon fonts
- **Typography**: Uses Google Fonts (Comfortaa, Quicksand, Plus Jakarta Sans)

### JavaScript Organization
- `scripts/main.js` - Core functionality including mobile navigation, animations, and page interactions
- `scripts/forms.js` - Form handling, validation, and submission logic
- `scripts/library.js` - Story library functionality and filtering
- `scripts/iphone-mockup.js` - iPhone mockup animations and interactions
- All JavaScript is vanilla ES6+ with no external dependencies

### Design System
- **Brand Colors**: Peach (#FBAF9F), Lavender (#DA8FFF), Mint (#63E6E2), Soft Yellow (#FAE8B0)
- **Polish Language**: All content is in Polish, targeting Polish-speaking families
- **Mobile-First**: Responsive design with custom breakpoints and mobile navigation
- **Analytics**: Google Analytics 4 with consent management implementation

### Key Features
- **Voice Cloning Technology**: Core feature allowing parents to record their voice
- **Story Library**: Collection of Polish fairy tales and modern stories
- **AI Story Generation**: Personalized story creation based on child interests
- **Offline Mode**: Download functionality for stories
- **Parent Portal**: Usage monitoring and content control

## Content Management

- **Static Content**: All content is hard-coded in HTML files
- **Images**: Stored in `images/` directory (excluded from repository)
- **Videos**: Stored in `videos/` directory (excluded from repository) 
- **Icons**: Custom icons in `icons/` directory
- **Assets**: Additional files in `files/` directory including PDFs

## Code Style Guidelines

- **HTML**: Semantic HTML5 with proper meta tags, OpenGraph, and accessibility attributes
- **CSS**: BEM-like naming conventions, custom properties for theming, mobile-first responsive design
- **JavaScript**: 
  - Vanilla ES6+ with modern features (arrow functions, destructuring, async/await)
  - Functional programming patterns where appropriate
  - Event-driven architecture for user interactions
  - Error handling with try/catch blocks
- **Naming**: camelCase for JavaScript variables/functions, kebab-case for CSS classes and HTML attributes

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge latest versions)
- Mobile browser optimization with touch-friendly interfaces
- Progressive enhancement approach

## SEO and Performance

- **Meta Tags**: Comprehensive SEO meta tags with Polish keywords
- **OpenGraph**: Full social media sharing optimization
- **Performance**: Optimized images, minimal JavaScript, efficient CSS
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation support
- **Google Analytics**: GA4 implementation with GDPR-compliant consent management