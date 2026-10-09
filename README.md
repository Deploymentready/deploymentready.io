# Deployment Ready V5 Final — release package

Includes V5 Stage 1/2 features plus optional budget, milestones, phase checklists, coming home guidance, print preview, and updated PNG icons for iPhone and Android.

## IMPORTANT: Move to professional URL without losing user data
1. At the OLD site, download a **full backup** and save it. Browser localStorage does not move between domains.
2. Upload all files in this ZIP to the root of `deploymentready/deploymentready.github.io` on GitHub. Set Pages to `main` / root under Settings → Pages.
3. Open https://deploymentready.github.io/ and test the site. Restore the full backup from the old site using Settings & Tools.
4. Only after testing, share the new URL. The old site can remain as a fallback.
5. On iPhone, remove the old Home Screen shortcut and add the NEW URL from Safari → Share → Add to Home Screen. iOS caches icons; an existing shortcut might not update.

The same ZIP can also update the original repo first, if desired. Upload the files themselves, not the containing folder. Never clear browser data before exporting a backup.

## Privacy and security
No accounts or servers. All data stays in localStorage in the browser. Exported backups and printed summaries are NOT encrypted. Do not enter sensitive military movement, legal, financial account, medical, or dependent details. The budget is an estimate, not official pay guidance. External links require internet. Follow your unit/command guidance.

## Testing checklist
- Navigation Home/Packing/Readiness; branch resource filtering; Family Plan; phase selection and persistence
- Budget save and refresh; milestone add/complete/remove; phase tasks and Coming Home; print preview with budget OFF by default
- Full backup version 3 export/preview/restore; old Stage 1/2 backup preview/restore; iPhone icon and offline
- Verify URLs and service-worker behavior on the new domain.

## V5.1 targeted reliability fixes (2026-10-09)
- Full backup works even if the user has never saved their initial packing checklist (exports in-memory validated starter state).
- Budget goal progress never shows a negative percentage when the projection is below zero.
- Milestone submission rejects impossible calendar dates.
- Service worker and asset cache identifiers updated to force fresh assets after deployment.
- Guided tour unchanged. This is a targeted patch, not a comprehensive audit or browser QA certification.
