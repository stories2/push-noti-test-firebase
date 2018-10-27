app.service("ADSModuleService", function ($log, $http) {

    var config = {
        apiKey: "AIzaSyBUYrZc8LRnx9aCBfCdleV1H0PzQsOUBvk",
        authDomain: "push-noti-test-400f1.firebaseapp.com",
        databaseURL: "https://push-noti-test-400f1.firebaseio.com",
        projectId: "push-noti-test-400f1",
        storageBucket: "push-noti-test-400f1.appspot.com",
        messagingSenderId: "50393355350"
    };
    firebase.initializeApp(config);

    var printLogMessage = function (className, methodName, message, logLevel) {
        var logDateTime = new Date().toISOString();
        var logMsg = "" + logDateTime + " ";
        if (logLevel == LOG_LEVEL_VERBOSE) {
            logMsg = logMsg + "V: ";
            logMsg = logMsg + "[" + className + "] {" + methodName + "} (" + message + ")";
            $log.log(logMsg);
        }
        else if (logLevel == LOG_LEVEL_INFO) {
            logMsg = logMsg + "I: ";
            logMsg = logMsg + "[" + className + "] {" + methodName + "} (" + message + ")";
            $log.log(logMsg);
        }
        else if (logLevel == LOG_LEVEL_DEBUG) {
            logMsg = logMsg + "D: ";
            logMsg = logMsg + "[" + className + "] {" + methodName + "} (" + message + ")";
            $log.log(logMsg);
        }
        else if (logLevel == LOG_LEVEL_WARN) {
            logMsg = logMsg + "W: ";
            logMsg = logMsg + "[" + className + "] {" + methodName + "} (" + message + ")";
            $log.log(logMsg);
        }
        else if (logLevel == LOG_LEVEL_ERROR) {
            logMsg = logMsg + "E: ";
            logMsg = logMsg + "[" + className + "] {" + methodName + "} (" + message + ")";
            $log.warn(logMsg);
        }
        else {
            logMsg = logMsg + "W: ";
            logMsg = logMsg + "[" + className + "] {" + methodName + "} (" + message + ")";
            $log.error(logMsg);
        }
        return;
    };
    var postReq = function (url, data, successFunc, failFunc, token) {
        printLogMessage("AutoDeployClientService", "postReq", "send data to url: " + url, LOG_LEVEL_INFO);
        // data["seconds"] = this.PreventCache()
        $http({
            method: "POST",
            dataType: 'json',
            url: url,
            cache: false,
            contentType: 'application/json',
            data: data,
            crossDomain: true,
            // headers: {
            //     "Authorization": token
            // },
            xhrFields: {
                withCredentials: false
            },
            beforeSend: function (xhr) {
                if (typeof token != 'undefined') {
                    printLogMessage("AutoDeployClientService", "postReq", "auth: " + token, LOG_LEVEL_DEBUG);
                    xhr.setRequestHeader("Authorization", token);
                }
                else {
                    printLogMessage("AutoDeployClientService", "postReq", "no token sending", LOG_LEVEL_WARN);
                }
            }
        })
            .then(function (receivedData) {
                printLogMessage("AutoDeployClientService", "postReq", "data received successfully", LOG_LEVEL_INFO);
                successFunc(receivedData);
            })
            .catch(function (xhr, textStatus, errorThrown) {
                printLogMessage("AutoDeployClientService", "postReq", "something has problem: " + textStatus, LOG_LEVEL_ERROR);
                failFunc(xhr.responseText, textStatus);
            });
    };
    var getReq = function (url, data, successFunc, failFunc, token) {
        printLogMessage("AutoDeployClientService", "getReq", "send data to url: " + url, LOG_LEVEL_INFO);
        // data["seconds"] = this.PreventCache()
        $http({
            type: "GET",
            dataType: 'json',
            url: url,
            cache: false,
            contentType: 'application/x-www-form-urlencoded',
            params: data,
            async: false,
            crossDomain: true,
            // headers: {
            //     "Authorization": token
            // },
            xhrFields: {
                withCredentials: false
            },
            beforeSend: function (xhr) {
                if (typeof token != 'undefined') {
                    printLogMessage("AutoDeployClientService", "getReq", "auth: " + token, LOG_LEVEL_DEBUG);
                    xhr.setRequestHeader("Authorization", token);
                }
                else {
                    printLogMessage("AutoDeployClientService", "getReq", "no token sending", LOG_LEVEL_WARN);
                }
            }
        })
            .then(function (receivedData) {
                printLogMessage("AutoDeployClientService", "getReq", "data received successfully", LOG_LEVEL_INFO);
                successFunc(receivedData);
            })
            .catch(function (xhr, textStatus, errorThrown) {
                printLogMessage("AutoDeployClientService", "getReq", "something has problem: " + textStatus, LOG_LEVEL_ERROR);
                failFunc(xhr.responseText, textStatus);
            });
    };
    return {
        'printLogMessage': printLogMessage,
        'postReq': postReq,
        'getReq': getReq
    };
});