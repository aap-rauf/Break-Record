const CACHE="break-tracker-v1.1.0";


self.addEventListener("install",e=>{

e.waitUntil(

caches.open(CACHE)

.then(c=>c.addAll([
"./",
"./index.html",
"./style.css",
"./script.js",
"./manifest.json"
]))

);


});


self.addEventListener("fetch",e=>{


e.respondWith(

caches.match(e.request)
.then(r=>r||fetch(e.request))

);


});
