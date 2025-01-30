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
  prefix: "https://tortillagames.org/zz/service/",
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: "https://tortillagames.org/zz/zz.handler.js",
  client: "https://tortillagames.org/zz/zz.client.js",
  bundle: "https://tortillagames.org/zz/zz.bundle.js",
  config: "https://tortillagames.org/zz/zz.config.js",
  sw: "https://tortillagames.org/zz/zz.sw.js",
  inject: [
    { 
      "host": "/^https:\/\/copy\.sh\/v86\/\?/",
      "injectTo": "head",
      "html": "<style>"+V86Inject+"</style>"
    },
  ]
};
