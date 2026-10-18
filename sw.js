const C="store-share-v1";
const CORE=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./icon-180.png"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).catch(()=>{}))});
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
// 앱 화면은 항상 최신본 먼저(인터넷 없으면 저장본으로 실행)
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET"||!r.url.startsWith(self.location.origin))return;
  if(r.mode==="navigate"){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put("./index.html",cp));return res}).catch(()=>caches.match("./index.html").then(x=>x||caches.match("./"))));return}
  e.respondWith(caches.match(r).then(x=>x||fetch(r)));
});
