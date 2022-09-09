const PORT = 8080;
const http = require('http');
const fs = require('fs');
const WsHixie = require('ws-plus-hixie');
filewatcher = require('filewatcher');

const server = http.createServer((request, response) => {
    url = request.url;

    if(url.indexOf("?") > 0)
        url = url.substring(0, url.indexOf("?"));

    console.log("URL: " + url);

    if(!fs.existsSync('.' + url)) {
        console.log("ERROR: NOT FOUND: " + url);
        return;
    }



    if (url === '/' || url === '/index.html') {
        response.setHeader('Content-Type', 'text/html');
        fs.createReadStream('index.html').pipe(response);
    } else if (url === '/client.js') {
        response.setHeader('Content-Type', 'application/javascript');
        fs.createReadStream('client.js').pipe(response);
    } else if (url === '/gcal.png') {
        response.setHeader('Content-Type', 'image/png');
        fs.createReadStream('gcal.png').pipe(response);
    } else if (url === '/screenshot.png') {
        response.setHeader('Content-Type', 'image/png');
        fs.createReadStream('screenshot.png').pipe(response);
    }
});

const wsBridge = new WsHixie(server);

const sendMessage = function(scope, message) {
    const json = JSON.stringify({ msj : message, sc : scope});
    wsBridge.send(json);
    console.log("message sent:" + json);
}
server.on("error", error => {
    if (error.code === "EADDRINUSE")
	console.log("ERROR: Port already in use");
    else
	console.log(error);
});

server.on("request", request => {
    console.log("New request");
});


// Start watching directory..
const watcher = filewatcher();
watchFiles = ["./screenshot.png", "./gcal.png"];
for(const url of watchFiles){
    if(!fs.existsSync(url)) {
        console.log(url, "NOT FOUND, creating... ");
        fs.closeSync(fs.openSync(url, 'w'));
    }
    watcher.add(url);
}

watcher.on("change", function(filename, stat) {
    sendMessage("bg", filename.substring(2));
});

server.listen(PORT);

console.log("Listening on port " + PORT);
