exports.SendPushMsg = function (webpush, targetName, data) {

    subscriberDBPath = global.defineManager.DB_PATH_SUBSCRIBER + targetName
    dataStr = JSON.stringify(data)

    global.logManager.PrintLogMessage("PushManager", "SendPushMsg", "subscriber: " + subscriberDBPath + " with data: " + dataStr,
        global.defineManager.LOG_LEVEL_DEBUG)

    admin.database().ref(subscriberDBPath).once('value', function (snapshot) {
        subscriberSnapshot = snapshot.val()
        global.logManager.PrintLogMessage("PushManager", "SendPushMsg", "subscriber snapshot: " + subscriberSnapshot,
            global.defineManager.LOG_LEVEL_DEBUG)
    })
}