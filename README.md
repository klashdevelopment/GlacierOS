# GlacierOS
GlacierOS's only official open source repo: klashdevelopment/GlacierOS

```
Instructions below may be changing as glacier goes into a static-only state. They should apply until stated otherwise
```

## Hosting
You're gonna want to host `glacier-server`. (`npm install` first obv) That repo includes the actual glacier hostable code and files.

**Fly.io**
Enter `glacier-server` using `cd` and deploy using `fly launch`, copying the settings.

**Self-host services**

- [Replit](https://replit.com/@gavingogaminalt/glacierOSReplit?v=1) - Run the project
- [CodeSandbox](https://codesandbox.io/p/devbox/jxw75r) - Run the project
- [Koyeb](https://app.koyeb.com/deploy?name=glacieros&repository=klashdevelopment%2FGlacierOS&branch=main&workdir=.%2Fglacier-server&run_command=npm+start&instance_type=free&regions=was&instances_min=0&autoscaling_sleep_idle_delay=300&ports=8080%3Bhttp%3B%2F&hc_protocol%5B8080%5D=tcp&hc_grace_period%5B8080%5D=5&hc_interval%5B8080%5D=30&hc_restart_limit%5B8080%5D=3&hc_timeout%5B8080%5D=5&hc_path%5B8080%5D=%2F&hc_method%5B8080%5D=get) - Deploy

**Other services**
Glacier server can be deployed on any service - simply host `glacier-server` however you need to as a NodeJS project.

## Modifying
`glacier-client` contains the pure UI and featureset of Glacier in next.js. Feel free to modify and make PRs!

To add an app/game, modify `applist.json` using the schema below:
```json
{
  "name": "",
  "unblock":false,
  "image": "",
  "description": "",
  "url": "",
  "category": ""
}
```

**Name**: Window name, app name, etc.
**Unblock**: FALSE will disable all anti-censorship methods.
**Image**: URL to image for app icon. Square (1:1) please
**Description**: 1-2 sentence description. Doesn't need to be too long.
**Url**: Link to the actual content website.
**Category**: Comma-seperated list of categories. MUST have "Apps", "Games", "VMS", "VMP", or "Devtools" to show in Store.

Run it using `npm run dev` and build using the guide below.

## Building
1. Head into glacier-client
2. Run `npm run build`
3. To put into glacier-server, first copy all files (override) from `glacier-client/out` into `glacier-server/client`.
4. In the root directory, run `node insert-snippets.js`.

If that doesnt work:
4. Open up `client/index.html` and `client/Scripts.md`.
5. In scripts.md, copy the body tags.
6. Find the first `</body>` inside of index.html and paste the scripts before it.
7. Do the same for the `</head>` and head scripts.
