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

app = express()
app.use(express.json());
app.use(express.urlencoded());



app.get('/', (_, res) => res.send('Trololo!'))


app.get('/event', (req, res) => {
    console.log('event')
    console.log(connections)
    if (req.headers.accept && req.headers.accept.includes('text/event-stream')) {
        handleSSE(res, connections)
        return sendSSE({ init: true }, [res])
    }
})

app.post('/steam', (req, res) => {
    sendSSE(req.body, connections)
    res.send('Okey');
})






function handleSSE(res, connections = []) {
    connections.push(res)
    res.writeHead(200, {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        // 'Access-Control-Allow-Headers': 'content-type',
        'Connection': 'keep-alive',
        // 'Content-length': '13'
    })
    res.on('close', () => {
        console.log('close')
        // connections.splice(connections.findIndex(c => res === c), 1)
    })
}

function sendSSE(data, connections = []) {
    connections.forEach(connection => {
        const id = new Date().toISOString()
        connection.write('data: ' + JSON.stringify(data) + '\n\n')
        connection.write('id: ' + id + '\n')
    })
}






var server = https.createServer(options, app);

server.listen(port, () => {
  console.log("server https starting on port : " + port)
});




