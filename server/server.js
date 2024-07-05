const fs = require('fs')
const https = require('https');
const express = require('express');
const socketIO = require('socket.io');
const cors = require('cors')
const namespaces = require('./namespaces/index')
const app = express();
// const authRoute = require('./routes/auth')
const indexRoute = require('./routes')
const middleware = require('./middleware/middleware')
app.use(cors())
const httpsOptions = {
    key: fs.readFileSync('./certificates/localhost-key.pem'),
    cert: fs.readFileSync('./certificates/localhost.pem'),
    rejectUnauthorized: false,
    requestCert: false,
    agent: false
    
    
}

const server = https.createServer(
    httpsOptions,
    app
)

const io = socketIO(server, {
    cors: {
        origin: '*',
        
    }
});


let users = {};

let clients = 0;
// app.use(middleware.checkUser);

const socketIdToUserId = {};
const userIdToSocketId = {};

io.on('connection', (socket) => {
    console.log("new connection established !")
    
    console.log("uid", socket.handshake.query.uid);
    console.log("socket id", socket.id);

    socketIdToUserId[socket.id] = socket.handshake.query.uid;
    userIdToSocketId[socket.handshake.query.uid] = socket.id;


    socket.on('disconnect', () => {
        // clients--;
        console.log("a client is disconnected !")
    })
})


const mapping = {
    socketIdToUserId: socketIdToUserId,
    userIdToSocketId: userIdToSocketId,
}
namespaces(io,mapping);
// app.use('/auth', authRoute);
// indexRoute(app);
app.get('/', (req, res) => {
    res.send("hello world man ")
})
app.get('/getclients', (req, res) => {
    res.json({numberOfClients:clients})
})

app.get('/getUsers', (req, res) => {
    res.json({ users: users })
});


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
  