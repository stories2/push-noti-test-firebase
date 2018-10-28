var LOG_LEVEL_VERBOSE = 0;
var LOG_LEVEL_INFO = 1;
var LOG_LEVEL_DEBUG = 2;
var LOG_LEVEL_WARN = 3;
var LOG_LEVEL_ERROR = 4;

var DB_PATH_DEPLOY_STATUS = '/DeployStatus/'
var DB_PATH_DEPLOY_STATUS_CODE = '/DeployStatusCode'
var DB_PATH_DEPLOY_PROFILE = '/DeployProfile'
var DB_PATH_DEPLOY_ORDER_TYPE = '/OrderType'

var URL_CALLBACK = 'https://us-central1-push-noti-test-400f1.cloudfunctions.net/public/UpdateStatus/'
var URL_PUSH_MSG_SEND = 'https://us-central1-push-noti-test-400f1.cloudfunctions.net/private/SendPush'

var FORM_OK = 'ok'
var FORM_CANCEL = 'cancel'

var FEEDBACK_REQUEST_PUSH_MSG_SUCCESS = '푸시 메시지 전송 요청이 성공적으로 이루어졌습니다.'
var FEEDBACK_REQUEST_PUSH_MSG_FAILED = '푸시 메시지 전송 요청중 문제가 발생하였습니다.'
var FEEDBACK_GENERATE_TOKEN_FAILED = '보안 토큰을 생성하는데 문제가 발생하였습니다.'

