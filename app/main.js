////////////////////////////////////////////////////////////////////////
//

var DIALOGS = {
	sendRecipe:{ url:'html/send_recipe.html', w:480, h:460 }
};
var MARKER = "gmchecker";
var composeButtonList = { "ja":"作成", "en":"Compose", "zh_CN":"写邮件", "zh_TW":"撰寫", "ko":"편지쓰기" };
var sendButtonList = { "ja":"送信", "en":"Send", "zh_CN":"发送", "zh_TW":"傳送", "ko":"보내기" };
var sendButtonTitle;

jQuery(function(){ main(); });

////////////////////////////////////////////////////////////////////////
//
var Lang = function(){
	var lang;
	return {
		type: function(){
			if (!lang) {
				lang = "en";			// とりあえずデフォルトは英語
				var s = $('div.T-I-KE[role="button"]').text();
				for (var key in composeButtonList) {
					if (composeButtonList[key] == s) {
						lang = key;
						break;
					}
				}
 			}
 			return lang;
		}
	};
}();

////////////////////////////////////////////////////////////////////////
//

function main() {
	// 設定変更イベントリスナ
	chrome.storage.onChanged.addListener(function(changes, namespace){
		if (namespace == "sync") {
opts.verbose && console.log("config changed");
			// 設定を再取得
			getOptions();
		}
	});

	// 設定
	var opts = {
		tocc:"",
		confirm_sent:false,
		keywords:[],
		force_bcc:[],
		verbose:false,
		license:"",
		premium:false
	};

	document.addEventListener("click", function(ev) {
		// 誤送信対策有効？
		if (!opts.confirm_sent) { return; }
opts.verbose && console.log('click');
		var res = onSendButton(ev);
		if (res) {
			// 送信ボタンがクリックされた
			if ($.data(res.target, "marker") == MARKER) {
opts.verbose && console.log('Send it!');
				// 確認ダイアログからの通知なら、そのままデフォルトの処理をおこなう（送信）
				$.data(res.target, "marker", null);
				return true;
			}
opts.verbose && console.log('go dialog');
			if (checkMessage(res)) {
				ev.preventDefault();
				ev.stopPropagation();
				return false;
			}
		}
		return true;
	}, true); // キャプチャリングフェーズ（useCapture=true）として、内側のイベントハンドラを外側のハンドラより先に実行させる。なのでjqueryの'on'などは使えない。

	document.addEventListener("keydown", function(ev) {
		// 誤送信対策有効？
		if (!opts.confirm_sent) { return; }
		if (Dialog.processKey(ev)) {
			ev.preventDefault();
			ev.stopPropagation();
			return false;
		}

		var sb = onSendButton(ev);		// 送信ボタンにフォーカスがあってのkeydownイベントかどうか
		if ((sb && (ev.keyCode == KEYS.VK_ENTER || ev.keyCode == KEYS.VK_SPACE)) ||
			(ev.keyCode == KEYS.VK_ENTER && ((ev.ctrlKey && !ev.metaKey) || (!ev.ctrlKey && ev.metaKey)))) {
			// Ctrl+Enter押下時、メール編集画面が開いているなら、チェック処理をおこなう
opts.verbose && console.log("Ctrl + Enter");
			var btn = findSendButton();
			if (btn) {
opts.verbose && console.log("find send button");
				$(btn).trigger("click");
				ev.preventDefault();
				ev.stopPropagation();
				return false;
			}
		}
	}, true);

	// まず設定を読んでおく
	getOptions();
	// 使用言語ごとの送信ボタンラベル
	sendButtonTitle = sendButtonList[ Lang.type() ];

console.log("GM Checker initilized");

	//-----------------------------------------------------------------
	//
	//-----------------------------------------------------------------
	function getOptions() {
		chrome.extension.sendMessage({cmd: "get_options"}, function(res) { $.extend(opts, res.options); });
	};

	//-----------------------------------------------------------------
	// セレクタ内の':'をエスケープする（jquery）
	//-----------------------------------------------------------------
	function escapeSelector(id) {
		return id.replace(':', '\\:');
	};

	//-----------------------------------------------------------------
	// 新しい送信画面からフォームの値を取得
	//-----------------------------------------------------------------
	function getFormValues(target) {
opts.verbose && console.debug('getFormValues');
		// submitされたボタンのformタグを取得する。
		var t = $(target).parent().get(0);
		var f;
		while (!f && t) {
			f = $('form', t).get(0);
			t = t.parentNode;
		}
		if (!f) {
			alert(loadStr("unexpectedError", 10));
			return false;
		}
		var res = {};
		var formid = "#" + escapeSelector($(f).attr('id'));
		// セレクタ
		res.form = f;
		res.from = f.from.value;
		res.mydomain = res.from ? ("@" + getDomain(res.from)).toLowerCase() : "";
		// to,cc,bccのアドレスを取得
		[ "to","cc","bcc" ].forEach(function(n){
			res[n] = [];
			$(f[n]).each(function(){ this.value && res[n].push(this.value); });
		});
		// 題名
		res.subject = f.subjectbox.value;
		// 本文
		res.body = getBody(target);
		// 添付ファイル名
		res.attach = [];
		$(f.parentNode).find('div.dL a.dO').each(function(){
			res.attach.push( $('div.vI', this).text() + $('div.vJ', this).text() );
		});
		return res;
	}

	//-----------------------------------------------------------------
	// 古い送信画面からフォームの値を取得
	//-----------------------------------------------------------------
	function getOldFormValues(target) {
		console.debug('getOldFormValues');

		var f = $(target).closest('form');

		var res = {};
		res.form = f;
		res.from = f.from.value;
		if (res.from) {
			res.mydomain = ("@" + getDomain(from)).toLowerCase();
		}
		// to,cc,bccのアドレスを取得
		res.to = f.to.value.split(",").removeEmpty();
		res.cc = f.cc.value.split(",").removeEmpty();
		res.bcc = f.bcc.value.split(",").removeEmpty();
		res.subject = f.subject.value;
		res.body = getBodyOld(target);
		return res;
	}

	//-----------------------------------------------------------------
	// メール内容のチェックと確認ダイアログの表示
	// 戻り値 true:  確認画面を表示
	//        false: オリジナルで処理
	//-----------------------------------------------------------------
	function checkMessage(param) {
		// 設定をもう一度読む
		getOptions();

		var sendButton = param.target;
		var info = param.oldStyle ? getOldFormValues(sendButton) : getFormValues(sendButton);

		var from = info.from;
		var mydomain = info.mydomain;
		var to = info.to;
		var cc = info.cc;
		var bcc = info.bcc;
		var subject = info.subject;
		var body = info.body;
		var FORM = info.form;

		// 送り先メールアドレスチェック
		if (to.length + cc.length + bcc.length == 0) {
			// オリジナルに処理させる
			return false;
		}

		var alerts = [];
		// to+cc件数チェック
		(to.length + cc.length > opts.tocc) &&
			alerts.push(loadStr("toccLimitOver", opts.tocc));
		// 題名チェック
		isEmpty(subject) && alerts.push(resStr("noSubject"));
		// 本文チェック
		isEmpty(body) && alerts.push(resStr("noBodyText"));
		// キーワードチェック  
		if (!isEmpty(opts.keywords)) {
			// console.debug("body:"+body);
			opts.keywords.forEach(function(value) {
				if (body && body.indexOf(value) != -1) {
					alerts.push(loadStr("keywordWarningBody", value));
				}
				if (subject && subject.indexOf(value) != -1) {
					alerts.push(loadStr("keywordWarningSubject", value));
				}
			});
		}
		// マイナンバーチェック
		!isEmpty(body) && body.match(/[^\d-\.]\d{4}[-_\. ]?\d{4}[-_\. ]?\d{4}[^\d-\.]/) && alerts.push(resStr("foundMyNumber"));
		// 確認画面を表示する
		dialogOpen({resource: DIALOGS.sendRecipe,
			oninit: function(){
				this.form = $(document).find("form[name=form_receipts]").get(0);
				// テーブル内非表示
				$(this.form).find('table tr').hide();
				// 警告あり
				var cargo;
				if (!isEmpty(alerts)) {
					cargo = $('#warn_info');
					alerts.forEach(function(w){ $('<li>').text(w).appendTo(cargo); });
					cargo.parent().show();
				}
				// to, cc, bcc
				[ "to", "cc", "bcc" ].forEach(function(n){
					if (!isEmpty(info[n])) {
						cargo = $('#rt_' + n);
						info[n].forEach(function(a){
							var inner;
							if (opts.premium && opts.reinforce) {
								inner = '<label><input type="checkbox">&nbsp;' + escapeHtml(a) + '</label>';
							} else {
								inner = escapeHtml(a);
							}
							$('<div>').attr("class", "eml").html(inner).appendTo(cargo);
						});
						cargo.parent().show().next().show();
					}
				});
				// bcc自動追加
				if (!isEmpty(opts.force_bcc)) {
					cargo = $('#rt_bcc');
					opts.force_bcc.forEach(function(s){
						$('<div style="color:#666">').text(resStr("autoAppend") + " " + s).appendTo(cargo);
					});
					cargo.parent().show().next().show();
				}

				// 添付ファイル
				if (!isEmpty(info.attach)) {
					cargo = $('#rt_attach');
					info.attach.forEach(function(a, i){
						var inner;
						if (opts.premium) {
							if (i == 0) {
								inner = '<label><input type="checkbox">&nbsp;' + escapeHtml(a) + '</label>';
							} else {
								inner = '<label><input type="radio" style="visibility:hidden">&nbsp;' + escapeHtml(a) + '</label>'
							}
						} else {
							inner = escapeHtml(a);
						}
						$('<div>')
							.attr("class", "eml")
							.html(inner)
							.appendTo(cargo);
					});
					cargo.parent().show();
				}

				// 動的に作成したチェックボックスのハンドラ
				if (opts.premium && opts.reinforce) {
					this.form.ok.disabled = true;
					$(this.form).find(':checkbox').on("click", this.form, function(ev){
						var f = ev.data;
//@						$(this).parent('label').toggleClass('emLc', this.checked);
						var checker = $(f).find(':checkbox');
						f.ok.disabled = (checker.length != checker.filter(':checked').length);
					}).eq(0).focus();
				} else {
					this.form[isEmpty(alerts) ? "ok" : "cancel"].focus();
				}
			},
			onsubmit: function(){
				Dialog.close();
				// bcc自動追加分のデータをフォームに挿入
				if (!isEmpty(opts.force_bcc)) {
					opts.force_bcc.forEach(function(s){
						$('<input>').attr({type:"hidden",name:"bcc"}).val(s).appendTo($(FORM));
					});
				}
				$(sendButton).data("marker", MARKER).trigger("click");
			}
		});
		return true;
	}

	//-----------------------------------------------------------------
	//
	//-----------------------------------------------------------------
	function getBody(target) {
		var body = null;
		// 本文エレメントを探す
		var t = $(target).parent().get(0);
		var bodyElement = null;
		var bodyclass = ".Am.Al.editable.LW-avf";

		while(bodyElement == null && t != null) {
			$(t).find(bodyclass).each(function() {
				bodyElement = $(this);
				body = $(this).text();
			});
			t = $(t).parent().get(0);
		}
		return body;
	}

	//-----------------------------------------------------------------
	//
	//-----------------------------------------------------------------
	function getBodyOld(target) {
		var elemHtml = $('iframe.editable').contents().find('body');
		var elemPlain = $('textarea[form=nosend]');
		console.log('body' + elemPlain.val());
		return elemHtml.text() + elemPlain.val();
	}

	//-----------------------------------------------------------------
	// 送信ボタンでのイベント（クリックなど）が発生したかをチェック
	//-----------------------------------------------------------------
	function onSendButton(event) {
		var target = event.target;
		var os = false;
		if (isEmpty(target.className)) {
			// nullのときは古い画面
			target = target.parentNode;
			os = true;
		} else {
			// 古い画面かの判定
			os = !newStyle();
		}

opts.verbose && console.log('button=' + target.className);
		if ($(target).attr("role") != "button" ||
			!$(target).hasClass("T-I-atl") ||
			target.textContent != sendButtonTitle) {
			return null;
		}
		return {
			target: target,
			oldStyle: os,
			event: event
		};
	}

	//-----------------------------------------------------------------
	//
	//-----------------------------------------------------------------
	function findSendButton() {
		var btn = $('div.T-I-atl[role="button"]:visible').get(0);
		return (btn && btn.textContent == sendButtonTitle) ? btn : null;
	}

	//-----------------------------------------------------------------
	//
	//-----------------------------------------------------------------
	function newStyle() {
		var ele = $('iframe.editable').contents().find('body');
		// console.log('new=['+(ele.text())+']');
		// console.log('new=['+(ele.css('display'))+']');
		return ele.css('display') == undefined;
	}

	//-----------------------------------------------------------------
	// メールアドレスからドメインを抜き出す
	// メールアドレスの正規表現は http://blog.livedoor.jp/dankogai/archives/51189905.html から。
	//-----------------------------------------------------------------
	function getDomain(email) {
		var ma = email.match(/(^(?:(?:(?:(?:[a-zA-Z0-9_!#\$\%&'*+/=?\^`{}~|\-]+)(?:\.(?:[a-zA-Z0-9_!#\$\%&'*+/=?\^`{}~|\-]+))*)|(?:"(?:\\[^\r\n]|[^\\"])*"))))\@((?:(?:(?:(?:[a-zA-Z0-9_!#\$\%&'*+/=?\^`{}~|\-]+)(?:\.(?:[a-zA-Z0-9_!#\$\%&'*+/=?\^`{}~|\-]+))*)|(?:\[(?:\\\S|[!-Z^-~])*\])))$)/);
		return ma ? ma[2] : null;
	}
}
