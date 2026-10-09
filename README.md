# Deployment Ready — Version 1

A free, independent mobile-friendly packing checklist for all six U.S. military branches.

## Run locally
Extract this ZIP and open `index.html` in a browser to try the interface. To test installation and offline support, serve the files over HTTPS or localhost.

## Publish for free with GitHub Pages
1. Create a free GitHub account and a new **public** repository.
2. Upload all six app files (`index.html`, `style.css`, `app.js`, `manifest.webmanifest`, `sw.js`, `icon.svg`) to the repository root.
3. In repository **Settings → Pages**, choose **Deploy from a branch**, then **main** and **/(root)**. Save.
4. Once published, open the provided HTTPS URL on an iPhone in Safari, tap Share → Add to Home Screen. On Android, use Chrome's Install app / Add to Home Screen option.
5. Test the site online once before testing offline mode.

## Notes
- The branch selector labels the user's branch; starter items are currently generic, not branch-specific.
- The app saves locally to the browser's localStorage. It does not sync between devices.
- Backup export/import is available.
- Deleting site data or changing browsers can erase locally saved items.
- This is not an official DoD application. Verify equipment requirements with official instructions and do not enter sensitive operational details.
- Free GitHub Pages hosting is subject to GitHub's terms and usage limits.
