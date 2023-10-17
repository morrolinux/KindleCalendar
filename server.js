const PORT = 8080;
const http = require('http');
const fs = require('fs');
const WsHixie = require('ws-plus-hixie');
const filewatcher = require('filewatcher');

const server = http.createServer((request, response) => {
    let url = request.url;

    if (url.indexOf('?') > 0)
        url = url.substring(0, url.indexOf('?'));

    console.log('URL: ' + url);

    // Path base da cui servire i file
    const basePath = './public'; // Cambialo alla tua directory di base

    // La funzione sanitizePath() rimuove le parti pericolose dal percorso richiesto
    const sanitizePath = (path) => {
        return path.replace(/(\.\.\/)/g, '').replace(/^(\/*)/, '');
    };

    // Costruisci il percorso completo al file richiesto
    const fullPath = `${basePath}/${sanitizePath(url)}`;

    if (!fs.existsSync(fullPath)) {
        console.log('ERROR: NOT FOUND: ' + url);
        return;
    }

    switch (url) {
        case '/':
        case '/index.html':
            response.setHeader('Content-Type', 'text/html');
            fs.createReadStream(`${basePath}/index.html`).pipe(response);
            break;
        case '/client.js':
            response.setHeader('Content-Type', 'application/javascript');
            fs.createReadStream(`${basePath}/client.js`).pipe(response);
            break;
        case '/gcal.png':
            response.setHeader('Content-Type', 'image/png');
            fs.createReadStream(`${basePath}/gcal.png`).pipe(response);
            break;
        case '/screenshot.png':
            response.setHeader('Content-Type', 'image/png');
            fs.createReadStream(`${basePath}/screenshot.png`).pipe(response);
            break;
        default:
            response.statusCode = 404;
            response.write('Not found');
            response.end();
    }
});

const wsBridge = new WsHixie(server);

const sendMessage = (scope, message) => {
    const json = JSON.stringify({ msj: message, sc: scope });
    wsBridge.send(json);
    console.log('message sent:' + json);
}

server.on('error', error => {
    if (error.code === 'EADDRINUSE')
        console.log('ERROR: Port already in use');
    else
        console.log(error);
});

server.on('request', () => {
    console.log('New request');
});

// Start watching directory..
const watcher = filewatcher();
const watchFiles = ['./screenshot.png', './gcal.png'];

for (const url of watchFiles) {
    const fullPath = `${basePath}/${sanitizePath(url)}`;
    if (!fs.existsSync(fullPath)) {
        console.log(fullPath, 'NOT FOUND, creating... ');
        fs.closeSync(fs.openSync(fullPath, 'w'));
    }
    watcher.add(fullPath);
}

let last = Date.now();

watcher.on('change', (filename, stat) => {
    if (stat.blocks < 1 || stat.size < 1) return;
    const now = Date.now();
    if (now - last < 1000) return; // Protezione dalla flood dei file del watcher
    console.log('onChange:', filename, stat);
    sendMessage('bg', filename.substring(2));
    last = now;
});

server.listen(PORT);

console.log('Listening on port ' + PORT);
