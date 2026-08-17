SEO ও Analytics Fix — 22 July 2026
====================================

এই ZIP-এ যেগুলো ঠিক করা হয়েছে:

1. ভুল _headers SVG ফাইলটি ঠিক header configuration দিয়ে বদলানো হয়েছে। পুরনো SVG-টি news-portal-template.svg নামে রাখা হয়েছে।
2. ai-builder.html-এ আসল AI Tools page বসানো হয়েছে।
3. পুরনো blog.html এখন blog-articles.html-এ permanent redirect হবে।
4. store.html-এ Google Analytics, GTM, canonical, Open Graph এবং structured data যোগ হয়েছে।
5. billing-software-dubrajpur.html এখন আসল public Billing Software service page।
6. পুরনো Admin Panel নতুন agency-admin-2026.html ফাইলে রাখা হয়েছে।
7. Admin, Client Room ও Demo pages-এ noindex দেওয়া হয়েছে, যাতে Google Search-এ না আসে।
8. sitemap.xml পরিষ্কার করে Store, AI Builder এবং Billing Software page যোগ করা হয়েছে।
9. vercel.json-এ redirect, security headers ও admin noindex headers যোগ করা হয়েছে।
10. robots.txt ঠিক করা হয়েছে, যাতে Google noindex rules পড়তে পারে।

Deploy করার নিয়ম:
- GitHub repository-তে এই folder-এর সব file replace/upload করুন।
- Vercel deployment complete হওয়ার পরে website খুলে test করুন।
- Search Console > Sitemaps-এ sitemap.xml আবার Submit করুন।
- URL Inspection দিয়ে নিচের URL-গুলো Request Indexing করুন:
  https://www.digitalagencybychandandas.in/store.html
  https://www.digitalagencybychandandas.in/ai-builder.html
  https://www.digitalagencybychandandas.in/billing-software-dubrajpur.html

নতুন Admin URL:
https://www.digitalagencybychandandas.in/agency-admin-2026.html

গুরুত্বপূর্ণ:
- GA4 direct tag এবং GTM দুটোই আগের মতো রাখা হয়েছে, যাতে tracking বন্ধ না হয়। GTM container-এর ভিতরে একই G-9929BK5LN5 GA4 tag থাকলে duplicate page-view হতে পারে; Tag Manager-এ একবার check করুন।
- AI Builder-এর /api/generate backend এই ZIP-এ ছিল না। Real AI result চালাতে Vercel serverless API এবং GEMINI_API_KEY আলাদা করে configure করতে হবে।
