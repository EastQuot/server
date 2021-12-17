const express = require('express')
const app = express();

const connections = []



app.use(express.json());
app.use(express.urlencoded());



app.get('/', (_, res) => res.send('Hello World!'))


app.get('/event', (req, res) => {
    if (req.headers.accept && req.headers.accept.includes('text/event-stream')) {
        handleSSE(res, connections)
        return sendSSE({ init: true }, [res])
    }
})

app.post('/steam', (req, res) => {
    // res.writeHead(200, {
    //     'Access-Control-Allow-Origin': '*',
    // })
    sendSSE(req.body, connections)
    res.send('Okey');
})






function handleSSE(res, connections = []) {
    connections.push(res)
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': 'content-type',
        Connection: 'keep-alive'
    })
    res.on('close', () => {
        connections.splice(connections.findIndex(c => res === c), 1)
    })
}

function sendSSE(data, connections = []) {
    connections.forEach(connection => {
        const id = new Date().toISOString()
        connection.write('id: ' + id + '\n')
        connection.write('data: ' + JSON.stringify(data) + '\n\n')
    })
}






app.listen(3000, (e) => {
    console.log(`Example app listening at 3000`)
})



// const host = '0.0.0.0';
// const port = 80;

// const http = require('http')

// const server = http.createServer((req, res) => {
//     res.end('Trololo')
// });

// server.listen(port, host, () => {
//     console.log(`Server is running on http://${host}:${port}`);
// });




