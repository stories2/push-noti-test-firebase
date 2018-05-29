const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const express = require('express');
const cors = require('cors')({origin: true});
const app = express();

const serverKey = {
    publicKey: functions.config().server.public_key,
    privateKey: functions.config().server.private_key
}

app.use(cors)

app.get("/keyboard", function (request, response) {
    responseMessage = {
        "type" : "buttons",
        "buttons" : ["Send Test Noti"]
    }

    // response.setHeader('Content-Type', 'application/json');
    response.status(200).send(JSON.stringify(responseMessage))
})

app.post("/message", function (request, response) {

    console.log("/message-> user_key: " + request.body["user_key"])
    responseMessage = {
        "message": {
            "text": request.body["content"],
        },
        "keyboard": {
            "type" : "buttons",
            "buttons" : ["Send Test Noti"]
        }
    }

    response.setHeader('Content-Type', 'application/json');
    response.status(200).send(JSON.stringify(responseMessage))
})

app.post("/friend", function (request, response) {

    console.log("/friend-> user_key: " + request.body["user_key"])
    response.setHeader('Content-Type', 'application/json');
    response.status(200).send()
})

app.delete("/friend/:user_key", function (request, response) {
    response.setHeader('Content-Type', 'application/json');
    response.status(200).send()
})

app.delete("/chat_room/:user_key", function (request, response) {
    response.setHeader('Content-Type', 'application/json');
    response.status(200).send()
})

exports.v1 = functions.https.onRequest(app);