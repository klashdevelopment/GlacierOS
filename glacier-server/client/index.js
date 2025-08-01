"use strict";

window.addEventListener('load', async (e) => {
  // check if registerSW is defined
  if (typeof registerSW !== 'function') {
    console.error('registerSW is not defined, client only');
    return;
  }
  try {
    await registerSW();
  } catch (err) {
    console.error(err);
  }
  try {
    await setTransport("libcurl");
  } catch (err2) {
    console.error(err2);
  }
  async function waitForConfig() {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        try {
          if (__uv$config !== null && __uv$config !== undefined) {
            clearInterval(interval);
            resolve();
          }
        } catch (err) {
        }
      }, 100);
    });
  }
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  await waitForConfig();
  await delay(500);
})
