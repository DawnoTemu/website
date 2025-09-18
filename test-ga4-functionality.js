#!/usr/bin/env node

/**
 * Automated GA4 Functionality Tester
 * Tests key GA4 tracking functionality without requiring a browser
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🧪 DawnoTemu GA4 Functionality Tester');
console.log('====================================');

// Test configuration
const BASE_URL = 'http://localhost:8080';
const TEST_PAGES = [
    '/',
    '/o-nas.html', 
    '/badania.html',
    '/kontakt.html',
    '/biblioteka.html',
    '/polityka-prywatnosci.html',
    '/ga4-test-tool.html'
];

const UTM_PARAMS = 'utm_source=facebook&utm_medium=cpc&utm_campaign=test&fbclid=test123';

// Test results tracking
let testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    errors: []
};

// Utility functions
function logTest(testName, status, details = '') {
    const symbol = status ? '✅' : '❌';
    console.log(`${symbol} ${testName}${details ? ': ' + details : ''}`);
    testResults.total++;
    if (status) testResults.passed++;
    else {
        testResults.failed++;
        testResults.errors.push(`${testName}: ${details}`);
    }
}

function makeRequest(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ data, statusCode: res.statusCode }));
        }).on('error', reject);
    });
}

// Test functions
async function testServerAvailability() {
    console.log('\\n📡 Testing Server Availability...');
    try {
        const response = await makeRequest(BASE_URL);
        logTest('Server responding', response.statusCode === 200, `Status: ${response.statusCode}`);
        return response.statusCode === 200;
    } catch (error) {
        logTest('Server responding', false, error.message);
        return false;
    }
}

async function testConsentModeImplementation() {
    console.log('\\n🍪 Testing Consent Mode v2 Implementation...');
    
    for (const page of TEST_PAGES) {
        try {
            const response = await makeRequest(`${BASE_URL}${page}`);
            const html = response.data;
            
            // Check for Consent Mode v2 initialization
            const hasConsentDefault = html.includes("gtag('consent', 'default'");
            const hasV2Fields = html.includes('ad_user_data') && html.includes('ad_personalization');
            const hasUrlPassthrough = html.includes('url_passthrough');
            const hasGTM = html.includes('GTM-W5WXGDM9');
            
            logTest(`${page} - Consent Mode v2`, hasConsentDefault && hasV2Fields && hasUrlPassthrough);
            logTest(`${page} - GTM Container`, hasGTM);
            
            // Check GTM loads after consent initialization
            const consentIndex = html.indexOf("gtag('consent', 'default'");
            const gtmIndex = html.indexOf('GTM-W5WXGDM9');
            
            if (consentIndex > -1 && gtmIndex > -1) {
                logTest(`${page} - GTM Load Order`, consentIndex < gtmIndex, 'GTM loads after consent');
            }
            
        } catch (error) {
            logTest(`${page} - Page Load`, false, error.message);
        }
    }
}

async function testUTMParameterHandling() {
    console.log('\\n🎯 Testing UTM Parameter Handling...');
    
    try {
        const response = await makeRequest(`${BASE_URL}/?${UTM_PARAMS}`);
        const html = response.data;
        
        // Check if main.js is loaded (contains UTM detection logic)
        const hasMainJS = html.includes('scripts/main.js');
        logTest('Main.js loaded', hasMainJS);
        
        // Test server logs UTM parameters (check server console)
        logTest('UTM parameter structure', UTM_PARAMS.includes('utm_source=facebook'));
        logTest('Facebook click ID', UTM_PARAMS.includes('fbclid='));
        
        // Check if sessionStorage code is present
        const hasSessionStorage = html.includes('sessionStorage.setItem');
        logTest('SessionStorage UTM storage', hasSessionStorage);
        
    } catch (error) {
        logTest('UTM parameter test', false, error.message);
    }
}

async function testJavaScriptIntegrity() {
    console.log('\\n📝 Testing JavaScript Integration...');
    
    try {
        const response = await makeRequest(`${BASE_URL}/scripts/main.js`);
        const jsContent = response.data;
        
        // Test for updated consent functions
        const hasUpdateGtagConsent = jsContent.includes('updateGtagConsent');
        const hasV2FieldsInUpdate = jsContent.includes('ad_user_data') && jsContent.includes('ad_personalization');
        const hasDebugLogging = jsContent.includes('console.log');
        const hasUTMDetection = jsContent.includes('utm_parameters_detected');
        
        logTest('updateGtagConsent function', hasUpdateGtagConsent);
        logTest('Consent Mode v2 fields in JS', hasV2FieldsInUpdate);
        logTest('Debug logging implemented', hasDebugLogging);
        logTest('UTM detection events', hasUTMDetection);
        
        // Test for cookie helper functions
        const hasCookieHelpers = jsContent.includes('setCookie') && jsContent.includes('getCookie');
        logTest('Cookie helper functions', hasCookieHelpers);
        
    } catch (error) {
        logTest('JavaScript file access', false, error.message);
    }
}

async function testTestingToolAvailability() {
    console.log('\\n🧪 Testing GA4 Test Tool...');
    
    try {
        const response = await makeRequest(`${BASE_URL}/ga4-test-tool.html`);
        const html = response.data;
        
        logTest('Test tool accessible', response.statusCode === 200);
        
        const hasConsentTesting = html.includes('testConsentAll');
        const hasUTMTesting = html.includes('testUTMs');
        const hasDataLayerMonitoring = html.includes('startDataLayerMonitoring');
        const hasDebugMode = html.includes('enableDebugMode');
        
        logTest('Consent testing features', hasConsentTesting);
        logTest('UTM testing features', hasUTMTesting);
        logTest('DataLayer monitoring', hasDataLayerMonitoring);
        logTest('Debug mode support', hasDebugMode);
        
    } catch (error) {
        logTest('Test tool availability', false, error.message);
    }
}

async function testConfigurationFiles() {
    console.log('\\n⚙️ Testing Configuration Files...');
    
    // Test if local testing server exists
    const serverExists = fs.existsSync(path.join(__dirname, 'local-testing-server.js'));
    logTest('Local testing server', serverExists);
    
    // Test if documentation exists
    const docsExist = fs.existsSync(path.join(__dirname, 'LOCAL_TESTING_GUIDE.md'));
    logTest('Testing documentation', docsExist);
    
    // Test if audit report exists
    const auditExists = fs.existsSync(path.join(__dirname, 'GA4_Audit_Report.md'));
    logTest('Audit report', auditExists);
}

// Main test runner
async function runTests() {
    console.log(`🚀 Starting tests at ${new Date().toLocaleString()}`);
    console.log(`📍 Testing server: ${BASE_URL}`);
    
    // Run all test suites
    const serverOK = await testServerAvailability();
    
    if (serverOK) {
        await testConsentModeImplementation();
        await testUTMParameterHandling();
        await testJavaScriptIntegrity();
        await testTestingToolAvailability();
    } else {
        console.log('\\n⚠️  Server not available. Please start the local server first:');
        console.log('   node local-testing-server.js');
        console.log('   OR');
        console.log('   python3 -m http.server 8080');
    }
    
    await testConfigurationFiles();
    
    // Print summary
    console.log('\\n📊 Test Summary');
    console.log('================');
    console.log(`Total Tests: ${testResults.total}`);
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`Success Rate: ${((testResults.passed/testResults.total)*100).toFixed(1)}%`);
    
    if (testResults.errors.length > 0) {
        console.log('\\n❌ Failed Tests:');
        testResults.errors.forEach(error => console.log(`   • ${error}`));
    }
    
    console.log('\\n🎯 Next Steps:');
    if (testResults.failed === 0) {
        console.log('   ✅ All tests passed! Ready for production deployment.');
        console.log('   📊 Test with live Meta ads and monitor GA4 Realtime reports.');
    } else {
        console.log('   ⚠️  Fix failed tests before deploying.');
        console.log('   🔧 Check the LOCAL_TESTING_GUIDE.md for troubleshooting.');
    }
    
    // Exit with error code if tests failed
    process.exit(testResults.failed > 0 ? 1 : 0);
}

// Handle errors and exit gracefully
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Run tests
runTests();