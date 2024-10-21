# GlacierOS
GlacierOS's only official open source repo: klashdevelopment/GlacierOS

## Hosting
You're gonna want to host `glacier-server`. (`npm install` first obv) That repo includes the actual glacier hostable code and files.

**Fly.io**
Enter `glacier-server` using `cd` and deploy using `fly launch`, copying the settings.

**Replit**
~~although heavily unsupported, deploy on repl and use `npm start`.~~
Glacier just doesnt run on repl. Womp womp...

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
