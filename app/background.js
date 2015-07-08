//background.js

var CONFIG = {
	TO_CC: "jp.co.orangesoft.GM_Checker.config.to_cc",
	CONFIRM_SENT: "jp.co.orangesoft.GM_Checker.config.confirm_sent",
	KEYWORD: "jp.co.orangesoft.GM_Checker.config.keywords",
	FORCE_BCC: "jp.co.orangesoft.GM_Checker.config.force_bcc",
	LICENSE:  "jp.co.orangesoft.GM_Checker.config.license",
	VERBOSE:  "jp.co.orangesoft.GM_Checker.config.verbose"
};

String.prototype.toLineArray = function() { return this != "" ? this.replace(/\r/g, "").split(/\n+/) : []; }

window.onload = function() {
	chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
		switch (request.cmd) {
		case "get_options":
			sendResponse({ options: getOptions() });
			break;
		case "set_options":
			localStorage[request.key] = request.value;
			sendResponse("ok");
			break;
		}
	});
}

function getOptions() {
	var options = {
		tocc: 10,
		tocc_outer: 10,
		confirm_sent: true,
		verbose: true,
		license: "",
		premium: true
	};

	var v = localStorage[CONFIG.TO_CC];
	if (v) {
		options.tocc = options.tocc_outer = parseInt(v);
	}
	v = localStorage[CONFIG.CONFIRM_SENT];
	if (v) {
		options.confirm_sent = Boolean(v);
	}
	v = localStorage[CONFIG.KEYWORD];
	if (v) {
		options.keywords = v.toLineArray();
	}
	v = localStorage[CONFIG.FORCE_BCC];
	if (v) {
		options.force_bcc = v.toLineArray();
	}
	v = localStorage[CONFIG.VERBOSE];
	if (v) {
		options.verbose = Boolean(v);
	}
	v = localStorage[CONFIG.LICENSE];
	if (v && Premium.validate(v)) {
		options.license = v;
	}
	return options;
}

