# Deployment Ready V3.1

Adds an optional deployment-length field and modest quantity suggestions for common personal supplies. Existing packing lists and readiness tasks remain stored under their existing local storage keys.

## Update the existing GitHub Pages site
1. Make a backup from the Packing page using **Export backup**.
2. Upload all files from this folder to the root of the existing `deployment-ready` GitHub repository, replacing matching files.
3. Commit changes and wait for the Pages deployment to succeed.
4. Open `https://YOUR-USERNAME.github.io/deployment-ready/?v=3-1` to verify.

## Notes
- Deployment length is optional. Leave it blank to disable quantity suggestions.
- Suggestions only appear for recognizable item names such as socks, underwear, toothpaste, toothbrush, soap, shampoo, deodorant, hygiene supplies, and towels.
- Suggestions are estimates, not official military requirements. They assume that laundry or resupply may be available and should be adjusted to official instructions.
- The app does not remove or change packing items based on the duration.
- The deployment length is saved locally on the device and does not sync.
- Do not enter sensitive operational details.
