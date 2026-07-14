ইনস্টল করার নিয়ম:

1. client-room.html ফাইলটি পুরনো client-room.html-এর জায়গায় Replace করুন।
2. পুরো audio folder-টি website root folder-এ upload করুন।
3. Structure এমন হবে:

website/
├── client-room.html
├── supabase-client.js
└── audio/
    ├── welcome.wav
    ├── sit.wav
    ├── assistant.wav
    ├── next-demo.wav
    ├── demo-open.wav
    └── message.wav

4. Preview Code: DEMO-3D
5. প্রথমে Gate খুলুন। User click-এর পরে Bengali audio চলবে।
6. Browser Bengali voice-এর ওপর আর নির্ভর করবে না।
