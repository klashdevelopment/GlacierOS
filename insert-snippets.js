const fs = require('fs');
const path = require('path');

// Define the path to the file
const filePath = path.join(path.join(__dirname, 'glacier-server/client'), 'index.html');

// Define the code snippets to insert
const headSnippet = `<script src="/baremux/index.js" defer></script>
<script src="/uv/uv.bundle.js" defer></script>
<script src="/uv/uv.config.js" defer></script>
<script src="/enigma/register-sw.js" defer></script>\n`;
const bodySnippet = `<script src="/search.js" defer></script><script src="/index.js" defer></script>\n`;

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }
  const headInserted = data.replace('</head>', `${headSnippet}</head>`);
  const bodyInserted = headInserted.replace(/<\/body>(?!.*<\/body>)/s, `${bodySnippet}</body>`);
  
  fs.writeFile(filePath, bodyInserted, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to the file:', err);
      return;
    }
    console.log('Snippets inserted successfully.');
  });
});
