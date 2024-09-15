"use strict";
/**
 * enigma sw
 */

const allowedHostnames = ["localhost", "127.0.0.1"];


async function setTransport(transportsel) {

  const connection = new BareMux.BareMuxConnection("/baremux/worker.js")
  const wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
  const bareUrl = location.protocol + "//" + location.host + "/bare/";

  if (transportsel == "epoxy") {
    await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
  } else if (transportsel == "libcurl") {
    await connection.setTransport("/libcurl/index.mjs", [{ wisp: wispUrl }]);
  } else {    
    await connection.setTransport("/bareasmodule/index.mjs", [ bareUrl ]);
  }
}

async function registerSW() {
  if (!navigator.serviceWorker) {
    if (
      location.protocol !== "https:" &&
      !allowedHostnames.includes(location.hostname)
    )
      throw new Error("Service workers cannot be registered without https.");

    throw new Error("Your browser doesn't support service workers.");
  }

  await navigator.serviceWorker.register("/uv/sw.js");
}