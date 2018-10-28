exports.updateLatestDeployStatus = function (admin, targetName, deployStatusData) {
    global.logManager.PrintLogMessage("DBManager", "updateLatestDeployStatus", "#" + targetName + " received data: " + JSON.stringify(deployStatusData),
        global.defineManager.LOG_LEVEL_DEBUG)

    var deployStatusDBPath = global.defineManager.DB_PATH_DEPLOY_STATUS + targetName

    global.logManager.PrintLogMessage("DBManager", "updateLatestDeployStatus", "status save path: " + deployStatusDBPath,
        global.defineManager.LOG_LEVEL_DEBUG)

    admin.database().ref(deployStatusDBPath).set(deployStatusData)
}