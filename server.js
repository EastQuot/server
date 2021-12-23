const express = require('express')
const fs = require('fs');
const https = require('https');
const port = 3000;
const connections = []

var key = fs.readFileSync(__dirname + '/certs/selfsigned.key');
var cert = fs.readFileSync(__dirname + '/certs/selfsigned.crt');

var options = {
  key: key,
  cert: cert
};

app = express();
app.use(express.json());
app.use(express.urlencoded());



app.get('/', (_, res) => res.send('Trololo!'))


app.get('/event', (req, res) => {
    if (req.headers.accept && req.headers.accept.includes('text/event-stream')) {
        handleSSE(res, connections)
        return sendSSE({ init: true }, [res]);
    }
})

app.post('/steam', (req, res) => {
    const body = {...req.body}
    sendSSE(body, connections)
    setTimeout(() => sendSSE(body, connections));
    setTimeout(() => sendSSE(body, connections), 100);
    setTimeout(() => sendSSE(body, connections), 500);
    setTimeout(() => sendSSE(body, connections), 1000);
    setTimeout(() => sendSSE(body, connections), 2000);
    setTimeout(() => sendSSE(body, connections), 3000);
    res.send('OK');
    fs.appendFile('log.txt', `${new Date().toLocaleString()} : ${JSON.stringify(body)}\n`, () => {})
})






function handleSSE(res, connections = []) {
    connections.push(res)
    res.writeHead(200, {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        // 'Access-Control-Allow-Headers': 'content-type',
        // 'Content-length': '10000000'
        'Connection': 'keep-alive',
    })
    res.on('close', () => {
        console.log('close')
        connections.splice(connections.findIndex(c => res === c), 1)
    })
}

function sendSSE(data, connections = []) {
    connections.forEach(connection => {
        const id = new Date().toISOString()
        if (!data.init) { connection.write('id: ' + id + '\n') }
        connection.write('retry:' + 0 + '\n')
        connection.write('data: ' + JSON.stringify(data) + '\n\n');
    })
}

function healthСheck() {
    connections.forEach(connection => {
        connection.write('retry:' + 0 + '\n')
        connection.write('data: ' + '' + '\n\n')
    })
}

const interval = 110000;

setInterval(() => {
    healthСheck();
}, interval)




var server = https.createServer(options, app);

server.listen(port, () => {
  console.log("server https starting on port : " + port)
});




