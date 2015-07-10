var EVKEYUP = "keyup.gmc";
var EVCLICK = "click.gmc";

var CONFIG = {
	TO_CC: "jp.co.orangesoft.GM_Checker.config.to_cc",
	CONFIRM_SENT: "jp.co.orangesoft.GM_Checker.config.confirm_sent",
	KEYWORD: "jp.co.orangesoft.GM_Checker.config.keywords",
	FORCE_BCC: "jp.co.orangesoft.GM_Checker.config.force_bcc",
	REINFORCE: "jp.co.orangesoft.GM_Checker.config.reinforce",
	LICENSE:  "jp.co.orangesoft.GM_Checker.config.license",
	VERBOSE:  "jp.co.orangesoft.GM_Checker.config.verbose"
};

$(document).ready(function(){
	// 言語対応
	$('[data-i18n]').each(function(){
		var s = resStr(this.dataset.i18n);
		if (this.tagName == "INPUT") {
			this.value = s;
		} else {
			$(this).text(s);
		}
	});
	var opts = {};
	var upds = {};
	opts.tocc = localStorage.getItem(CONFIG.TO_CC) || 10;
	$("#to_cc").val(opts.tocc).on('change', function(){ upds.tocc = this.value; anyChanged(); });
	opts.confirm_sent = (localStorage.getItem(CONFIG.CONFIRM_SENT) == 'true');
	$("#confirm_sent").prop('checked', opts.confirm_sent).on('click', function() { upds.confirm_sent = this.checked; anyChanged(); });
	opts.keyword = localStorage.getItem(CONFIG.KEYWORD) || "";
	$('#keywords').val(opts.keyword).on('keyup', function() { upds.keyword = this.value; anyChanged(); });
	opts.force_bcc = localStorage.getItem(CONFIG.FORCE_BCC) || "";
	$('#force_bcc').val(opts.force_bcc).on('keyup', function() { upds.force_bcc = this.value; anyChanged(); });
	opts.reinforce = (localStorage.getItem(CONFIG.REINFORCE) == 'true');
	$("#reinforce").prop('checked', opts.reinforce).on('click', function() { upds.reinforce = this.checked; anyChanged(); });
//	opts.verbose = (localStorage.getItem(CONFIG.VERBOSE) == 'true');
//	$("#verbose").prop('checked', opts.verbose).on('click', function() { upds.verbose = this.checked; anyChanged(); });
	$("#verbose").closest('div.par').hide();
	opts.license = localStorage.getItem(CONFIG.LICENSE) || "";
	// ライセンスチェック
	$('#license').val(opts.license);
	if (!opts.license || !validateLicense(opts.license)) {
		toActivate();
	} else {
		toDeactivate();
	}
	$.extend(upds, opts);
	anyChanged();

	$('#apply').on("click", function(ev){
		localStorage.setItem(CONFIG.TO_CC, upds.tocc);
		localStorage.setItem(CONFIG.CONFIRM_SENT, upds.confirm_sent);
		localStorage.setItem(CONFIG.KEYWORD, upds.keyword);
		localStorage.setItem(CONFIG.FORCE_BCC, upds.force_bcc);
		localStorage.setItem(CONFIG.REINFORCE, upds.reinforce);
		localStorage.setItem(CONFIG.VERBOSE, upds.verbose);
		$.extend(opts, upds);
		this.disabled = true;
		$('#tip').show().fadeOut(1000);

		// 変更をメッセージで通知
//		chrome.extension.sendMessage({cmd:"gmchecker", config:JSON.stringify(opts)}, function(resp){});
		chrome.storage.sync.set({update:$.now()}, function(){});
	});

	function anyChanged() {
		var changed = false;
		for (var key in opts) {
			if (opts[key] != upds[key]) { changed = true; }
		}
		$('#apply').prop('disabled', !changed);
	};

	function validateLicense(key) {
		var ok = Premium.validate(key);
		var res = Premium.result();
		if (ok) {
//			$('#license').prop("readonly", true);
			$('#activate').prop("disabled", true);
			$('#activate').val(resStr("activated"));
			var s = resStr("licensePeriod")
					.replace("%Y", res.limit[0])
					.replace("%M", res.limit[1])
					.replace("%D", res.limit[2])
					.replace("%L", res.left);
			$('#leftdate').text(s);
			return true;
		} else {
			if (res.code == 4) {		// 期限切れ
				$('#leftdate').val("limit over");
			}
		}
		return false;
	};

	function toActivate() {
		$('#license')
			.off(EVKEYUP)
			.on(EVKEYUP, function() { upds.license = this.value; anyChanged(); });
		// ライセンス登録処理
		$('#activate')
			.off(EVCLICK)
			.on(EVCLICK, function(ev){
				var k = $('#license').val();
				if (validateLicense(k)) {
					localStorage.setItem(CONFIG.LICENSE, k);
					$('#reinforce').prop('disabled', false);
					toDeactivate();
				}
			});
	};

	function toDeactivate() {
		// ライセンス解除処理
		$('#license')
			.off(EVKEYUP)
			.on(EVKEYUP, function() {
				if (opts.license != this.value) {
					$('#activate').prop("disabled", false);
					$('#activate').val(resStr("deactivate"));
				} else {
					$('#activate').prop("disabled", true);
					$('#activate').val(resStr("activated"));
				}
			});
		$('#activate')
			.off(EVCLICK)
			.on(EVCLICK, function(ev){
				localStorage.setItem(CONFIG.LICENSE, "");
				$('#license').val("");
				$('#leftdate').text("");
				$('#activate').val(resStr("activate"));
				$('#reinforce').prop('disabled', true);
				toActivate();
		});
	};
});

