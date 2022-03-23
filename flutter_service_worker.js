'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "a112512d597c9d147a9be88623c343b8",
"index.html": "4501fb2d6e91cea99dd2d99a2a9f2f5b",
"/": "4501fb2d6e91cea99dd2d99a2a9f2f5b",
"main.dart.js": "3f6f3aa353aceee8134090a23ac0d207",
"cors.json": "434eb804728f2a72969effd13fc48333",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "a2a9455e8755130d4a5b9af6630c89e4",
"assets/AssetManifest.json": "be7dbed1ba93c1b36e0f408124edab0d",
"assets/NOTICES": "2f1ae66e362fd4de9d26fdd6ec77049c",
"assets/FontManifest.json": "353110e694001d010cfaf6e88efafabe",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/fonts/Fontspring-bold.otf": "ba6c16ea7a3386b40ed54cefeb6c1786",
"assets/fonts/Fontspring.otf": "3a8e44723d788f798d82cd2bf06d9c8f",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/assets/jira.png": "0969afd616d4a33593d944b73208419b",
"assets/assets/git.png": "d4c62a53fd355336bad5ea3d48881410",
"assets/assets/markhealth.png": "76aebbc469215fd6a4145320ffb2166d",
"assets/assets/clinrexInfoImage.png": "0dfd0d37eb5cc92f75637b21cc3b6aaa",
"assets/assets/instagram.png": "61bbd1000f22a5b68ce962384e7d6737",
"assets/assets/flutter.png": "3b4da9cb09fc06090101151f229920e3",
"assets/assets/swift_color.png": "aa4b64cbdca848cda5ab1416903b6fc6",
"assets/assets/m2p.jpeg": "f027592326a7cd6258b8b5bca237c193",
"assets/assets/flutter_color.png": "d165760a12f332e7485ef1bcced4161c",
"assets/assets/tartlabs.png": "e2288799698100bab2744457a8d43699",
"assets/assets/oncopwerImage.png": "650cdbdf053bbc89a28167f1c8fee9d4",
"assets/assets/appstore.png": "95bfe23906ee0735b6a19932afae429e",
"assets/assets/jira_color.png": "908b95beb4f7347187bf4b0240c942d9",
"assets/assets/mLogo.png": "8a55095d570ca95f86580446b36ce39c",
"assets/assets/profile_pic.jpg": "bd909ed372746af75422edaf566b9b37",
"assets/assets/twitter.png": "ad108effd25dbda00ee733c8bca9979a",
"assets/assets/swift.png": "f84ff5624ada2490bbc0a10c73d705c5",
"assets/assets/linkedin.png": "1e58a02b1506fcf8cb56faeba555567e",
"assets/assets/playstore_color.png": "d97980b307d1fbc221f72db47275dcd4",
"assets/assets/profile_pic1.JPG": "b670a14d8478f31d2161582e64a3cae7",
"assets/assets/puledInImage.png": "f45c64e0e9562ea41cfa4bd5e07ba1f3",
"assets/assets/appstore_color.png": "f007735bf9e682c1396150b7d9550b7a",
"assets/assets/playstore.png": "95f5d72fe5a0ada7afe59f93c0d4f92e",
"assets/assets/clinirexCheckerInfo.png": "9424165421e8ce200922aafa614faa41",
"assets/assets/facebook.png": "d4406e86fe69b9c36d273eac488117e6",
"assets/assets/git_color.png": "227b70ec186876a6a966e31f91fbe076",
"assets/assets/hcl.jpeg": "4a6491d42d454cbd4415415187fdbe93",
"canvaskit/canvaskit.js": "43fa9e17039a625450b6aba93baf521e",
"canvaskit/profiling/canvaskit.js": "f3bfccc993a1e0bfdd3440af60d99df4",
"canvaskit/profiling/canvaskit.wasm": "a9610cf39260f60fbe7524a785c66101",
"canvaskit/canvaskit.wasm": "04ed3c745ff1dee16504be01f9623498"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
