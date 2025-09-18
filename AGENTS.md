# Repository Guidelines

## Project Structure & Module Organization
The site ships as static HTML in the repository root; every top-level `*.html` (for example `index.html`, `ga4-test-tool.html`, `polityka-prywatnosci.html`) loads shared assets from `styles/` and `scripts/`. Place behaviour in `scripts/` (`main.js` owns consent logic, `test-ga4-functionality.js` automates audits) and shared styling in `styles/styles.css` or `styles/icons.css`. Store media in `images/` and `videos/`, downloads in `files/`, and analytics documentation in `LOCAL_TESTING_GUIDE.md`, `README_TESTING.md`, and `GA4_Audit_Report.md`.

## Build, Test, and Development Commands
- `./start-testing.sh` launches the preferred local server, opens suggested URLs, and can trigger the automated suite.
- `node local-testing-server.js` starts the CORS-friendly server on port 8080; run it before GA4 checks.
- `python3 -m http.server 8080` is the fallback server when Node.js is unavailable.
- `node test-ga4-functionality.js` executes the headless GA4 regression tests once a server is running.
- `open index.html` (macOS) or visit `http://localhost:8080` for spot checks after copy or layout tweaks.

## Coding Style & Naming Conventions
Use editor-integrated Prettier, ESLint, and stylelint before committing. Favour 4-space indentation, single-quoted strings, and terminating semicolons as established in `scripts/main.js`. Name new assets consistently: lowercase, hyphenated HTML files (`story-builder.html`), matching JS helpers in `scripts/`, and descriptive CSS class names that align with Dawn CSS utilities.

## Testing Guidelines
Spin up a server (`./start-testing.sh` or `node local-testing-server.js`) ahead of any manual or automated verification. Run `node test-ga4-functionality.js` after touching consent logic, tracking tags, or shared templates, and include the summary in your PR. Follow the scenarios in `LOCAL_TESTING_GUIDE.md` to confirm DebugView events, consent updates, and UTM persistence across key routes (`/`, `/o-nas.html`, `/badania.html`).

## Commit & Pull Request Guidelines
Recent commits (`GA fixes`, `Polityka prywatnosci`) show concise, topic-focused subjects; keep messages ≤60 characters, imperative, and split unrelated changes. Pull requests should note affected pages or scripts, list executed commands, and attach screenshots for UI work. Link related issues and flag any configuration changes (e.g., measurement IDs) that reviewers must double-check post-deploy.

## Analytics & Configuration Tips
Keep the GTM container (`GTM-W5WXGDM9`) in sync across every HTML file when updates land. Retain structured debug logging in `scripts/main.js` so automated tests keep detecting consent states, but remove ad-hoc console statements before merging.
