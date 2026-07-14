ERROR:
Could not find the table public.room_clients in the schema cache

কারণ:
Supabase database-এ room_clients table তৈরি হয়নি।

সমাধান:
1. Supabase Dashboard খুলুন।
2. SQL Editor → New query।
3. complete-client-room-setup.sql-এর পুরো code paste করুন।
4. Run চাপুন।
5. Success দেখালে website refresh করুন।
6. Admin Panel থেকে Client Add করুন।

গুরুত্বপূর্ণ:
- Supabase Authentication → Users থেকে admin email/password user তৈরি করতে হবে।
- SQL Run হওয়ার পর 10–20 সেকেন্ড অপেক্ষা করে Admin Panel refresh করুন।
- এখনও error থাকলে Supabase Project URL/Anon Key সঠিক কিনা supabase-client.js-এ পরীক্ষা করুন।
