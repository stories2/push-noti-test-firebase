global.defineManager = require('./Settings/DefineManager');
global.logManager = require('./Utils/LogManager');

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const express = require('express');
const cors = require('cors')({origin: true});
const app = express();
const publicApp = express();
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
 * For client api
 ************************************************************/

publicApp.use(cors)

publicApp.post("/UpdateStatus/:targetName", function (request, response) {
    targetName = request.params.targetName
    responseMessage = {
        'success': false
    }

    var dbManager = require('./Core/DBManager');

    global.logManager.PrintLogMessage("index", "UpdateStatus", "update status request accepted, from -> " + targetName,
        global.defineManager.LOG_LEVEL_DEBUG)

    dbManager.updateLatestDeployStatus(admin, targetName, request.body)

    responseMessage['success'] = true

    response.setHeader('Content-Type', 'application/json');
    response.status(200).send(JSON.stringify(responseMessage))
})

exports.public = functions.https.onRequest(publicApp);

/************************************************************
 * For admin web service
 ************************************************************/

// const verifyAuthToken = function (request, response, next) {
//     try {
//         token = request.get('Authorization')
//         admin.auth().verifyIdToken(token)
//             .then(function (decodedToken) {
//                 global.logManager.PrintLogMessage("index", "verifyAuthToken", "token verified uid: " + decodedToken.uid, global.defineManager.LOG_LEVEL_INFO)
//                 request.user = decodedToken
//                 admin.auth().getUser(decodedToken.uid)
//                     .then(function (userRecord) {
//                         global.logManager.PrintLogMessage("index", "verifyAuthToken", "we found user info", global.defineManager.LOG_LEVEL_DEBUG)
//                         userRecordData = userRecord.toJSON()
//                         userRecordDataStr = JSON.stringify(userRecordData)
//                         request.userRecordData = userRecordData
//                         global.logManager.PrintLogMessage("index", "verifyAuthToken", "user info decoded : " + userRecordDataStr, global.defineManager.LOG_LEVEL_INFO)
//                         return next();
//                     })
//                     .catch(function (error) {
//                         global.logManager.PrintLogMessage("index", "verifyAuthToken", "cannot verify user", global.defineManager.LOG_LEVEL_ERROR)
//                         tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}
//
//                         responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_UNAUTHORIZED, response)
//                     })
//             })
//             .catch(function (error) {
//                 global.logManager.PrintLogMessage("index", "verifyAuthToken", "cannot verify token", global.defineManager.LOG_LEVEL_ERROR)
//                 tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}
//
//                 responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_UNAUTHORIZED, response)
//             })
//     }
//     catch (exception) {
//         global.logManager.PrintLogMessage("index", "verifyAuthToken", "server crashed", global.defineManager.LOG_LEVEL_ERROR)
//         tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}
//
//         responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_SERVER_ERROR, response)
//     }
// }

privateApp.use(cors)
// privateV2.use(verifyAuthToken)

privateApp.post("/SendPush", function (request, response) {
    targetName = request.body["pushRegisteredID"]
    responseMessage = {
        'success': false
    }

    global.logManager.PrintLogMessage("index", "SendPush", "send push request accepted, to -> " + targetName,
        global.defineManager.LOG_LEVEL_DEBUG)

    var pushManager = require('./Core/PushManager');
    pushManager.SendPushMsg(admin, webpush, targetName, request.body)

    responseMessage['success'] = true

    response.setHeader('Content-Type', 'application/json');
    response.status(200).send(JSON.stringify(responseMessage))
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