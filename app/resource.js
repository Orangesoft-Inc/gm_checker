/////////////////////////////////////////////////////////////////////////
// resource.js


function resStr(name) {
	try {
		var s = chrome.i18n.getMessage(name);
		if (s) { return s; }
	} catch (e) { }
	return name;
}

function loadStr(name) {
	try {
		var s = chrome.i18n.getMessage(name);
		if (s) {
			for (var i = 1; i < arguments.length; i++) { s = s.replace("%" + i, arguments[i], "g"); }
			return s;
		}
	} catch (e) { }
	return name;
}
