global.defineManager = require('./Settings/DefineManager');
global.logManager = require('./Utils/LogManager');

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const express = require('express');
const cors = require('cors')({origin: true});
const app = express();
const privateApp = express();
const webpush = require('web-push');

const serverKey = {
    publicKey: functions.config().server.public_key,
    privateKey: functions.config().server.private_key
}

webpush.setVapidDetails(
    'mailto:stories282@gmail.com',
    serverKey["publicKey"],
    serverKey["privateKey"]
);

/************************************************************
 * For admin web service
 ************************************************************/

privateApp.use(cors)

privateApp.post("/SendPush/:targetName", function (request, response) {
    targetName = request.params.targetName

    global.logManager.PrintLogMessage("index", "SendPush", "send push request accepted, to -> " + targetName,
        global.defineManager.LOG_LEVEL_DEBUG)

})

privateApp.post("/UpdateStatus/:targetName", function (request, response) {
    targetName = request.params.targetName

    global.logManager.PrintLogMessage("index", "UpdateStatus", "update status request accepted, from -> " + targetName,
        global.defineManager.LOG_LEVEL_DEBUG)
})

exports.private = functions.https.onRequest(privateApp);

/************************************************************
 * For kakaotalk chat api service
 ************************************************************/

app.use(cors)

app.get("/keyboard", function (request, response) {
    responseMessage = {
        "type" : "text"
    }

    // response.setHeader('Content-Type', 'application/json');
    response.status(200).send(JSON.stringify(responseMessage))
})

app.post("/message", function (request, response) {

    sendMsg = {
        msg: request.body["content"]
    }
    sendMsgStr = JSON.stringify(sendMsg)

    admin.database().ref('/Subscriber/').once('value', function (snapshot) {
        databaseSnapshot = snapshot.val()
        for(key in databaseSnapshot) {
            pushSubscriptionData = databaseSnapshot[key]
            webpush.sendNotification(pushSubscriptionData, sendMsgStr)
        }
    })

    console.log("/message-> user_key: " + request.body["user_key"])
    responseMessage = {
        "message": {
            "text": sendMsgStr,
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