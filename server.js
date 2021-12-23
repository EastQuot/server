const express = require('express')
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const https = require('https');
const port = 3000;
const connections = []

token = '5099337081:AAGCFJry8z178TZZYv54TRxxxsooz1b1wT8';

var key = fs.readFileSync(__dirname + '/certs/selfsigned.key');
var cert = fs.readFileSync(__dirname + '/certs/selfsigned.crt');

var options = {
  key: key,
  cert: cert
};

app = express();
app.use(express.json());
app.use(express.urlencoded());

const bot = new TelegramBot(token, {polling: true});

let chatIds = fs.readFileSync('chatid.txt', 'utf8').split(';');
chatIds = chatIds.slice(0, chatIds.length - 1);
console.log(chatIds)

bot.on('message', msg => {
    if (!~chatIds.indexOf(msg.chat.id)) {
        fs.appendFile('chatid.txt', `${msg.chat.id};`, () => {})
        chatIds.push(msg.chat.id);
    }
})

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



app.post('/logout', (req, res) => {
    chatIds.forEach(id => {
        bot.sendMessage(id, JSON.stringify(req.body))
    })

    fs.appendFile('logout.txt', `${new Date().toLocaleString()} : ${JSON.stringify(req.body.id)}\n`, () => {})
    res.send('Отправил в ведомство информацию о том что произошел разлогин');
})



var server = https.createServer(options, app);

server.listen(port, () => {
  console.log("server https starting on port : " + port)
});






{

    token = '5062287028:AAEYe2EqmZ0c2D3lCXnsgNyRLhmJF3r7HgU';
    const bot = new TelegramBot(token, { polling: true });

    bot.on('message', msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        console.log(text)

        if (text === '/love') bot.sendMessage(chatId, `❤️‍🩹`);

        if (text === '/morelove') {
            [1,2,3,4].forEach(() => bot.sendMessage(chatId, `❤️`))
            setTimeout(() => {
                bot.sendMessage(chatId, `❤️‍🔥!`);
            }, 700)
        }

        if (text === '/moremorelove') {
            [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].forEach((_, i) => {
                bot.sendMessage(chatId, `❤️!`);

                setTimeout(() => {
                    bot.sendMessage(chatId, `❤️!`);
                }, i * 200)
            })
            setTimeout(() => {
                bot.sendMessage(chatId, `❤️`);
            }, 6000)
        }

        if (text.match(/мяу/i)) {
            bot.sendMessage(chatId, 'мур!')
        }

        if (text.match(/мур/i)) {
            bot.sendMessage(chatId, '...')
        }
    })

    bot.setMyCommands([
        {command: '/love', description: 'Получить сердечко'},
        {command: '/morelove', description: 'Получить много сердечек!'},
        {command: '/moremorelove', description: 'Получить очень много сердечек!!!'},
    ])
}















