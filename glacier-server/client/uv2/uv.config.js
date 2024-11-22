// This file overwrites the stock UV config.js

self.__uv$config = {
    prefix: "/uv2/service/",
    bare: "/bare2/",
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: "/uv2/uv.handler.js",
    client: "/uv2/uv.client.js",
    bundle: "/uv2/uv.bundle.js",
    config: "/uv2/uv.config.js",
    sw: "/uv2/uv.sw.js",
};