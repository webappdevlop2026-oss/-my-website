/* v33.0.0 build: 2026-08-03-final-five-cabin-office */
const CACHE_NAME='digital-agency-chandan-v3300-final-office';
const CORE=['/','/index.html','/manifest.json'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys().then(names=>Promise.all(names.filter(name=>name!==CACHE_NAME).map(name=>caches.delete(name))))
  );
  self.clients.claim();
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET') return;
  const path=new URL(request.url).pathname;
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
