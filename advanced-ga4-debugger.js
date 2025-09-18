/**
 * Advanced GA4 Debugger for DawnoTemu
 * 
 * Paste this script into browser console for advanced debugging capabilities
 * Works on any page with GTM container GTM-W5WXGDM9
 */

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        GTM_CONTAINER: 'GTM-W5WXGDM9',
        DEBUG_PREFIX: '🔍 DawnoTemu Debug',
        STORAGE_KEY: 'dawnotemu_debug_session'
    };
    
    // Debug session storage
    let debugSession = {
        startTime: Date.now(),
        events: [],
        consent: {},
        utm: {},
        errors: []
    };
    
    console.log(`${CONFIG.DEBUG_PREFIX}: Advanced Debugger Loaded`);
    
    // === UTILITY FUNCTIONS ===
    
    function logDebug(category, message, data = null) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = { timestamp, category, message, data };
        debugSession.events.push(logEntry);
        
        console.group(`${CONFIG.DEBUG_PREFIX} [${category}] ${timestamp}`);
        console.log(message);
        if (data) console.log(data);
        console.groupEnd();
    }
    
    function saveDebugSession() {
        try {
            sessionStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(debugSession));
        } catch (e) {
            logDebug('ERROR', 'Could not save debug session', e);
        }
    }
    
    // === GTM & DATALAYER MONITORING ===
    
    function monitorDataLayer() {
        if (!window.dataLayer) {
            logDebug('ERROR', 'dataLayer not found');
            return;
        }
        
        const originalPush = window.dataLayer.push;
        window.dataLayer.push = function(...args) {
            logDebug('DATALAYER', 'New dataLayer push', args);
            
            // Analyze specific events
            args.forEach(event => {
                if (typeof event === 'object') {
                    // Track consent updates
                    if (event[0] === 'consent') {
                        debugSession.consent[Date.now()] = event;
                        logDebug('CONSENT', `Consent ${event[1]}`, event[2]);
                    }
                    
                    // Track GA4 events
                    if (event[0] === 'event') {
                        logDebug('GA4_EVENT', `Event: ${event[1]}`, event[2]);
                    }
                }
            });
            
            return originalPush.apply(this, args);
        };
        
        logDebug('MONITOR', 'DataLayer monitoring active');
    }
    
    function checkGTMStatus() {
        const gtmLoaded = typeof google_tag_manager !== 'undefined';
        const containerLoaded = gtmLoaded && google_tag_manager[CONFIG.GTM_CONTAINER];
        
        logDebug('GTM_STATUS', 'GTM Container Check', {
            gtmLoaded,
            containerLoaded,
            containerId: CONFIG.GTM_CONTAINER,
            dataLayerLength: window.dataLayer?.length || 0
        });
        
        return { gtmLoaded, containerLoaded };
    }
    
    // === CONSENT MODE ANALYSIS ===
    
    function analyzeConsentMode() {
        logDebug('CONSENT', 'Analyzing Consent Mode implementation...');
        
        // Check for consent defaults in HTML
        const htmlContent = document.documentElement.innerHTML;
        const hasConsentDefault = htmlContent.includes("gtag('consent', 'default'");
        const hasV2Fields = htmlContent.includes('ad_user_data') && htmlContent.includes('ad_personalization');
        const hasUrlPassthrough = htmlContent.includes('url_passthrough');
        
        // Check current consent state
        let currentConsent = null;
        if (typeof gtag === 'function') {
            try {
                gtag('get', 'G-MEASUREMENT_ID', 'consent', (consent) => {
                    currentConsent = consent;
                });
            } catch (e) {
                logDebug('ERROR', 'Could not get current consent state', e);
            }
        }
        
        const analysis = {
            hasConsentDefault,
            hasV2Fields,
            hasUrlPassthrough,
            currentConsent,
            gtagAvailable: typeof gtag === 'function'
        };
        
        logDebug('CONSENT', 'Consent Mode Analysis', analysis);
        return analysis;
    }
    
    function testConsentUpdates() {
        if (typeof gtag !== 'function') {
            logDebug('ERROR', 'gtag function not available');
            return;
        }
        
        logDebug('CONSENT', 'Testing consent updates...');
        
        // Test different consent scenarios
        const testScenarios = [
            {
                name: 'Analytics Only',
                consent: {
                    analytics_storage: 'granted',
                    ad_storage: 'denied',
                    ad_user_data: 'denied',
                    ad_personalization: 'denied'
                }
            },
            {
                name: 'Marketing Only',
                consent: {
                    analytics_storage: 'denied',
                    ad_storage: 'granted',
                    ad_user_data: 'granted',
                    ad_personalization: 'granted'
                }
            },
            {
                name: 'All Granted',
                consent: {
                    analytics_storage: 'granted',
                    ad_storage: 'granted',
                    ad_user_data: 'granted',
                    ad_personalization: 'granted'
                }
            }
        ];
        
        testScenarios.forEach((scenario, index) => {
            setTimeout(() => {
                logDebug('CONSENT_TEST', `Testing: ${scenario.name}`, scenario.consent);
                gtag('consent', 'update', scenario.consent);
            }, index * 2000);
        });
    }
    
    // === UTM PARAMETER ANALYSIS ===
    
    function analyzeUTMParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const utmParams = {};
        const adParams = {};
        
        // Extract UTM parameters
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(param => {
            if (urlParams.get(param)) {
                utmParams[param] = urlParams.get(param);
            }
        });
        
        // Extract ad platform parameters
        ['fbclid', 'gclid', 'msclkid', 'ttclid'].forEach(param => {
            if (urlParams.get(param)) {
                adParams[param] = urlParams.get(param);
            }
        });
        
        // Check sessionStorage
        const storedUTMs = sessionStorage.getItem('dawnotemu_utm_params');
        let parsedStoredUTMs = null;
        try {
            parsedStoredUTMs = storedUTMs ? JSON.parse(storedUTMs) : null;
        } catch (e) {
            logDebug('ERROR', 'Could not parse stored UTM parameters', e);
        }
        
        const analysis = {
            currentUTMs: utmParams,
            adParameters: adParams,
            storedUTMs: parsedStoredUTMs,
            hasUTMs: Object.keys(utmParams).length > 0,
            hasAdParams: Object.keys(adParams).length > 0
        };
        
        debugSession.utm = analysis;
        logDebug('UTM', 'UTM Parameter Analysis', analysis);
        
        return analysis;
    }
    
    // === NETWORK MONITORING ===
    
    function monitorNetworkRequests() {
        // Monitor fetch requests
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const url = args[0];
            if (typeof url === 'string' && (url.includes('google-analytics.com') || url.includes('googletagmanager.com'))) {
                logDebug('NETWORK', 'GA4 Network Request', { url, method: args[1]?.method || 'GET' });
            }
            return originalFetch.apply(this, args);
        };
        
        // Monitor XMLHttpRequest
        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, ...rest) {
            if (typeof url === 'string' && (url.includes('google-analytics.com') || url.includes('googletagmanager.com'))) {
                logDebug('NETWORK', 'GA4 XHR Request', { method, url });
            }
            return originalXHROpen.apply(this, [method, url, ...rest]);
        };
        
        logDebug('MONITOR', 'Network monitoring active');
    }
    
    // === PAGE PERFORMANCE ANALYSIS ===
    
    function analyzePagePerformance() {
        const performance = window.performance;
        if (!performance) {
            logDebug('ERROR', 'Performance API not available');
            return;
        }
        
        const navigation = performance.getEntriesByType('navigation')[0];
        const paintEntries = performance.getEntriesByType('paint');
        
        const metrics = {
            domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.navigationStart,
            pageLoad: navigation?.loadEventEnd - navigation?.navigationStart,
            firstPaint: paintEntries.find(entry => entry.name === 'first-paint')?.startTime,
            firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime
        };
        
        logDebug('PERFORMANCE', 'Page Performance Metrics', metrics);
        return metrics;
    }
    
    // === TESTING FUNCTIONS ===
    
    function runComprehensiveTest() {
        logDebug('TEST', 'Starting comprehensive GA4 test...');
        
        const testResults = {
            gtm: checkGTMStatus(),
            consent: analyzeConsentMode(),
            utm: analyzeUTMParameters(),
            performance: analyzePagePerformance()
        };
        
        // Send test events
        if (typeof gtag === 'function') {
            gtag('event', 'debug_test_comprehensive', {
                test_timestamp: Date.now(),
                test_page: window.location.pathname,
                test_session: debugSession.startTime
            });
        }
        
        logDebug('TEST', 'Comprehensive test results', testResults);
        return testResults;
    }
    
    function simulateMetaAdsTraffic() {
        logDebug('TEST', 'Simulating Meta ads traffic...');
        
        // Simulate UTM parameters
        const metaUTMs = 'utm_source=facebook&utm_medium=cpc&utm_campaign=test_campaign&utm_content=test_ad&fbclid=IwAR_test_' + Date.now();
        const newUrl = `${window.location.origin}${window.location.pathname}?${metaUTMs}`;
        
        logDebug('TEST', 'Redirecting to simulate Meta ads click', { newUrl, utms: metaUTMs });
        
        setTimeout(() => {
            window.location.href = newUrl;
        }, 1000);
    }
    
    // === PUBLIC API ===
    
    window.DawnoTemuDebugger = {
        // Core functions
        runTest: runComprehensiveTest,
        analyzeConsent: analyzeConsentMode,
        analyzeUTM: analyzeUTMParameters,
        testConsent: testConsentUpdates,
        simulateMetaAds: simulateMetaAdsTraffic,
        
        // Monitoring
        startMonitoring: () => {
            monitorDataLayer();
            monitorNetworkRequests();
        },
        
        // Utilities
        getSession: () => debugSession,
        clearSession: () => {
            debugSession = { startTime: Date.now(), events: [], consent: {}, utm: {}, errors: [] };
            sessionStorage.removeItem(CONFIG.STORAGE_KEY);
        },
        exportSession: () => {
            const blob = new Blob([JSON.stringify(debugSession, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dawnotemu-debug-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        },
        
        // Quick tests
        quickTest: () => {
            console.group('🚀 DawnoTemu Quick Test');
            console.log('1. GTM Status:', checkGTMStatus());
            console.log('2. Consent Mode:', analyzeConsentMode());
            console.log('3. UTM Parameters:', analyzeUTMParameters());
            console.groupEnd();
        }
    };
    
    // Auto-start monitoring
    setTimeout(() => {
        monitorDataLayer();
        monitorNetworkRequests();
        
        // Run initial analysis
        runComprehensiveTest();
    }, 1000);
    
    // Save session on page unload
    window.addEventListener('beforeunload', saveDebugSession);
    
    console.log(`${CONFIG.DEBUG_PREFIX}: Ready! Use DawnoTemuDebugger.quickTest() to start`);
    console.log('Available commands:');
    console.log('- DawnoTemuDebugger.runTest()');
    console.log('- DawnoTemuDebugger.simulateMetaAds()');
    console.log('- DawnoTemuDebugger.testConsent()');
    console.log('- DawnoTemuDebugger.quickTest()');
    
})();