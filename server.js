const PORT = 8080;
const http = require('http');
const fs = require('fs');
const WsHixie = require('ws-plus-hixie');
const filewatcher = require('filewatcher');

const server = http.createServer((request, response) => {
    url = request.url;

    if (url.indexOf('?') > 0)
        url = url.substring(0, url.indexOf('?'));

    console.log('URL: ' + url);

    if (!fs.existsSync('.' + url)) {
        console.log('ERROR: NOT FOUND: ' + url);
        return;
    }

    switch (url) {
        case '/':
        case '/index.html':
            response.setHeader('Content-Type', 'text/html');
            fs.createReadStream('index.html').pipe(response);
            break;
        case '/client.js':
            response.setHeader('Content-Type', 'application/javascript');
            fs.createReadStream('client.js').pipe(response);
            break;
        case '/gcal.png':
            response.setHeader('Content-Type', 'image/png');
            fs.createReadStream('gcal.png').pipe(response);
            break;
        case '/screenshot.png':
            response.setHeader('Content-Type', 'image/png');
            fs.createReadStream('screenshot.png').pipe(response);
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
watchFiles = ['./screenshot.png', './gcal.png'];
for (const url of watchFiles) {
    if (!fs.existsSync(url)) {
        console.log(url, 'NOT FOUND, creating... ');
        fs.closeSync(fs.openSync(url, 'w'));
    }
    watcher.add(url);
}

var last = Date.now();

watcher.on('change', (filename, stat) => {
    if (stat.blocks < 1 || stat.size < 1) return;
    var now = Date.now();
    if (now - last < 1000) return;	    // file watcher flood protection
    console.log('onChange:', filename, stat);
    sendMessage('bg', filename.substring(2));
    last = now;
});

server.listen(PORT);

console.log('Listening on port ' + PORT);
