const CACHE_NAME = "pass-simples-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/styles.css",
  "/script.js",
  "/manifest.json",
  "/Imagem/LOGO_PASS_SIMPLES_2.png",
  "/Imagem/icone_sinal_menos.png",
  "/Imagem/icone_sinal_mais.png",
  "/Imagem/chave_de_encriptacao.png",
  "/Imagem/CADEADO_Criptografia_de_dados.png",
  "/Imagem/criptografia_de_dados.png",
  "/Imagem/icone_WhatsApp.png",
  "/Imagem/facebook-logo-in-circular-shape.png",
  "/Imagem/instagram.png",
  "/Imagem/Icone_youtube.png"
];

// Instalar o service worker e armazenar os arquivos no cache
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(FILES_TO_CACHE);
      })
      .catch(error => console.warn("Falha ao armazenar no cache:", error))
  );
});

// Ativar o service worker e limpar caches antigos
self.addEventListener("activate", event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptar requisições e retornar conteúdo do cache ou rede
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Se o arquivo estiver no cache, retorna ele
      if (cachedResponse) {
        return cachedResponse;
      }

      // Caso contrário, tenta buscar na rede e colocar no cache para o futuro
      return fetch(event.request).then(response => {
        // Verifica se a resposta é válida e se o recurso deve ser armazenado no cache
        if (response && response.status === 200 && response.type === "basic") {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, response.clone());
          });
        }
        return response;
      }).catch(() => {
        // Caso a requisição falhe (por exemplo, em uma rede sem conexão), tenta retornar o arquivo do cache
        return caches.match(event.request);
      });
    })
  );
});
