"use strict";

window.addEventListener('load', async (e) => {
  if (window.localStorage.getItem('background')) {
    // set body.style.backgroundImage to window.localStorage.getItem('background')
    document.body.style.backgroundImage = `url("/windows/${window.localStorage.getItem('background')}")`;
  } else {
    // set to background1.jpg
    window.localStorage.setItem('background', 'wallpaper1.jpg');
    document.body.style.backgroundImage = `url("/windows/wallpaper1.jpg")`;
  }

  const onceDone = (unused) => {console.log("[INDEX.JS] page load oncedone called " + unused)};
  var errmsg = "";
    var err2msg = "";
    try {
        await registerSW();
        console.log("[INDEX.JS] registerSW success");
    } catch (err) {
        console.log("[INDEX.JS] registerSW fail");
        errmsg = (err).message;
    }

    try {
        await setTransport("epoxy");
        console.log("[INDEX.JS] transport success");
    } catch (err2) {
        console.log("[INDEX.JS] transport fail");
        err2msg = (err2).message;
    }
    
    if (errmsg.includes("registerSW is not defined") || err2msg.includes("setTransport is not defined")) {
        onceDone(false);
        return;
    }

  async function waitForConfig() {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (__uv$config !== null && __uv$config !== undefined) {
          clearInterval(interval);
          resolve();
        }
      }, 100); // Check every 100 milliseconds
    });
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  await waitForConfig();
  await delay(500);
  onceDone(true);
})