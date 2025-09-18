# 🧪 Local GA4 Testing Guide - DawnoTemu

This guide explains how to comprehensively test the GA4 tracking fixes locally before deploying to production.

## Quick Start

### 1. Start Local Server

```bash
# Option 1: Node.js server (recommended)
node local-testing-server.js

# Option 2: Python server
python3 -m http.server 8080

# Option 3: PHP server (if available)
php -S localhost:8080
```

Server will be available at: `http://localhost:8080`

### 2. Open Testing Tool

Navigate to: `http://localhost:8080/ga4-test-tool.html`

---

## 🧭 Deep Analysis Testing Scenarios

### Scenario 1: Meta Ads UTM Attribution Test

**Purpose**: Verify Meta ads traffic is properly attributed as Paid Social

**Test Steps**:
1. Open: `http://localhost:8080/?utm_source=facebook&utm_medium=cpc&utm_campaign=test_campaign&utm_content=video_ad&utm_term=parents&fbclid=IwAR123test456`

2. **Check Browser Console** for:
   ```javascript
   DawnoTemu: UTM parameters detected: {
     utm_source: "facebook",
     utm_medium: "cpc", 
     utm_campaign: "test_campaign",
     utm_content: "video_ad",
     utm_term: "parents",
     fbclid: "IwAR123test456"
   }
   ```

3. **Verify SessionStorage**: 
   - Open DevTools → Application → Session Storage
   - Look for `dawnotemu_utm_params` key

4. **Accept Cookies** and verify GA4 event:
   - Check console for `utm_parameters_detected` event
   - Verify dataLayer contains UTM parameters

**Expected Results**:
- ✅ UTM parameters logged in console
- ✅ Parameters stored in sessionStorage  
- ✅ Custom GA4 event fired with UTM data
- ✅ Full attribution data available after consent

---

### Scenario 2: Consent Mode v2 Compliance Test

**Purpose**: Ensure proper Consent Mode v2 implementation

**Test Sequence**:

1. **Load Page** - Check default consent state:
   ```javascript
   // Console should show:
   // 🧪 GA4 Test Tool - Consent Mode v2 initialized
   ```

2. **Test "Accept All"**:
   - Click "Accept All Cookies" in test tool
   - Verify console shows consent update with ALL v2 fields:
     ```javascript
     gtag('consent', 'update', {
       ad_storage: 'granted',
       analytics_storage: 'granted', 
       ad_user_data: 'granted',        // v2 field
       ad_personalization: 'granted',  // v2 field
       personalization_storage: 'granted',
       functionality_storage: 'granted'
     });
     ```

3. **Test "Analytics Only"**:
   - Verify selective consent works
   - ad_storage should remain 'denied'
   - analytics_storage should be 'granted'

4. **Test Custom GA4 Events**:
   - Look for `consent_accepted` events in dataLayer
   - Verify event parameters are correct

**Expected Results**:
- ✅ Default consent denies all except security_storage
- ✅ All v2 fields included in consent updates  
- ✅ url_passthrough: true preserves UTM parameters
- ✅ Custom consent events fire correctly

---

### Scenario 3: Cross-Page Navigation Test

**Purpose**: Verify consent and UTMs persist across page navigation

**Test Steps**:
1. Start with UTMs: `http://localhost:8080/?utm_source=facebook&utm_medium=cpc&utm_campaign=test`
2. Accept cookies on homepage
3. Navigate to: `/o-nas.html`
4. Navigate to: `/badania.html`
5. Check if UTM parameters remain in sessionStorage
6. Verify consent state persists

**Expected Results**:
- ✅ UTM parameters persist in sessionStorage across pages
- ✅ Consent state maintained across navigation
- ✅ Each page has proper Consent Mode v2 initialization
- ✅ GTM container loads consistently

---

### Scenario 4: GA4 DebugView Integration Test

**Purpose**: Verify events appear in GA4 DebugView for real-time monitoring

**Setup**:
1. Open GA4 property in another tab
2. Navigate to: Configure → DebugView
3. Test with: `http://localhost:8080/ga4-test-tool.html?debug_mode=true`

**Test Events to Verify**:

| Event Name | Trigger | Expected Parameters |
|------------|---------|-------------------|
| `page_view` | Page load | page_location, page_title |
| `session_start` | First page load | session_id, engagement_time |
| `utm_parameters_detected` | UTM parameters found | utm_source, utm_medium, utm_campaign, fbclid |
| `consent_accepted` | User accepts cookies | consent_type, analytics, marketing |
| `test_event` | Manual test trigger | test_parameter, timestamp |

**Expected Results**:
- ✅ All events appear in DebugView within 30 seconds
- ✅ Events contain correct parameters
- ✅ Attribution data properly formatted
- ✅ No duplicate or missing events

---

## 🔍 Advanced Debugging Techniques

### DataLayer Deep Inspection

Add to browser console:
```javascript
// Monitor all dataLayer pushes in real-time
(function() {
  const originalPush = window.dataLayer.push;
  window.dataLayer.push = function(...args) {
    console.log('🔍 DataLayer Push:', ...args);
    return originalPush.apply(this, args);
  };
})();
```

### GTM Container Verification

Check GTM container status:
```javascript
// Verify GTM loaded
console.log('GTM Loaded:', typeof google_tag_manager !== 'undefined');

// Check container
console.log('Container Status:', google_tag_manager['GTM-W5WXGDM9']);

// Monitor consent state
gtag('get', 'G-MEASUREMENT_ID', 'consent', (consent) => {
  console.log('Current Consent State:', consent);
});
```

### Network Request Analysis

**Chrome DevTools**:
1. Open Network tab
2. Filter by `google-analytics.com` and `googletagmanager.com`
3. Look for:
   - GTM container load: `gtm.js?id=GTM-W5WXGDM9`
   - GA4 measurement: `g/collect` requests
   - Consent pings: requests with `gcs` parameter

**Expected Network Behavior**:
- ✅ Initial cookieless ping (before consent)
- ✅ Full measurement requests (after consent)
- ✅ UTM parameters in collect requests
- ✅ Proper consent parameters (`gcs`, `gcu`)

---

## 📋 Testing Checklist

### Pre-Deployment Verification

- [ ] **Server Setup**
  - [ ] Local server running on port 8080
  - [ ] All pages load without errors
  - [ ] Static assets (CSS, JS, images) serve correctly

- [ ] **Consent Mode v2**  
  - [ ] Default consent denies all except security
  - [ ] All v2 fields included in updates
  - [ ] url_passthrough enabled
  - [ ] Consistent across all HTML pages

- [ ] **UTM Parameter Handling**
  - [ ] UTM parameters detected and logged
  - [ ] Parameters stored in sessionStorage
  - [ ] Custom GA4 events fire with UTM data
  - [ ] Parameters persist across page navigation

- [ ] **GA4 Event Tracking**
  - [ ] page_view events fire on all pages
  - [ ] session_start events fire correctly
  - [ ] Custom consent events fire
  - [ ] UTM detection events fire
  - [ ] All events visible in DebugView

- [ ] **Cross-Page Testing**
  - [ ] Navigation preserves consent state
  - [ ] UTM parameters persist in sessionStorage
  - [ ] GTM loads consistently on all pages
  - [ ] No JavaScript errors in console

---

## 🚨 Common Issues & Troubleshooting

### Issue: UTM Parameters Not Detected
**Symptoms**: No console log for UTM parameters
**Solutions**:
- Check URL format: parameters should be properly formatted
- Verify JavaScript not blocked by ad blocker
- Check browser console for JavaScript errors

### Issue: Consent Updates Not Working
**Symptoms**: gtag('consent', 'update') not firing
**Solutions**:
- Verify GTM container loaded: check Network tab
- Check for JavaScript errors preventing execution
- Verify gtag function is available: `typeof gtag`

### Issue: GA4 Events Not Appearing in DebugView
**Symptoms**: No events in GA4 DebugView
**Solutions**:
- Add `?debug_mode=true` to URL
- Check GA4 Measurement ID matches
- Verify internet connection (events need to reach Google)
- Wait up to 60 seconds for events to appear

### Issue: CORS Errors in Browser
**Symptoms**: Cross-origin errors in console
**Solutions**:
- Use provided Node.js server (includes proper CORS headers)
- Don't open HTML files directly in browser
- Use `http://localhost:8080` not `file://` protocol

---

## 📊 Performance Impact Assessment

### Before/After Comparison

**Metrics to Monitor**:
- Page load time impact
- JavaScript execution time
- Network requests count
- Cookie/localStorage usage

**Benchmark Commands**:
```bash
# Test page load performance
curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:8080"

# Monitor network requests
# Use Chrome DevTools Performance tab for detailed analysis
```

### Mobile Testing

**Responsive Testing**:
- Test on mobile viewport (375x667)
- Verify touch interactions work
- Check mobile-specific consent UI
- Test with mobile user agents

---

## 🔄 Continuous Testing

### Automated Testing Script

Create `test-runner.js`:
```javascript
// Automated testing script
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Test UTM parameter detection
  await page.goto('http://localhost:8080/?utm_source=facebook&utm_medium=cpc');
  const utmLogs = await page.evaluate(() => {
    return window.sessionStorage.getItem('dawnotemu_utm_params');
  });
  
  console.log('UTM Test:', utmLogs ? '✅ PASS' : '❌ FAIL');
  
  await browser.close();
})();
```

This comprehensive testing setup ensures your GA4 fixes work correctly before deployment!