const CACHE_NAME='bloom-day-v9';
const APP_SHELL=['./','./index.html','./manifest.webmanifest','./icon.svg','./winter-city.svg','./%D0%98%D0%B7%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20ChatGPT%2016%20%D0%BD%D0%BE%D1%8F%D0%B1.%202026%20%D0%B3.%2C%2012_07_08.jpg'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)));self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))));self.clients.claim()});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
    if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy))}
    return response;
  }).catch(()=>caches.match('./index.html'))));
});
self.addEventListener('push',event=>{
  let payload={title:'Bloom Day 🎄',body:'Пора заглянуть в свои планы ♡',url:'./'};
  try{if(event.data)payload={...payload,...event.data.json()}}catch{if(event.data)payload.body=event.data.text()}
  event.waitUntil(self.registration.showNotification(payload.title||'Bloom Day 🎄',{
    body:payload.body||'Твоё напоминание ♡',
    icon:'./icon.svg',
    badge:'./icon.svg',
    data:{url:payload.url||'./'},
    tag:payload.tag||'bloom-day-reminder',
    renotify:false
  }));
});
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const target=event.notification.data?.url||'./';
  event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
    for(const client of list){if('focus' in client)return client.focus()}
    return clients.openWindow(target);
  }));
});
