import express from "express";
import { createServer } from "node:http";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
// import { uvPath as uvOldPath } from "uv-old";
import { join } from "node:path";
import { hostname } from "node:os";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { bareModulePath } from "@mercuryworkshop/bare-as-module3";
import cors from "cors";
import { createBareServer } from "@tomphttp/bare-server-node";

import wisp from "wisp-server-node";

// import runDiscordBot from "./discord.js";

const app = express();
const publicPath = './banned/';
const bareServer = createBareServer("/bare/");
// const bareOld = createBareServer("/bare2/");

// Load our publicPath first and prioritize it over UV.
app.use(express.static(publicPath));
app.use('/poker/', express.static("./poker/"));
app.use('/quadpad/', express.static("./quadpad/"));
// Load vendor files last.
// The vendor's uv.config.js won't conflict with our uv.config.js inside the publicPath directory.
app.use("/uv/", express.static(uvPath));
// app.use("/uv2/", express.static(uvOldPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/libcurl/", express.static(libcurlPath));
app.use("/bareasmodule/", express.static(bareModulePath));
app.use("/baremux/", express.static(baremuxPath));
app.use("/bare", cors({ origin: "*" }));

// var forumHandler = (req, res) => {
//   res.send("Forum handler not yet initalized - please wait a moment.");
// };
// var onDie = () => {};
// if(process.env.DISCORD_TOKEN && process.env.DISCORD_CLIENT_ID) {
//   runDiscordBot((handler, die) => {
//     forumHandler = handler;
//     onDie = die;
//   });

//   // let connection = new BareMuxConnection("/baremux/worker.js")
//   // await connection.setTransport("/epoxy/index.mjs", [{ wisp: "wss://wisp.mercurywork.shop/" }]);
//   // await connection.setTransport("/baremod/index.mjs", ["https://tomp.app/"]);

//   app.get("/check-forums", (req, res) => {
//     forumHandler(req, res);
//   })
// }
// Error for everything else
app.use((req, res) => {
  res.status(404);
  res.send("Glacier could not find this page. (404)");
});

const server = createServer();

server.on("request", (req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  }/* else if (bareOld.shouldRoute(req)) {
    bareOld.routeRequest(req, res);
  }*/ else {
    app(req, res);
  }
})

server.on("upgrade", (req, socket, head) => {
  if (req.url.endsWith("/wisp/")) {
    wisp.routeRequest(req, socket, head);
  } else {
	  if (bareServer.shouldRoute(req)) {
		  bareServer.routeUpgrade(req, socket, head);
	  }/* else if (bareOld.shouldRoute(req)) {
      bareOld.routeUpgrade(req, socket, head);
    }*/ else {
		  socket.end();
	  }
  }
});

let port = parseInt(process.env.PORT || "");

if (isNaN(port)) port = 8080;

server.on("listening", () => {
  const address = server.address();

  // by default we are listening on 0.0.0.0 (every interface)
  // we just need to list a few
  console.log("Listening on:");
  console.log(`\thttp://localhost:${address.port}`);
  console.log(`\thttp://${hostname()}:${address.port}`);
  console.log(
    `\thttp://${
      address.family === "IPv6" ? `[${address.address}]` : address.address
    }:${address.port}`
  );
});

// https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close();
  bareServer.close();
  //bareOld.close();
  process.exit(0);
}

server.listen({
  port,
});
