const fs = require('fs')
const https = require('https');
const express = require('express');
const socketIO = require('socket.io');
const cors = require('cors')
const namespaces = require('./namespaces/index')
const app = express();
app.use(cors())
const httpsOptions = {
    key: fs.readFileSync('./certificates/localhost-key.pem'),
    cert:fs.readFileSync('./certificates/localhost.pem')
}

const server = https.createServer(
    httpsOptions,
    app
)

const io = socketIO(server, {
    cors: {
        origin:'https://localhost:3000'
    }
});


let clients = 0;
// io.on('connection', (socket) => {
//     clients++;
//     console.log("new connection established !")
//     socket.on('sendMessage', (data) => {
//         console.log("Here is your message", data.message);

//         socket.broadcast.emit('receivedMessage',JSON.stringify(data))
        
//     })

//     socket.on('disconnect', () => {
//         clients--;
//         console.log("a client is disconnected !")
//     })
// })



namespaces(io);

app.get('/get')
app.get('/getclients', (req, res) => {
    res.json({numberOfClients:clients})
})


server.listen(3001, () => {
    console.log("Hello I am listening on 3001")
})






























// const express = require('express')
// const fs = require('fs')
// const app = express();
// const webSocket = require('ws')
// const cors = require('cors')
// const next = require('next')
// // const server = require('http').createServer(app);
// const dev = process.env.NODE_ENV !== 'production';
// const nextapp = next({ dev });
// const handle = nextapp.getRequestHandler();

// const https = require('https')
// const httpsOptions = {
//     key: fs.readFileSync('key.pem'),
//     cert: fs.readFileSync('cert.pem')
//   }
// const server = https.createServer(httpsOptions, app);

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// // Add certificate to global agent's trusted store
// https.globalAgent.options.ca = https.globalAgent.options.ca || [];
// https.globalAgent.options.ca.push(fs.readFileSync('cert.pem'));
// // Start HTTPS server for Next.js
// const nextServer = https.createServer(httpsOptions, nextapp.getRequestHandler());


// const wss = new webSocket.Server({server:server})

// let clients = 0;
// let users = [];
// let messages = [];
// wss.on('connection', (ws) => {
//     console.log("a new client is connected !")
//     clients++;
//     ws.send("Welcome new Client");
//     // ws.on('single-message', function message(data, isBinary) {
//     //     messages.push(data.toString());

//     //     wss.clients.forEach(function each(client) {
//     //         if (client !== ws && client.readyState === webSocket.OPEN) {
//     //             console.log(data.toString())
//     //             client.send(data, { binary: isBinary });
//     //         }
//     //     })
//     // });
//     // ws.emit('')
//     ws.on('message', (message) => {
//         // console.log('data', message.toString());
//         const data = JSON.parse(message.toString());
//         // const data = message.toJSON();
//         console.log('data', data);
//         switch (data.type) {
//             case 'offer':
//             case 'answer':
//             case 'candidate':
//                 // Broadcast the message to all other clients
//                 wss.clients.forEach(client => {
//                     if (client !== ws && client.readyState === webSocket.OPEN) {
//                         client.send(JSON.stringify(data));
//                     }
//                 });

//                 break;
//             case 'single-message':
//                 messages.push(data.message);
//                     wss.clients.forEach(function each(client) {
//                         if (client !== ws && client.readyState === webSocket.OPEN) {
//                             console.log(data.message)
//                             client.send(JSON.stringify(data.message));
//                         }
//                     })
//             default:
//                 break;
//         }
//     });
// });

// app.use(cors())

// app.get('/getClients', (req, res) => {
//     res.send({ numberOfClients: clients });
// })
// app.get('/getMessages', (req, res) => {
//     res.send(JSON.stringify({ messages: messages }));
// })
// // app.get('/', (req, res) => {
// //     res.send("Hello World")
// // });


// // module.exports =  server;

// server.listen(3001, () => {
//     console.log("listening on 3001")
// })

// // Start Next.js server on a different port
// nextapp.prepare().then(() => {

//     // app.all('*', (req, res) => {
//     //     return handle(req, res);
//     // });
//     nextServer.listen(3000, () => {
//       console.log('Next.js server is running on https://localhost:3000');
//     });
//   }).catch((err) => {
//     console.error('Error starting Next.js server:', err);
//   });
  