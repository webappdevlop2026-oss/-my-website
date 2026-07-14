FIREBASE CONNECTED CLIENT ROOM SYSTEM

Upload/replace these files:
1. firebase-client.js
2. client-room.html
3. agency-control-2026.html

Firebase Console setup:

A) Firestore Database
- Firestore → Create database
- Start in Production mode
- Region choose nearest available
- Firestore → Rules
- Paste firestore.rules and Publish

B) Authentication
- Authentication → Get started
- Sign-in method → Email/Password → Enable
- Users → Add user
- এই email/password দিয়ে Admin Panel login করবেন

C) Storage (optional for future uploads)
- Storage → Get started
- Rules-এ storage.rules paste করে Publish

Admin URL:
https://digitalagencybychandandas.in/agency-control-2026.html

Client Room URL:
https://digitalagencybychandandas.in/client-room.html

Flow:
- Admin Client তৈরি করবে
- Pass Code generate করবে
- Client-এর আলাদা project add/update করবে
- Client pass code দিয়ে ঢুকে নিজের project দেখবে
- Client correction পাঠাবে
- Admin correction status update করবে
- Firestore থেকে live refresh হবে

Supabase files আর লাগবে না:
- supabase-client.js
- Supabase SQL files
