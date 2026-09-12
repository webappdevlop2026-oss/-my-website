/* v34.0.0 build: 2026-09-13-no-pricing */
const CACHE_NAME='digital-agency-chandan-v3400-no-pricing';
const CORE=['/manifest.json'];

function stripHomePricing(html){
  // Remove the full pricing cards section.
  html=html.replace(/<section class="py-8" id="pricing">[\s\S]*?(?=<section class="py-8 bg-black\/20" id="contact">)/i,'');

  // Remove Pricing links from desktop/mobile menus.
  html=html.replace(/<a href="#pricing"><span>💰<\/span><strong>Pricing<\/strong><\/a>/gi,'');
  html=html.replace(/<a href="#pricing"[^>]*>💰\s*Pricing<\/a>/gi,'');

  // Remove fixed-price promotional messages.
  html=html.replace(/<div class="first-order-offer[^>]*>[\s\S]*?<\/div>/i,'');
  html=html.replace(/<div class="mt-10 inline-block[^>]*>Website Starting Price Only ₹999<\/div>/i,'');

  // Replace the price-focused business-growth card with a custom-quote message.
  html=html.replace(/<div class="business-growth-feature green">[\s\S]*?<strong>Starting ₹999<\/strong><small>Affordable packages<\/small>[\s\S]*?<\/div>\s*<\/div>/i,
    '<div class="business-growth-feature green"><div class="business-growth-icon"><i class="fa-solid fa-comments"></i></div><div><strong>Custom Quote</strong><small>Based on your requirements</small></div></div>');

  // Keep the consultation form, but remove numeric budget ranges.
  html=html.replace(/<select id="c_budget"([^>]*)>[\s\S]*?<\/select>/i,
    '<select id="c_budget"$1><option value="">Budget আলোচনা করবেন?</option><option>Discuss on WhatsApp</option><option>Discuss on Call</option></select>');

  // Hide the old offer banner content if present.
  html=html.replace(/<div id="offerBanner"[^>]*>[\s\S]*?<\/div>(?=<div class="top-marquee)/i,'<div id="offerBanner" style="display:none;"></div>');

  // Do not expose a price range in structured data.
  html=html.replace(/,"priceRange":"₹₹"/g,'');
  html=html.replace(/"priceRange":"₹₹",/g,'');

  return html;
}

async function homeResponse(request){
  const networkResponse=await fetch(request,{cache:'no-store'});
  const contentType=networkResponse.headers.get('content-type')||'';
  if(!networkResponse.ok || !contentType.includes('text/html')) return networkResponse;

  const html=stripHomePricing(await networkResponse.text());
  const headers=new Headers(networkResponse.headers);
  headers.delete('content-length');
  headers.set('Cache-Control','no-store, max-age=0');
  const cleaned=new Response(html,{status:networkResponse.status,statusText:networkResponse.statusText,headers});
  const cache=await caches.open(CACHE_NAME);
  await cache.put(request,cleaned.clone());
  return cleaned;
}

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const names=await caches.keys();
    await Promise.all(names.filter(name=>name!==CACHE_NAME).map(name=>caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET') return;

  const url=new URL(request.url);
  const path=url.pathname;
  const alwaysFresh=[
    '/client-room.html',
    '/client-office-final-v21.png',
    '/client-room-gate-v10.png',
    '/client-room-admin.html',
    '/agency-control-2026.html',
    '/room-project.png',
    '/room-meeting.png',
    '/room-support.png',
    '/room-accounts.png'
  ];

  if(alwaysFresh.includes(path)){
    event.respondWith(fetch(request,{cache:'no-store'}).catch(()=>caches.match(request)));
    return;
  }

  if(request.mode==='navigate'){
    if(path==='/' || path==='/index.html'){
      event.respondWith(homeResponse(request).catch(async()=>{
        const cached=await caches.match(request);
        return cached || new Response('Offline',{status:503,headers:{'Content-Type':'text/plain'}});
      }));
      return;
    }

    event.respondWith(
      fetch(request).then(response=>{
        const copy=response.clone();
        caches.open(CACHE_NAME).then(cache=>cache.put(request,copy));
        return response;
      }).catch(()=>caches.match(request).then(response=>response||caches.match('/index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached=>cached||fetch(request).then(response=>{
      if(response&&response.status===200){
        const copy=response.clone();
        caches.open(CACHE_NAME).then(cache=>cache.put(request,copy));
      }
      return response;
    }))
  );
});
