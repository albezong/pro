console.log('Service Worker Cargando - version 2');

self.addEventListener('install', function (evento) {
  /*
    * Para que se utilizara mas adleante:
    - Preparar recursos de la nueva version,
    - por ejemplo, precachear archivos
    */
  console.log('Evento install del Service Worker');
});

self.addEventListener('activate', evento => {
  /**
   * Limpiar y ajustar recursos de versiones anteriores
   * por ejemplo, eliminar caches antiguas
   */
  console.log('Evento activate del Service Worker');
});

self.addEventListener('fetch', evento => {
  /**
   * El service worker observa las solicitudes
   * mediante el evento fetch que estan en su ambito
   * pero todavia no modifica la respuesta hasta que
   * maneje el cache storage.
   *
   * Evento fetch vs funcion fetch:
   * El primero escucha solicitudes dentro del service worker
   * El segundo es una funcion de javascript para realizar
   * soliciudes HTTP.
   * Service Worker activo vs PAgina controlada:
   */
  console.log('Evento fetch: ', evento.request.url);
});
