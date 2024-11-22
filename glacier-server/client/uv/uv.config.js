var V86Inject = `*:not(#screen_container, #screen_container *, html, body) {
    display: none !important;
}
html, body {
    font-size: 0;
}
#screen_container {
    width: 100vw;
    display: flex !important;
    align-items: center;
    justify-content: center;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
}`;

self.__uv$config = {
  prefix: "/uv/service/",
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: "/uv/uv.handler.js",
  client: "/uv/uv.client.js",
  bundle: "/uv/uv.bundle.js",
  config: "/uv/uv.config.js",
  sw: "/uv/uv.sw.js",
  inject: [
    { 
      "host": "/^https:\/\/copy\.sh\/v86\/\?/",
      "injectTo": "head",
      "html": "<style>"+V86Inject+"</style>"
    },
  ]
};
