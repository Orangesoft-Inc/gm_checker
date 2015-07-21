// storage.js

function gmcSetConfig(cfg, callback) {
	chrome.storage.sync.set(cfg, callback);
}

function gmcGetConfig(defs, callback) {
	chrome.storage.sync.get(defs, function(loaded) { callback(loaded); });
}

function gmcStorageOnChanged(callback) {
	chrome.storage.onChanged.addListener(function(changes, namespace){
		if (namespace == "sync") {
			var diff = {};
			for (key in changes) {
				var item = changes[key];
				diff[key] = item.newValue;
			}
			callback(diff);
		}
	});
}
