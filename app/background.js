//background.js

var CONFIG = {
    TO_CC: "jp.co.orangesoft.GM_Checker.config.to_cc",
    CONFIRM_SENT: "jp.co.orangesoft.GM_Checker.config.confirm_sent",
    KEYWORD: "jp.co.orangesoft.GM_Checker.config.keywords",
    FORCE_BCC: "jp.co.orangesoft.GM_Checker.config.force_bcc",
};


window.onload = init

function init() {
    chrome.extension.onMessage.addListener(
      function(request, sender, sendResponse) {
        if (request.cmd == "get_options"){
            sendResponse({
                options: getOptions()
            });
        }else if(request.cmd == "set_options"){
            localStorage[request.key] = request.value;
        }
        sendResponse("ok");
      });
}

function getOptions() {
    var options = {
        tocc: 10,
        tocc_outer: 10,
        confirm_sent: true
    };

    var tocc = localStorage[CONFIG.TO_CC];
    if(tocc != null){
        options.tocc = options.tocc_outer = parseInt(tocc);
    }
    var confirm_sent = localStorage[CONFIG.CONFIRM_SENT];
    if(confirm_sent != null){
        options.confirm_sent = (confirm_sent == 'true');
    }
    var val = localStorage[CONFIG.KEYWORD];
    if(val != null){
        options.keywords = val.split(/\r\n|\r|\n/);
    }
    var val = localStorage[CONFIG.FORCE_BCC];
    if(val != null){
        options.force_bcc = val.split(/\r\n|\r|\n/);
    }
    return options;
}

