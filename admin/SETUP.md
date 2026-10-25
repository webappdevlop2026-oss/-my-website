# One Agency Admin

Panel: https://www.digitalagencybychandandas.in/admin/index.html

This panel manages the Client Demo Room. It does not yet manage the rest of the agency website, collect feedback, or track visitors. No Firebase changes are required.

## Required Vercel settings

In the existing Vercel website project, Settings → Environment Variables, add these for Production only. Keep all values out of GitHub and chat:

- ROOM_ADMIN_PASSWORD: a unique password of at least 12 characters.
- ROOM_SESSION_SECRET: at least 32 random characters, separate from the password.
- ROOM_GITHUB_TOKEN: a fine-grained GitHub token restricted to webappdevlop2026-oss/-my-website, with Contents read/write. Set an expiry and rotate it when needed. Do not grant access to all repositories.

Redeploy after saving the settings. If any setting is absent, the admin API fails closed and shows setup required. Never use NEXT_PUBLIC_ or VITE_ prefixes for these secrets.

Use the canonical www.digitalagencybychandandas.in URL. Login is a two-hour, HttpOnly, Secure, SameSite=Strict cookie. Writes reject other origins. Login throttling is per function instance, so it is not a global rate limit; use a strong admin password.

## Saving

Project data and encrypted invitations are updated together in one GitHub commit. Vercel then redeploys the existing website. A successful save means the commit was created, not that deployment has finished. Check deployment status in Vercel if the public page has not updated.

The repository is public. Never put client personal details, confidential file links, or secrets into project titles, descriptions, image URLs, or public links. Invite codes are not stored in plaintext. Short numeric PINs offer less resistance to guessing than generated codes.

Existing codes cannot be displayed or decrypted by the admin. To replace one, enter only the new code. The server uses the linked destination from lib/demo-destinations.json and ignores client-supplied URLs. When adding an HTML demo, add its project ID and path to that mapping in the same deployment. Projects without a linked demo cannot set an invite code. Existing invitation records are preserved until changed. The panel supports existing image URLs; file upload is not implemented. Hide is reversible; client records are not deleted. Disabling a room invite does not secure legacy direct demo URLs.

Statuses: Coming Soon, Demo Available, Under Client Review, In Development, Completed & Delivered, Published. A separate review checkbox adds the manual badge. Published requires a Google Play or website URL. Upcoming projects may display the invite dialog but cannot unlock until a demo is configured and status changed.
