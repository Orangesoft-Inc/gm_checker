// background.js

var CONFIG = {
	TO_CC: "jp.co.orangesoft.GM_Checker.config.to_cc",
	CONFIRM_SENT: "jp.co.orangesoft.GM_Checker.config.confirm_sent",
	KEYWORD: "jp.co.orangesoft.GM_Checker.config.keywords",
	FORCE_BCC: "jp.co.orangesoft.GM_Checker.config.force_bcc",
	REINFORCE: "jp.co.orangesoft.GM_Checker.config.reinforce",
	LICENSE:  "jp.co.orangesoft.GM_Checker.config.license",
	VERBOSE:  "jp.co.orangesoft.GM_Checker.config.verbose",
	VERSION:  "jp.co.orangesoft.GM_Checker.config.version"
};

String.prototype.toLineArray = function() { return this != "" ? this.replace(/\r/g, "").split(/\n+/) : []; }

window.onload = function() {
	// マニフェストを読む
	var manifest;
	get_manifest(function(m){ manifest = m; });
	// 通信用リスナ登録
	chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
		switch (request.cmd) {
		case "get_options":
			sendResponse({ options: getOptions() });
			break;
		case "set_options":
			localStorage[request.key] = request.value;
			sendResponse("ok");
			break;
		case "get_version":
			sendResponse({ version: manifgest ? manifest.version : "" });
			break;
		}
	});
}

function getOptions() {
	var options = {
		confirm_sent: false,
		tocc: 10,
		tocc_outer: 10,
		keywords: null,
		force_bcc: null,
		reinforce: false,
		verbose: false,
		version: "",
		license: "",
		premium: false
	};

	var v = localStorage.getItem(CONFIG.TO_CC);
	if (v) {
		options.tocc = options.tocc_outer = parseInt(v);
	}
	options.confirm_sent = (localStorage.getItem(CONFIG.CONFIRM_SENT) == 'true');
	v = localStorage.getItem(CONFIG.KEYWORD);
	if (v) {
		options.keywords = v.toLineArray();
	}
	v = localStorage.getItem(CONFIG.FORCE_BCC);
	if (v) {
		options.force_bcc = v.toLineArray();
	}
	options.reinforce = (localStorage.getItem(CONFIG.REINFORCE) == 'true');
	options.verbose = (localStorage.getItem(CONFIG.VERBOSE) == 'true');
	v = localStorage.getItem(CONFIG.VERSION);
	if (v) {
		options.version = v;
	}
	v = localStorage.getItem(CONFIG.LICENSE);
	if (v && Premium.validate(v)) {
		options.license = v;
		options.premium = true;
	}
	return options;
}

function get_manifest(callback) {
	var url = '/manifest.json';
	var xhr = new XMLHttpRequest();
	xhr.onload = function() {
		callback(JSON.parse(xhr.responseText));
	};
	xhr.open('GET',url,true);
	xhr.send(null);
}

// ----- for page action ----------------------

function matchUrl(tab) {
	var re = /http(s)*:\/\/mail.google.com\//;
	return (tab && tab.url && tab.url.match(re));
}

chrome.tabs.onUpdated.addListener(function(tabId, change, tab) {
	if (change.status == "complete") {
		matchUrl(tab) ? chrome.pageAction.show(tabId) : chrome.pageAction.hide(tabId);
	}
});

// Ensure the current selected tab is set up.
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	var tab = tabs[0];
	matchUrl(tab) ? chrome.pageAction.show(tab.id) : chrome.pageAction.hide(tab.id);
});
